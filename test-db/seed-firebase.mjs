import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(here, '..', 'firebase', 'functions', 'package.json'))
const { initializeApp, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')
const key = JSON.parse(readFileSync(join(here, '..', '.secrets', 'trace-qa-prod-firebase-adminsdk-fbsvc-fce13fabc2.json'), 'utf8'))
initializeApp({ credential: cert(key) })
const auth = getAuth()
const db = getFirestore()
const password = 'password123'
const accounts = [
  ['admin@test.com', 'Admin User', 'admin'],
  ['employer@test.com', 'Sarah Johnson', 'employer'],
  ['worker@test.com', 'Tendai Moyo', 'worker'],
  ['chipo@test.com', 'Chipo Dube', 'worker'],
]
const users = {}

for (const [email, displayName, role] of accounts) {
  let user
  try {
    user = await auth.getUserByEmail(email)
    user = await auth.updateUser(user.uid, { password, displayName, disabled: false, emailVerified: true })
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error
    user = await auth.createUser({ email, password, displayName, emailVerified: true })
  }
  await auth.setCustomUserClaims(user.uid, { role })
  await db.collection('users').doc(user.uid).set({
    uid: user.uid, email, displayName, role, phoneNumber: null, photoURL: null,
    isVerified: role !== 'worker', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  }, { merge: true })
  users[role === 'worker' && email.startsWith('chipo') ? 'chipo' : role] = { ...user, email, displayName }
  console.log(`✓ ${role}: ${email}`)
}

const employer = users.employer
const worker = users.worker
const chipo = users.chipo
await db.collection('employerProfiles').doc(employer.uid).set({
  uid: employer.uid, fullName: employer.displayName,
  location: { city: 'Harare', suburb: 'Borrowdale' }, householdSize: 4,
  preferences: { workerType: 'housekeeper' }, verificationStatus: 'verified',
}, { merge: true })

for (const [person, suburb, skills, years] of [
  [worker, 'Mabelreign', ['Cooking', 'Cleaning', 'Childcare'], 5],
  [chipo, 'Hatfield', ['Cooking', 'Gardening', 'Elderly care'], 3],
]) {
  await db.collection('workerProfiles').doc(person.uid).set({
    uid: person.uid, fullName: person.displayName, dateOfBirth: '1994-01-01', gender: 'female',
    location: { city: 'Harare', suburb }, skills, experienceYears: years,
    expectedSalary: { min: 300, max: 500, currency: 'USD' },
    availability: { type: 'fulltime', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], startDate: '2026-08-01' },
    languages: ['English', 'Shona'], bio: 'Experienced and reliable domestic professional.',
    photoURL: '', documents: { idCard: '', certificates: [], referenceLetters: [] },
    verificationStatus: {
      kyc: person.uid === worker.uid ? 'approved' : 'pending',
      backgroundCheck: 'pending', referenceCheck: 'pending', training: 'pending', overall: 'in_progress',
    },
    contactEncrypted: false, phoneNumber: '+263770000000', whatsappNumber: '+263770000000',
    email: person.email, contactVisible: true, rating: 0, reviewCount: 0,
    createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  }, { merge: true })
}

for (const job of [
  ['demo-housekeeper', 'Experienced Housekeeper Needed', 'housekeeper', 'Borrowdale', 300, 450],
  ['demo-nanny', 'Full-Time Nanny for Toddler', 'nanny', 'Greystone', 350, 500],
]) {
  await db.collection('jobs').doc(job[0]).set({
    employerId: employer.uid, title: job[1], workerType: job[2],
    description: 'A considered household role with clear duties and expectations.',
    location: { city: 'Harare', suburb: job[3] },
    salaryRange: { min: job[4], max: job[5], currency: 'USD' },
    requirements: { skills: [], minExperience: 2, type: 'fulltime' },
    status: 'active', createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 86400000)),
  }, { merge: true })
}

for (const [person, score, rank] of [[worker, 91, 1], [chipo, 78, 2]]) {
  await db.collection('matches').doc(`demo-${person.uid}`).set({
    jobId: 'demo-housekeeper', employerId: employer.uid, workerId: person.uid, score,
    reasons: ['Relevant experience', 'Harare location', 'Availability aligned'],
    status: 'pending', placementFeePaid: false, connectionFeePaid: false, rank,
    createdAt: Timestamp.now(),
  }, { merge: true })
}

await db.collection('verifications').doc('demo-worker-kyc').set({
  workerId: worker.uid, type: 'kyc', status: 'approved', documents: [],
  createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
}, { merge: true })
await db.collection('payments').doc('demo-employer-payment').set({
  userId: employer.uid, jobId: 'demo-housekeeper', amount: 25, currency: 'USD',
  method: 'ecocash', type: 'connection_fee', status: 'success', createdAt: Timestamp.now(),
}, { merge: true })
console.log('✓ Firebase dashboard fixtures seeded')
