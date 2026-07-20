import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { scryptSync, timingSafeEqual } from 'crypto'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

function localTestApi() {
  return {
    name: 'local-test-api',
    apply: 'serve' as const,
    configureServer(server: any) {
      const database = new Database(path.resolve(__dirname, 'test-db/zimbabwemaids_test.db'))

      const readBody = (req: any) => new Promise<any>((resolve, reject) => {
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try { resolve(body ? JSON.parse(body) : {}) } catch (error) { reject(error) }
        })
      })
      const send = (res: any, status: number, data: unknown) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }
      const verifyPassword = (password: string, stored: string) => {
        const [salt, hash] = stored.split(':')
        const actual = scryptSync(password, salt, 64)
        return timingSafeEqual(actual, Buffer.from(hash, 'hex'))
      }

      server.middlewares.use('/api/test', async (req: any, res: any) => {
        try {
          const url = new URL(req.url || '/', 'http://local.test')
          if (req.method === 'POST' && url.pathname === '/login') {
            const { email, password } = await readBody(req)
            const user = database.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
            if (!user || !verifyPassword(password, user.password_hash)) {
              return send(res, 401, { error: 'Invalid test email or password' })
            }
            return send(res, 200, {
              uid: user.id, email: user.email, displayName: user.name, phoneNumber: user.phone,
              photoURL: user.avatar_url, role: user.role, isVerified: user.role !== 'worker',
              createdAt: user.created_at, updatedAt: user.updated_at, isDemo: true,
            })
          }

          const uid = url.searchParams.get('uid')
          const role = url.searchParams.get('role')
          if (req.method === 'GET' && url.pathname === '/jobs') {
            const rows = role === 'employer'
              ? database.prepare('SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC').all(uid)
              : database.prepare("SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC").all()
            return send(res, 200, rows.map((job: any) => ({
              id: job.id, employerId: job.employer_id, title: job.title, description: job.description,
              workerType: job.worker_type, location: { city: job.city, suburb: job.suburb },
              salaryRange: { min: job.salary_min, max: job.salary_max, currency: job.currency },
              requirements: {}, status: job.status, createdAt: job.created_at, expiresAt: job.expires_at,
            })))
          }
          if (req.method === 'POST' && url.pathname === '/jobs') {
            const job = await readBody(req)
            const id = `job_demo_${Date.now()}`
            const now = new Date().toISOString()
            const expires = new Date(Date.now() + 30 * 86400000).toISOString()
            database.prepare(`INSERT INTO jobs
              (id, employer_id, title, description, worker_type, city, suburb, salary_min, salary_max, currency, status, created_at, expires_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`)
              .run(id, job.employerId, job.title, job.description, job.workerType, job.location.city,
                job.location.suburb, job.salaryRange.min, job.salaryRange.max, job.salaryRange.currency, now, expires)
            return send(res, 201, { id })
          }
          if (req.method === 'GET' && url.pathname === '/profile') {
            const table = role === 'worker' ? 'worker_profiles' : 'employer_profiles'
            const profile = database.prepare(`SELECT * FROM ${table} WHERE user_id = ?`).get(uid) as any
            if (!profile) return send(res, 200, null)
            return send(res, 200, role === 'worker' ? {
              uid, fullName: profile.full_name, gender: profile.gender,
              location: { city: profile.city, suburb: profile.suburb },
              skills: profile.skills?.split(',') || [], experienceYears: profile.experience_years,
              bio: profile.bio, verificationStatus: JSON.parse(profile.verification_status || '{}'),
            } : {
              uid, fullName: profile.full_name, location: { city: profile.city, suburb: profile.suburb },
              householdSize: profile.household_size,
            })
          }
          if (req.method === 'PATCH' && url.pathname === '/profile') {
            const profile = await readBody(req)
            if (role === 'worker') {
              database.prepare(`UPDATE worker_profiles SET full_name=?, gender=?, city=?, suburb=?, skills=?, experience_years=?, bio=?, updated_at=datetime('now') WHERE user_id=?`)
                .run(profile.fullName, profile.gender, profile.location.city, profile.location.suburb,
                  (profile.skills || []).join(','), profile.experienceYears, profile.bio, uid)
            } else {
              database.prepare(`UPDATE employer_profiles SET full_name=?, city=?, suburb=?, household_size=?, updated_at=datetime('now') WHERE user_id=?`)
                .run(profile.fullName, profile.location.city, profile.location.suburb, profile.householdSize, uid)
            }
            return send(res, 200, { ok: true })
          }
          if (req.method === 'GET' && url.pathname === '/payments') {
            const rows = database.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC').all(uid) as any[]
            return send(res, 200, rows.map((p) => ({
              id: p.id, userId: p.user_id, jobId: p.job_id, amount: p.amount, currency: p.currency,
              method: p.method, type: p.type, status: p.status, createdAt: p.created_at,
            })))
          }
          if (req.method === 'GET' && url.pathname === '/matches') {
            const field = role === 'employer' ? 'j.employer_id' : 'm.worker_id'
            const rows = database.prepare(`SELECT m.*, j.employer_id FROM matches m JOIN jobs j ON j.id=m.job_id WHERE ${field}=? ORDER BY m.score DESC`).all(uid) as any[]
            return send(res, 200, rows.map((m) => ({
              id: m.id, jobId: m.job_id, workerId: m.worker_id, employerId: m.employer_id,
              score: m.score, reasons: ['Relevant experience', 'Location aligned'],
              status: m.status === 'accepted' ? 'confirmed' : m.status, placementFeePaid: false,
              connectionFeePaid: false, rank: 0, createdAt: m.created_at,
            })))
          }
          if (req.method === 'GET' && url.pathname === '/verifications') {
            const rows = uid
              ? database.prepare('SELECT * FROM verifications WHERE worker_id = ? ORDER BY created_at DESC').all(uid)
              : database.prepare('SELECT * FROM verifications ORDER BY created_at DESC').all()
            return send(res, 200, (rows as any[]).map((v) => ({
              id: v.id, workerId: v.worker_id, type: v.type, status: v.status,
              documents: JSON.parse(v.documents || '[]'), reviewerNotes: v.notes || '',
              reviewedBy: null, createdAt: v.created_at,
              reviewedAt: v.status === 'pending' ? null : v.updated_at,
            })))
          }
          if (req.method === 'POST' && url.pathname === '/verifications') {
            const verification = await readBody(req)
            const id = `verification_demo_${Date.now()}`
            database.prepare(`INSERT INTO verifications
              (id, worker_id, type, status, documents, notes) VALUES (?, ?, ?, 'pending', ?, '')`)
              .run(id, verification.workerId, verification.type, JSON.stringify([verification.fileName]))
            return send(res, 201, { id })
          }
          if (req.method === 'PATCH' && url.pathname === '/verifications') {
            const verification = await readBody(req)
            database.prepare(`UPDATE verifications SET status=?, notes=?, updated_at=datetime('now') WHERE id=?`)
              .run(verification.status, verification.notes || '', verification.verificationId)
            return send(res, 200, { ok: true })
          }
          if (req.method === 'GET' && url.pathname === '/stats') {
            return send(res, 200, {
              totalUsers: (database.prepare('SELECT COUNT(*) total FROM users').get() as any).total,
              activeJobs: (database.prepare("SELECT COUNT(*) total FROM jobs WHERE status='active'").get() as any).total,
              pendingVerifications: (database.prepare("SELECT COUNT(*) total FROM verifications WHERE status='pending'").get() as any).total,
              totalRevenue: (database.prepare("SELECT COALESCE(SUM(amount),0) total FROM payments WHERE status='success'").get() as any).total,
            })
          }
          send(res, 404, { error: 'Not found' })
        } catch (error: any) {
          send(res, 500, { error: error.message || 'Local test API failed' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    localTestApi(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'Zimbabwe Maids Centre',
        short_name: 'ZimMaidsCentre',
        description: 'Find trusted domestic workers with peace of mind',
        theme_color: '#166534',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
