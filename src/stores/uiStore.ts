import { create } from 'zustand'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  toast: Toast | null
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toast: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}))
