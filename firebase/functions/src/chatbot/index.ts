import { onRequest } from 'firebase-functions/v2/https'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp()
const db = getFirestore()

export const whatsappWebhook = onRequest(async (req, res) => {
  const { Body, From } = req.body

  if (!Body || !From) {
    res.status(400).send('Invalid request')
    return
  }

  const phoneNumber = From.replace('whatsapp:', '')

  const userQuery = await db.collection('users')
    .where('phoneNumber', '==', phoneNumber)
    .limit(1)
    .get()

  const userId = userQuery.empty ? null : userQuery.docs[0].id

  await db.collection('chatbotMessages').add({
    userId,
    phoneNumber,
    message: Body,
    direction: 'incoming',
    timestamp: new Date(),
  })

  const reply = `Thank you for your message. We'll get back to you shortly. For immediate assistance, call +263 785 458 828.`;

  await db.collection('chatbotMessages').add({
    userId,
    phoneNumber,
    message: reply,
    direction: 'outgoing',
    timestamp: new Date(),
  })

  res.status(200).send({ reply })
})

export const sendJobAlerts = onRequest(async (req, res) => {
  const { workerId } = req.body

  const workerDoc = await db.collection('workerProfiles').doc(workerId).get()
  if (!workerDoc.exists) {
    res.status(404).send('Worker not found')
    return
  }

  const matches = await db.collection('matches')
    .where('workerId', '==', workerId)
    .where('status', '==', 'pending')
    .orderBy('score', 'desc')
    .limit(3)
    .get()

  if (matches.empty) {
    res.status(200).send({ message: 'No new matches' })
    return
  }

  let message = '*New Job Matches!*\n\n'
  matches.forEach((match, i) => {
    const data = match.data()
    message += `${i + 1}. Score: ${data.score}%\n`
  })

  message += '\nVisit https://zimmaidscentre.co.zw for details'

  res.status(200).send({ message })
})
