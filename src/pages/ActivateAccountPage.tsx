import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { UserData } from '@/types'

export function ActivateAccountPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const invite = useQuery({
    queryKey: ['invite', token],
    queryFn: () => api<{ displayName: string; email: string }>(`/auth/invite?token=${encodeURIComponent(token)}`),
    enabled: !!token,
    retry: false,
  })
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (password.length < 10) return setError('Use at least 10 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setBusy(true); setError('')
    try {
      const userData = await api<UserData>('/auth/invite', { method: 'POST', body: JSON.stringify({ token, password }) })
      setUser({ uid: userData.uid, email: userData.email, displayName: userData.displayName }, userData)
      navigate('/profile', { replace: true })
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Account activation failed.') } finally { setBusy(false) }
  }
  return <main className="grid min-h-screen bg-[#f4f1e9] pt-[72px] text-[#173129] lg:grid-cols-[0.9fr_1.1fr]">
    <aside className="hidden bg-[#173129] p-16 text-[#f8f4ea] lg:flex lg:flex-col lg:justify-center"><ShieldCheck className="h-8 w-8 text-[#bfe986]" /><p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-[#bfe986]">Private account setup</p><h1 className="mt-5 font-display text-6xl font-semibold leading-[0.92] tracking-[-0.05em]">Your professional profile, secured by you.</h1><p className="mt-7 max-w-lg text-base leading-8 text-white/70">Choose a private password to access placements, verification, profile details, and account activity.</p></aside>
    <section className="flex items-center justify-center px-5 py-16 sm:px-10"><div className="w-full max-w-lg">
      <KeyRound className="h-7 w-7 text-[#43892d]" />
      {invite.isLoading ? <p className="mt-8 text-sm text-[#66766e]">Checking activation link…</p> : invite.error || !invite.data ? <div className="mt-8"><h1 className="font-display text-4xl font-semibold">This link cannot be used.</h1><p className="mt-4 text-sm leading-6 text-[#66766e]">It may have expired or already been accepted. Ask the placement team for a new activation link.</p></div> :
        <form onSubmit={submit} className="mt-8"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#43892d]">Welcome, {invite.data.displayName}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em]">Activate your account</h1><p className="mt-3 text-sm text-[#66766e]">{invite.data.email}</p>
          <label className="mt-8 block"><span className="mb-2 block text-sm font-semibold">Create password</span><input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full border border-[#173129]/20 bg-white px-4 outline-none focus:border-[#43892d]" /></label>
          <label className="mt-5 block"><span className="mb-2 block text-sm font-semibold">Confirm password</span><input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-12 w-full border border-[#173129]/20 bg-white px-4 outline-none focus:border-[#43892d]" /></label>
          {error && <p className="mt-5 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="oxygen-button mt-8 w-full disabled:opacity-50">{busy ? 'Activating…' : 'Activate account'}</button>
        </form>}
    </div></section>
  </main>
}

export default ActivateAccountPage
