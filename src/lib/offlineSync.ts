import { get, set, del } from 'idb-keyval'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface QueuedAction {
  action: 'applyToJob' | 'updateProfile' | 'sendMessage'
  data: Record<string, unknown>
  timestamp: number
}

export async function queueAction(action: QueuedAction['action'], data: QueuedAction['data']) {
  const registration = await navigator.serviceWorker.ready

  if ('sync' in (registration as any)) {
    await addToQueue({ action, data, timestamp: Date.now() })
    await (registration as any).sync.register('zimmaids-sync')
  } else {
    window.addEventListener('online', async () => {
      await processQueue()
    }, { once: true })
  }
}

async function addToQueue(item: QueuedAction) {
  const queue = (await get<QueuedAction[]>('syncQueue')) || []
  queue.push(item)
  await set('syncQueue', queue)
}

export async function processQueue() {
  const queue = (await get<QueuedAction[]>('syncQueue')) || []

  for (const item of queue) {
    try {
      switch (item.action) {
        case 'applyToJob':
          await applyToJob(item.data)
          break
        case 'updateProfile':
          await updateProfile(item.data)
          break
        case 'sendMessage':
          await sendMessage(item.data)
          break
      }
    } catch (err) {
      console.error('Failed to sync action:', item.action, err)
    }
  }

  await del('syncQueue')
}

async function applyToJob(data: Record<string, unknown>) {
  const { jobId, workerId } = data as { jobId: string; workerId: string }
  if (!jobId || !workerId) return
  await addDoc(collection(db, 'matches'), {
    jobId,
    workerId,
    status: 'pending',
    score: 0,
    reasons: ['Applied while offline'],
    placementFeePaid: false,
    connectionFeePaid: false,
    createdAt: serverTimestamp(),
  })
}

async function updateProfile(data: Record<string, unknown>) {
  const { userId, updates } = data as { userId: string; updates: Record<string, unknown> }
  if (!userId || !updates) return
  const profileRef = doc(db, 'workerProfiles', userId)
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

async function sendMessage(data: Record<string, unknown>) {
  const { conversationId, senderId, text } = data as {
    conversationId: string
    senderId: string
    text: string
  }
  if (!conversationId || !senderId || !text) return
  await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
    senderId,
    text,
    createdAt: serverTimestamp(),
  })
}
