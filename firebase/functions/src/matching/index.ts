import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp()
const db = getFirestore()

interface MatchScore {
  workerId: string
  score: number
  reasons: string[]
}

export const onJobCreated = onDocumentCreated('jobs/{jobId}', async (event) => {
  const job = event.data?.data()
  if (!job) return

  const workersQuery = db.collection('workerProfiles')
    .where('verificationStatus.overall', 'in', ['verified', 'fully_verified'])
    .where('location.city', '==', job.location.city)

  const workers = await workersQuery.get()
  const scores: MatchScore[] = []

  workers.forEach((doc) => {
    const worker = doc.data()
    let score = 0
    const reasons: string[] = []

    if (worker.location.suburb === job.location.suburb) {
      score += 30
      reasons.push('Same suburb')
    } else {
      score += 15
      reasons.push('Same city')
    }

    const skillOverlap = (worker.skills || []).filter((s: string) =>
      job.requirements?.skills?.includes(s)
    ).length
    if (skillOverlap > 0) {
      score += Math.min(25, skillOverlap * 5)
      reasons.push(`${skillOverlap} matching skills`)
    }

    const workerMin = worker.expectedSalary?.min || 0
    const jobMax = job.salaryRange?.max || 0
    const jobMin = job.salaryRange?.min || 0
    if (workerMin <= jobMax && workerMin >= jobMin) {
      score += 20
      reasons.push('Salary expectations match')
    } else if (workerMin <= jobMax * 1.2) {
      score += 10
      reasons.push('Salary close to range')
    }

    if (worker.availability?.type === job.requirements?.type) {
      score += 15
      reasons.push('Availability type matches')
    }

    if (worker.experienceYears >= (job.requirements?.minExperience || 0)) {
      score += 10
      reasons.push('Meets experience requirement')
    }

    if (worker.verificationStatus?.overall === 'fully_verified') {
      score += 5
      reasons.push('Fully verified')
    }

    scores.push({ workerId: doc.id, score, reasons })
  })

  const topMatches = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  const batch = db.batch()
  topMatches.forEach((match, index) => {
    const matchRef = db.collection('matches').doc(`${event.params.jobId}_${match.workerId}`)
    batch.set(matchRef, {
      jobId: event.params.jobId,
      workerId: match.workerId,
      score: match.score,
      reasons: match.reasons,
      status: 'pending',
      placementFeePaid: false,
      connectionFeePaid: false,
      rank: index + 1,
      createdAt: new Date(),
    })
  })

  await batch.commit()

  for (const match of topMatches.slice(0, 5)) {
    await db.collection('notifications').add({
      userId: match.workerId,
      type: 'job_match',
      title: 'New Job Match!',
      body: 'A new job matching your profile is available',
      data: { jobId: event.params.jobId },
      read: false,
      createdAt: new Date(),
    })
  }
})
