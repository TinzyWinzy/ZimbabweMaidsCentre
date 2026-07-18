import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp()
const db = getFirestore()

interface PaymentRequest {
  userId: string
  type: 'placement_fee' | 'connection_fee' | 'retainer'
  amount: number
  currency: 'USD' | 'ZWL'
  matchId?: string
  method: 'paynow' | 'ecocash'
  phoneNumber?: string
}

export const initiatePayment = onCall(async (request) => {
  const data = request.data as PaymentRequest
  const { userId, type, amount, currency, matchId, method, phoneNumber } = data

  if (request.auth?.uid !== userId) {
    throw new HttpsError('permission-denied', 'Unauthorized')
  }

  const paymentRef = db.collection('payments').doc()
  await paymentRef.set({
    id: paymentRef.id,
    userId,
    type,
    amount,
    currency,
    matchId: matchId || null,
    method,
    status: 'pending',
    gatewayReference: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  if (method === 'paynow') {
    return {
      paymentId: paymentRef.id,
      redirectUrl: `https://www.paynow.co.zw/invoice/${paymentRef.id}`,
    }
  }

  if (method === 'ecocash') {
    if (!phoneNumber) {
      throw new HttpsError('invalid-argument', 'Phone number required for EcoCash')
    }
    return {
      paymentId: paymentRef.id,
      status: 'pending_ussd',
      message: 'Please check your phone for EcoCash prompt',
    }
  }

  throw new HttpsError('invalid-argument', 'Invalid payment method')
})

export const paynowWebhook = onCall(async (request) => {
  const { reference, status } = request.data

  const paymentQuery = await db.collection('payments')
    .where('gatewayReference', '==', reference)
    .limit(1)
    .get()

  if (paymentQuery.empty) {
    throw new HttpsError('not-found', 'Payment not found')
  }

  const paymentDoc = paymentQuery.docs[0]
  const payment = paymentDoc.data()

  if (status === 'paid') {
    await paymentDoc.ref.update({ status: 'success', updatedAt: new Date() })

    if (payment.type === 'placement_fee' && payment.matchId) {
      await db.collection('matches').doc(payment.matchId).update({
        placementFeePaid: true,
        contactUnlockedAt: new Date(),
      })

      const matchDoc = await db.collection('matches').doc(payment.matchId).get()
      const match = matchDoc.data()
      if (match) {
        await db.collection('workerProfiles').doc(match.workerId).update({
          contactVisible: true,
        })
      }
    }

    await db.collection('notifications').add({
      userId: payment.userId,
      type: 'payment_success',
      title: 'Payment Successful',
      body: `Your payment of ${payment.currency} ${payment.amount} was successful`,
      read: false,
      createdAt: new Date(),
    })
  } else {
    await paymentDoc.ref.update({ status: 'failed', updatedAt: new Date() })
  }

  return { success: true }
})
