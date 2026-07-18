import { get, set } from 'idb-keyval'

export async function queueAction(action: string, data: unknown) {
  const registration = await navigator.serviceWorker.ready

  if ('sync' in (registration as any)) {
    await addToQueue({ action, data, timestamp: Date.now() })
    await (registration as any).sync.register(action)
  } else {
    window.addEventListener('online', async () => {
      await processQueue()
    }, { once: true })
  }
}

async function addToQueue(item: unknown) {
  const queue = await get('syncQueue') || []
  queue.push(item)
  await set('syncQueue', queue)
}

export async function processQueue() {
  const queue = await get('syncQueue') || []

  for (const item of queue as Array<{ action: string; data: unknown }>) {
    try {
      switch (item.action) {
        case 'applyToJob':
          break
        case 'updateProfile':
          break
        case 'sendMessage':
          break
      }
    } catch (err) {
      console.error('Failed to sync:', err)
    }
  }

  await set('syncQueue', [])
}
