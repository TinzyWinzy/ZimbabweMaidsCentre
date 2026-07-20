import { randomBytes, scryptSync } from 'crypto'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  const dbPath = join(__dirname, 'zimbabwemaids_test.db')
  console.log(`Creating test database at: ${dbPath}`)

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  await db.exec('PRAGMA foreign_keys = ON')

  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
  await db.exec(schema)

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)

  const users = [
    {
      id: 'user_admin_001',
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    },
    {
      id: 'user_employer_001',
      name: 'Sarah Johnson',
      email: 'employer@test.com',
      password: 'password123',
      role: 'employer',
    },
    {
      id: 'user_worker_001',
      name: 'Tendai Moyo',
      email: 'worker@test.com',
      password: 'password123',
      role: 'worker',
    },
    {
      id: 'user_worker_002',
      name: 'Chipo Dube',
      email: 'chipo@test.com',
      password: 'password123',
      role: 'worker',
    },
  ]

  for (const u of users) {
    const hash = hashPassword(u.password)
    await db.run(
      `INSERT OR IGNORE INTO users (id, name, email, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [u.id, u.name, u.email, hash, u.role, now, now]
    )
    console.log(`  ✓ Created user: ${u.email} (${u.role})`)
  }

  await db.run(
    `INSERT OR IGNORE INTO employer_profiles (id, user_id, full_name, city, suburb, household_size)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['prof_employer_001', 'user_employer_001', 'Sarah Johnson', 'Harare', 'Borrowdale', 4]
  )
  console.log('  ✓ Created employer profile')

  for (const w of [
    { uid: 'user_worker_001', name: 'Tendai Moyo', gender: 'female', city: 'Harare', suburb: 'Mabelreign', skills: 'Cooking,Cleaning,Childcare', years: 5, bio: 'Experienced housekeeper with 5+ years in residential care.' },
    { uid: 'user_worker_002', name: 'Chipo Dube', gender: 'female', city: 'Harare', suburb: 'Hatfield', skills: 'Cooking,Gardening,Elderly Care', years: 3, bio: 'Reliable and hardworking domestic worker.' },
  ]) {
    await db.run(
      `INSERT OR IGNORE INTO worker_profiles (id, user_id, full_name, gender, city, suburb, skills, experience_years, bio, verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`prof_worker_${w.uid.slice(-3)}`, w.uid, w.name, w.gender, w.city, w.suburb, w.skills, w.years, w.bio, '{"kyc":"approved","backgroundCheck":"pending","referenceCheck":"pending","training":"pending"}']
    )
  }
  console.log('  ✓ Created worker profiles')

  const jobs = [
    { title: 'Experienced Housekeeper Needed', desc: 'We are looking for a reliable housekeeper to help with daily cleaning, laundry, and general household organisation. Must have at least 3 years of experience and references.', type: 'maid', city: 'Harare', suburb: 'Borrowdale', min: 300, max: 450 },
    { title: 'Full-Time Nanny for Toddler', desc: 'Loving family seeks an experienced nanny for our 2-year-old. Duties include childcare, preparing meals, and light cleaning related to the child.', type: 'nanny', city: 'Harare', suburb: 'Greystone', min: 350, max: 500 },
    { title: 'Weekend Chef for Family Events', desc: 'Looking for a skilled chef to prepare meals on weekends. Must be proficient in both local and international cuisine.', type: 'chef', city: 'Harare', suburb: 'Mount Pleasant', min: 200, max: 350 },
  ]

  for (const j of jobs) {
    await db.run(
      `INSERT OR IGNORE INTO jobs (id, employer_id, title, description, worker_type, city, suburb, salary_min, salary_max, currency, status, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`job_${j.type}_001`, 'user_employer_001', j.title, j.desc, j.type, j.city, j.suburb, j.min, j.max, 'USD', 'active', now, new Date(Date.now() + 30 * 86400000).toISOString().replace('T', ' ').slice(0, 19)]
    )
  }
  console.log('  ✓ Created sample job listings')

  for (const v of [
    { workerId: 'user_worker_001', type: 'kyc', status: 'approved' },
    { workerId: 'user_worker_001', type: 'background_check', status: 'pending' },
    { workerId: 'user_worker_002', type: 'kyc', status: 'pending' },
  ]) {
    await db.run(
      `INSERT OR IGNORE INTO verifications (id, worker_id, type, status, documents, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`ver_${v.workerId}_${v.type}`, v.workerId, v.type, v.status, '[]', now, now]
    )
  }
  console.log('  ✓ Created verification records')

  await db.run(
    `INSERT OR IGNORE INTO matches (id, job_id, worker_id, score, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['match_housekeeper_tendai', 'job_maid_001', 'user_worker_001', 91, 'pending', now]
  )
  await db.run(
    `INSERT OR IGNORE INTO matches (id, job_id, worker_id, score, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['match_housekeeper_chipo', 'job_maid_001', 'user_worker_002', 78, 'pending', now]
  )
  console.log('  ✓ Created sample matches')

  await db.run(
    `INSERT OR IGNORE INTO payments (id, user_id, job_id, amount, currency, method, type, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['payment_employer_001', 'user_employer_001', 'job_maid_001', 25, 'USD', 'ecocash', 'connection_fee', 'success', now]
  )
  console.log('  ✓ Created sample payment')

  await db.close()
  console.log('\n✅ Test database created successfully!')
  console.log('\n📋 Test Accounts:')
  console.log('   ┌──────────────────────┬──────────────┬────────────────┐')
  console.log('   │ Email                │ Password     │ Role           │')
  console.log('   ├──────────────────────┼──────────────┼────────────────┤')
  console.log('   │ admin@test.com       │ password123  │ admin          │')
  console.log('   │ employer@test.com    │ password123  │ employer       │')
  console.log('   │ worker@test.com      │ password123  │ worker         │')
  console.log('   │ chipo@test.com       │ password123  │ worker         │')
  console.log('   └──────────────────────┴──────────────┴────────────────┘')
}

main().catch((err) => {
  console.error('Failed to create test database:', err)
  process.exit(1)
})
