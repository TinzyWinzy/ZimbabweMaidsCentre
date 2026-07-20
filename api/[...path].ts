import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

type Role = 'employer' | 'worker' | 'admin' | 'verifier'
type CurrentUser = { id: string; email: string; displayName: string; role: Role; isVerified: boolean }

const databaseUrl = process.env.DATABASE_URL
const sql = databaseUrl ? neon(databaseUrl) : null
const sessionDays = 14

function db() {
  if (!sql) throw new Error('DATABASE_URL is not configured')
  return sql
}

function json(res: VercelResponse, status: number, data: unknown) {
  return res.status(status).json(data)
}

function cookie(req: VercelRequest, name: string) {
  const header = req.headers.cookie || ''
  return header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

function verifyPassword(password: string, stored: string) {
  const [salt, expectedHex] = stored.split(':')
  if (!salt || !expectedHex) return false
  const actual = scryptSync(password, salt, 64)
  const expected = Buffer.from(expectedHex, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

async function createSession(res: VercelResponse, userId: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + sessionDays * 86400000)
  await db()`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (${userId}, ${hashToken(token)}, ${expiresAt})`
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `zmc_session=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${sessionDays * 86400}`)
}

async function currentUser(req: VercelRequest): Promise<CurrentUser | null> {
  const token = cookie(req, 'zmc_session')
  if (!token) return null
  const rows = await db()`
    SELECT u.id, u.email, u.display_name, u.role, u.is_verified
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > now()
    LIMIT 1`
  const row = rows[0]
  return row ? {
    id: row.id as string, email: row.email as string, displayName: row.display_name as string,
    role: row.role as Role, isVerified: row.is_verified as boolean,
  } : null
}

function userDto(user: CurrentUser) {
  return {
    uid: user.id, email: user.email, phoneNumber: null, displayName: user.displayName,
    photoURL: null, role: user.role, isVerified: user.isVerified,
  }
}

function pathOf(req: VercelRequest) {
  const raw = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || ''
  return `/${raw}`.replace(/\/+$/, '') || '/'
}

async function requireUser(req: VercelRequest, res: VercelResponse, roles?: Role[]) {
  const user = await currentUser(req)
  if (!user) {
    json(res, 401, { error: 'Authentication required' })
    return null
  }
  if (roles && !roles.includes(user.role)) {
    json(res, 403, { error: 'You do not have permission to perform this action' })
    return null
  }
  return user
}

function mapJob(row: Record<string, unknown>) {
  return {
    id: row.id, employerId: row.employer_id, title: row.title, description: row.description,
    workerType: row.worker_type, location: { city: row.city, suburb: row.suburb },
    salaryRange: { min: Number(row.salary_min), max: Number(row.salary_max), currency: row.currency },
    requirements: row.requirements, status: row.status, createdAt: row.created_at, expiresAt: row.expires_at,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = pathOf(req)

    if (path === '/health' && req.method === 'GET') {
      await db()`SELECT 1`
      return json(res, 200, { ok: true, database: 'neon' })
    }

    if (path === '/auth/register' && req.method === 'POST') {
      const { email, password, name, role } = req.body || {}
      if (!email || !name || !['employer', 'worker'].includes(role) || typeof password !== 'string' || password.length < 8) {
        return json(res, 400, { error: 'Name, valid role, email and password of at least 8 characters are required' })
      }
      const normalized = String(email).trim().toLowerCase()
      const existing = await db()`SELECT id FROM users WHERE email = ${normalized}`
      if (existing.length) return json(res, 409, { error: 'An account with this email already exists' })
      const rows = await db()`
        INSERT INTO users (email, password_hash, display_name, role)
        VALUES (${normalized}, ${hashPassword(password)}, ${String(name).trim()}, ${role})
        RETURNING id, email, display_name, role, is_verified`
      const row = rows[0]
      if (role === 'worker') {
        await db()`INSERT INTO worker_profiles (user_id, full_name) VALUES (${row.id}, ${row.display_name})`
      } else {
        await db()`INSERT INTO employer_profiles (user_id, full_name) VALUES (${row.id}, ${row.display_name})`
      }
      await createSession(res, row.id as string)
      return json(res, 201, userDto({ id: row.id as string, email: row.email as string, displayName: row.display_name as string, role: row.role as Role, isVerified: false }))
    }

    if (path === '/auth/login' && req.method === 'POST') {
      const { email, password } = req.body || {}
      const rows = await db()`SELECT id, email, password_hash, display_name, role, is_verified FROM users WHERE email = ${String(email || '').trim().toLowerCase()} LIMIT 1`
      const row = rows[0]
      if (!row || !verifyPassword(String(password || ''), row.password_hash as string)) {
        return json(res, 401, { error: 'Invalid email or password' })
      }
      await createSession(res, row.id as string)
      return json(res, 200, userDto({ id: row.id as string, email: row.email as string, displayName: row.display_name as string, role: row.role as Role, isVerified: row.is_verified as boolean }))
    }

    if (path === '/auth/session' && req.method === 'GET') {
      const user = await currentUser(req)
      return json(res, 200, { user: user ? userDto(user) : null })
    }

    if (path === '/auth/logout' && req.method === 'POST') {
      const token = cookie(req, 'zmc_session')
      if (token) await db()`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
      res.setHeader('Set-Cookie', `zmc_session=; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=0`)
      return json(res, 200, { ok: true })
    }

    const user = await requireUser(req, res)
    if (!user) return

    if (path === '/jobs' && req.method === 'GET') {
      const rows = user.role === 'employer'
        ? await db()`SELECT * FROM jobs WHERE employer_id = ${user.id} ORDER BY created_at DESC`
        : await db()`SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC`
      return json(res, 200, rows.map((row) => mapJob(row)))
    }

    if (path === '/jobs' && req.method === 'POST') {
      if (user.role !== 'employer') return json(res, 403, { error: 'Only employers can create jobs' })
      const job = req.body || {}
      const rows = await db()`
        INSERT INTO jobs (employer_id, title, description, worker_type, city, suburb, salary_min, salary_max, currency, requirements, status, expires_at)
        VALUES (${user.id}, ${job.title}, ${job.description}, ${job.workerType}, ${job.location?.city}, ${job.location?.suburb},
          ${job.salaryRange?.min}, ${job.salaryRange?.max}, ${job.salaryRange?.currency || 'USD'}, ${JSON.stringify(job.requirements || {})},
          ${job.status || 'active'}, ${job.expiresAt ? new Date(job.expiresAt) : new Date(Date.now() + 30 * 86400000)})
        RETURNING *`
      return json(res, 201, mapJob(rows[0]))
    }

    if (path === '/profile' && req.method === 'GET') {
      if (user.role === 'worker') {
        const rows = await db()`SELECT * FROM worker_profiles WHERE user_id = ${user.id}`
        const p = rows[0]
        if (!p) return json(res, 200, null)
        return json(res, 200, {
          uid: p.user_id, fullName: p.full_name, dateOfBirth: p.date_of_birth, gender: p.gender,
          location: { city: p.city, suburb: p.suburb }, skills: p.skills, experienceYears: p.experience_years,
          expectedSalary: { min: Number(p.salary_min), max: Number(p.salary_max), currency: p.currency },
          availability: p.availability, languages: p.languages, bio: p.bio, photoURL: p.photo_url || '',
          verificationStatus: p.verification_status, phoneNumber: p.phone_number || '',
          whatsappNumber: p.whatsapp_number || '', contactVisible: p.contact_visible,
          rating: Number(p.rating), reviewCount: p.review_count, createdAt: p.created_at, updatedAt: p.updated_at,
        })
      }
      const rows = await db()`SELECT * FROM employer_profiles WHERE user_id = ${user.id}`
      const p = rows[0]
      return json(res, 200, p ? {
        uid: p.user_id, fullName: p.full_name, location: { city: p.city, suburb: p.suburb },
        householdSize: p.household_size, preferences: p.preferences, verificationStatus: p.verification_status,
      } : null)
    }

    if (path === '/profile' && req.method === 'PATCH') {
      const p = req.body || {}
      if (user.role === 'worker') {
        await db()`UPDATE worker_profiles SET full_name=${p.fullName}, gender=${p.gender || null}, city=${p.location?.city || ''},
          suburb=${p.location?.suburb || ''}, skills=${p.skills || []}, experience_years=${p.experienceYears || 0},
          bio=${p.bio || ''}, updated_at=now() WHERE user_id=${user.id}`
      } else {
        await db()`UPDATE employer_profiles SET full_name=${p.fullName}, city=${p.location?.city || ''},
          suburb=${p.location?.suburb || ''}, household_size=${p.householdSize || 1}, updated_at=now() WHERE user_id=${user.id}`
      }
      return json(res, 200, { ok: true })
    }

    if (path === '/matches' && req.method === 'GET') {
      const rows = user.role === 'employer'
        ? await db()`SELECT m.* FROM matches m JOIN jobs j ON j.id=m.job_id WHERE j.employer_id=${user.id} ORDER BY m.score DESC`
        : await db()`SELECT * FROM matches WHERE worker_id=${user.id} ORDER BY score DESC`
      return json(res, 200, rows.map((m) => ({
        id: m.id, jobId: m.job_id, workerId: m.worker_id, score: Number(m.score), reasons: m.reasons,
        status: m.status, placementFeePaid: m.placement_fee_paid, connectionFeePaid: m.connection_fee_paid,
        rank: m.rank, createdAt: m.created_at, confirmedAt: m.confirmed_at,
      })))
    }

    if (path === '/payments' && req.method === 'GET') {
      const rows = await db()`SELECT * FROM payments WHERE user_id=${user.id} ORDER BY created_at DESC`
      return json(res, 200, rows.map((p) => ({
        id: p.id, userId: p.user_id, type: p.type, amount: Number(p.amount), currency: p.currency,
        matchId: p.match_id, method: p.method, status: p.status, gatewayReference: p.gateway_reference,
        createdAt: p.created_at, updatedAt: p.updated_at,
      })))
    }

    if (path === '/payments' && req.method === 'POST') {
      const p = req.body || {}
      const rows = await db()`INSERT INTO payments (user_id, type, amount, currency, match_id, method)
        VALUES (${user.id}, ${p.type}, ${p.amount}, ${p.currency}, ${p.matchId || null}, ${p.method}) RETURNING id`
      return json(res, 201, { paymentId: rows[0].id, status: 'pending', message: 'Payment request recorded' })
    }

    if (path === '/verifications' && req.method === 'GET') {
      const rows = ['admin', 'verifier'].includes(user.role)
        ? await db()`SELECT * FROM verifications ORDER BY created_at DESC`
        : await db()`SELECT * FROM verifications WHERE worker_id=${user.id} ORDER BY created_at DESC`
      return json(res, 200, rows.map((v) => ({
        id: v.id, workerId: v.worker_id, type: v.type, status: v.status, documents: v.documents,
        reviewerNotes: v.reviewer_notes, reviewedBy: v.reviewed_by, createdAt: v.created_at, reviewedAt: v.reviewed_at,
      })))
    }

    if (path === '/verifications' && req.method === 'POST') {
      if (user.role !== 'worker') return json(res, 403, { error: 'Only workers can submit verification documents' })
      const v = req.body || {}
      const rows = await db()`INSERT INTO verifications (worker_id, type, documents)
        VALUES (${user.id}, ${v.type}, ${v.documents || []}) RETURNING id`
      return json(res, 201, { id: rows[0].id })
    }

    if (path === '/verifications' && req.method === 'PATCH') {
      if (!['admin', 'verifier'].includes(user.role)) return json(res, 403, { error: 'Reviewer access required' })
      const v = req.body || {}
      await db()`UPDATE verifications SET status=${v.status}, reviewer_notes=${v.notes || ''}, reviewed_by=${user.id}, reviewed_at=now()
        WHERE id=${v.verificationId}`
      return json(res, 200, { ok: true })
    }

    if (path === '/stats' && req.method === 'GET') {
      if (user.role !== 'admin') return json(res, 403, { error: 'Admin access required' })
      const [users, jobs, verifications, revenue] = await Promise.all([
        db()`SELECT count(*)::int AS count FROM users`,
        db()`SELECT count(*)::int AS count FROM jobs WHERE status='active'`,
        db()`SELECT count(*)::int AS count FROM verifications WHERE status='pending'`,
        db()`SELECT coalesce(sum(amount), 0)::numeric AS total FROM payments WHERE status='success'`,
      ])
      return json(res, 200, {
        totalUsers: users[0].count, activeJobs: jobs[0].count,
        pendingVerifications: verifications[0].count, totalRevenue: Number(revenue[0].total),
      })
    }

    return json(res, 404, { error: 'Not found' })
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Unexpected server error'
    return json(res, 500, { error: process.env.NODE_ENV === 'production' ? 'Server request failed' : message })
  }
}
