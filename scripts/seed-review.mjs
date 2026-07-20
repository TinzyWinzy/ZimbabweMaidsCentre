import { randomBytes, scryptSync } from 'node:crypto'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const sql = neon(process.env.DATABASE_URL)
const reviewPassword = process.env.REVIEW_PASSWORD || 'Review2026!'

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

async function upsertUser(email, displayName, role, verified = true) {
  const rows = await sql`
    INSERT INTO users (email, password_hash, display_name, role, is_verified)
    VALUES (${email}, ${hashPassword(reviewPassword)}, ${displayName}, ${role}, ${verified})
    ON CONFLICT (email) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      role = EXCLUDED.role,
      is_verified = EXCLUDED.is_verified,
      updated_at = now()
    RETURNING id`
  return rows[0].id
}

const adminId = await upsertUser('admin.review@zimmaidscentre.co.zw', 'Review Administrator', 'admin')
const employerId = await upsertUser('employer.review@zimmaidscentre.co.zw', 'Tariro Muchengeti', 'employer')
const workerId = await upsertUser('worker.review@zimmaidscentre.co.zw', 'Rudo Ncube', 'worker')
const workerTwoId = await upsertUser('worker2.review@zimmaidscentre.co.zw', 'Chipo Moyo', 'worker')

await sql`
  INSERT INTO employer_profiles (user_id, full_name, city, suburb, household_size, preferences, verification_status)
  VALUES (${employerId}, 'Tariro Muchengeti', 'Harare', 'Borrowdale', 4,
    ${JSON.stringify({ workerType: 'liveout', skills: ['Childcare', 'Cooking'] })}, 'verified')
  ON CONFLICT (user_id) DO UPDATE SET
    full_name=EXCLUDED.full_name, city=EXCLUDED.city, suburb=EXCLUDED.suburb,
    household_size=EXCLUDED.household_size, preferences=EXCLUDED.preferences,
    verification_status=EXCLUDED.verification_status, updated_at=now()`

const workerVerification = {
  kyc: 'approved',
  backgroundCheck: 'approved',
  referenceCheck: 'approved',
  training: 'approved',
  overall: 'fully_verified',
}

await sql`
  INSERT INTO worker_profiles (
    user_id, full_name, gender, city, suburb, skills, experience_years,
    salary_min, salary_max, currency, availability, languages, bio,
    verification_status, phone_number, whatsapp_number, contact_visible, rating, review_count
  ) VALUES (
    ${workerId}, 'Rudo Ncube', 'female', 'Harare', 'Avondale',
    ${['Childcare', 'Cooking', 'Cleaning']}, 6, 180, 260, 'USD',
    ${JSON.stringify({ type: 'liveout', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], startDate: '2026-08-01' })},
    ${['English', 'Shona', 'Ndebele']},
    'Experienced domestic professional with strong childcare references and a calm, organised approach.',
    ${JSON.stringify(workerVerification)}, '+263771000101', '+263771000101', false, 4.8, 12
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name=EXCLUDED.full_name, city=EXCLUDED.city, suburb=EXCLUDED.suburb,
    skills=EXCLUDED.skills, experience_years=EXCLUDED.experience_years,
    bio=EXCLUDED.bio, verification_status=EXCLUDED.verification_status,
    rating=EXCLUDED.rating, review_count=EXCLUDED.review_count, updated_at=now()`

await sql`
  INSERT INTO worker_profiles (
    user_id, full_name, gender, city, suburb, skills, experience_years,
    salary_min, salary_max, currency, availability, languages, bio,
    verification_status, phone_number, whatsapp_number, contact_visible, rating, review_count
  ) VALUES (
    ${workerTwoId}, 'Chipo Moyo', 'female', 'Harare', 'Greendale',
    ${['Cleaning', 'Laundry', 'Elder care']}, 4, 160, 230, 'USD',
    ${JSON.stringify({ type: 'fulltime', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], startDate: '2026-08-15' })},
    ${['English', 'Shona']},
    'Reliable housekeeper experienced in laundry, household organisation and companion care.',
    ${JSON.stringify({ ...workerVerification, training: 'pending', overall: 'verified' })},
    '+263771000102', '+263771000102', false, 4.6, 8
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name=EXCLUDED.full_name, city=EXCLUDED.city, suburb=EXCLUDED.suburb,
    skills=EXCLUDED.skills, experience_years=EXCLUDED.experience_years,
    bio=EXCLUDED.bio, verification_status=EXCLUDED.verification_status,
    rating=EXCLUDED.rating, review_count=EXCLUDED.review_count, updated_at=now()`

const jobOneId = '10000000-0000-4000-8000-000000000001'
const jobTwoId = '10000000-0000-4000-8000-000000000002'
await sql`
  INSERT INTO jobs (id, employer_id, title, description, worker_type, city, suburb, salary_min, salary_max, currency, requirements, status)
  VALUES
    (${jobOneId}, ${employerId}, 'Experienced nanny and housekeeper', 'Family seeking a dependable professional for childcare, light cooking and household organisation.', 'liveout', 'Harare', 'Borrowdale', 200, 280, 'USD', ${JSON.stringify({ skills: ['Childcare', 'Cooking'], minExperience: 3 })}, 'active'),
    (${jobTwoId}, ${employerId}, 'Part-time household assistant', 'Morning household support focused on cleaning, laundry and weekly meal preparation.', 'parttime', 'Harare', 'Mount Pleasant', 120, 180, 'USD', ${JSON.stringify({ skills: ['Cleaning', 'Laundry'], minExperience: 2 })}, 'active')
  ON CONFLICT (id) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description, status=EXCLUDED.status`

const matchOneId = '20000000-0000-4000-8000-000000000001'
const matchTwoId = '20000000-0000-4000-8000-000000000002'
await sql`
  INSERT INTO matches (id, job_id, worker_id, score, reasons, status, rank)
  VALUES
    (${matchOneId}, ${jobOneId}, ${workerId}, 94, ${['Strong childcare experience', 'Nearby location', 'Salary aligned']}, 'pending', 1),
    (${matchTwoId}, ${jobTwoId}, ${workerTwoId}, 88, ${['Relevant household skills', 'Availability aligned']}, 'pending', 2)
  ON CONFLICT (job_id, worker_id) DO UPDATE SET
    score=EXCLUDED.score, reasons=EXCLUDED.reasons, status=EXCLUDED.status, rank=EXCLUDED.rank`

await sql`
  INSERT INTO verifications (id, worker_id, type, status, documents, reviewer_notes, reviewed_by, reviewed_at)
  VALUES
    ('30000000-0000-4000-8000-000000000001', ${workerId}, 'kyc', 'approved', ${['review-document://national-id']}, 'Identity checked for review fixture.', ${adminId}, now()),
    ('30000000-0000-4000-8000-000000000002', ${workerTwoId}, 'training', 'pending', ${['review-document://training-certificate']}, '', null, null)
  ON CONFLICT (id) DO UPDATE SET
    status=EXCLUDED.status, reviewer_notes=EXCLUDED.reviewer_notes,
    reviewed_by=EXCLUDED.reviewed_by, reviewed_at=EXCLUDED.reviewed_at`

await sql`
  INSERT INTO payments (id, user_id, type, amount, currency, match_id, method, status, gateway_reference)
  VALUES
    ('40000000-0000-4000-8000-000000000001', ${employerId}, 'connection_fee', 15, 'USD', ${matchOneId}, 'paynow', 'success', 'REVIEW-PAY-001'),
    ('40000000-0000-4000-8000-000000000002', ${employerId}, 'placement_fee', 50, 'USD', ${matchTwoId}, 'ecocash', 'pending', 'REVIEW-PAY-002')
  ON CONFLICT (id) DO UPDATE SET
    amount=EXCLUDED.amount, status=EXCLUDED.status, updated_at=now()`

console.log('Neon review data seeded successfully')
console.log('Review accounts: admin, employer, worker, worker2 @zimmaidscentre.co.zw')
