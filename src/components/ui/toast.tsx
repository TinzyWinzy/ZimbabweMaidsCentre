import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

export function Toast() {
  const { toast, hideToast } = useUIStore()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast, hideToast])

  if (!toast) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right">
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg',
          toast.type === 'success' && 'border-green-200 bg-green-50 text-green-800',
          toast.type === 'error' && 'border-red-200 bg-red-50 text-red-800',
          toast.type === 'info' && 'border-blue-200 bg-blue-50 text-blue-800'
        )}
      >
        <span className="text-sm">{toast.message}</span>
        <button onClick={hideToast} className="ml-2 rounded-full p-0.5 hover:bg-black/5">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
