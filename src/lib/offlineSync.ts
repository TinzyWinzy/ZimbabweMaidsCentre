import { get, set, del } from 'idb-keyval'
import { api } from '@/lib/api'

export interface QueuedAction {
  action: 'applyToJob' | 'updateProfile' | 'sendMessage'
  data: Record<string, unknown>
  timestamp: number
}
export async function queueAction(action: QueuedAction['action'], data: QueuedAction['data']) {
  const queue = (await get<QueuedAction[]>('syncQueue')) || []
  queue.push({ action, data, timestamp: Date.now() })
  await set('syncQueue', queue)
  window.addEventListener('online', () => void processQueue(), { once: true })
}

export async function processQueue() {
  const queue = (await get<QueuedAction[]>('syncQueue')) || []
  const remaining: QueuedAction[] = []
  for (const item of queue) {
    try {
      if (item.action === 'updateProfile') {
        await api('/profile', { method: 'PATCH', body: JSON.stringify(item.data.updates || item.data) })
      } else {
        remaining.push(item)
      }
    } catch {
      remaining.push(item)
    }
  }
  if (remaining.length) await set('syncQueue', remaining)
  else await del('syncQueue')
}
