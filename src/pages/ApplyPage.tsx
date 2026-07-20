import { useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { api } from '@/lib/api'

const initial = { fullName: '', email: '', phoneNumber: '', whatsappNumber: '', city: 'Harare', suburb: '', category: 'Housekeeper', workTypes: [] as string[], skills: '', languages: '', experienceYears: 0, expectedSalary: 0, bio: '' }

export function ApplyPage() {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)
  const set = (key: keyof typeof form, value: string | number | string[]) => setForm({ ...form, [key]: value })
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await api('/public/applicants', { method: 'POST', body: JSON.stringify({ ...form, skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean), languages: form.languages.split(',').map((item) => item.trim()).filter(Boolean) }) })
      setComplete(true)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not submit application.') } finally { setBusy(false) }
  }
  if (complete) return <main className="flex min-h-screen items-center bg-[#173129] px-5 py-28 text-[#f8f4ea]"><section className="mx-auto max-w-3xl"><CheckCircle2 className="h-11 w-11 text-[#bfe986]" /><p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-[#bfe986]">Application received</p><h1 className="mt-5 font-display text-[clamp(3.4rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]">Your next opportunity starts here.</h1><p className="mt-7 max-w-xl text-base leading-8 text-white/70">Our recruitment team will review your information and contact you if your experience fits an available placement.</p></section></main>
  return <main className="min-h-screen bg-[#f4f1e9] pt-[72px] text-[#173129]">
    <div className="mx-auto grid max-w-[1280px] lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="bg-[#173129] px-7 py-14 text-[#f8f4ea] sm:px-12 lg:min-h-[calc(100vh-72px)] lg:px-14 lg:py-20"><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#bfe986]">Join our professional network</p><h1 className="mt-6 font-display text-[clamp(3.3rem,5vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.05em]">Good work deserves the right household.</h1><p className="mt-7 max-w-md text-base leading-8 text-white/70">Tell us about your experience. Applications are reviewed by the Zimbabwe Maids Centre recruitment team before any profile is published.</p><div className="mt-10 flex gap-3 border-t border-white/15 pt-7 text-sm leading-6 text-white/70"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#bfe986]" /> Your information stays private during recruitment and verification.</div></aside>
      <section className="px-5 py-12 sm:px-10 lg:px-16 lg:py-20"><form onSubmit={submit} className="mx-auto max-w-2xl"><h2 className="font-display text-4xl font-semibold tracking-[-0.035em]">Professional application</h2><p className="mt-3 text-sm leading-6 text-[#66766e]">Fields marked required help us make first contact.</p>
        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          <ApplyField label="Full name"><input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></ApplyField>
          <ApplyField label="Phone number"><input required value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} /></ApplyField>
          <ApplyField label="WhatsApp number"><input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} /></ApplyField>
          <ApplyField label="Email address"><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></ApplyField>
          <ApplyField label="City"><input required value={form.city} onChange={(e) => set('city', e.target.value)} /></ApplyField>
          <ApplyField label="Suburb"><input value={form.suburb} onChange={(e) => set('suburb', e.target.value)} /></ApplyField>
          <ApplyField label="Primary role"><select value={form.category} onChange={(e) => set('category', e.target.value)}>{['Housekeeper', 'Nanny', 'Chef', 'Gardener', 'Nurse Aide', 'Driver'].map((item) => <option key={item}>{item}</option>)}</select></ApplyField>
          <ApplyField label="Years of experience"><input type="number" min="0" value={form.experienceYears} onChange={(e) => set('experienceYears', Number(e.target.value))} /></ApplyField>
          <ApplyField label="Expected monthly salary (USD)"><input type="number" min="0" value={form.expectedSalary} onChange={(e) => set('expectedSalary', Number(e.target.value))} /></ApplyField>
          <ApplyField label="Work preference"><select value={form.workTypes[0] || ''} onChange={(e) => set('workTypes', e.target.value ? [e.target.value] : [])}><option value="">Select preference</option><option value="live-in">Live-in</option><option value="live-out">Live-out</option><option value="part-time">Part-time</option></select></ApplyField>
          <ApplyField label="Skills" wide><input value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="Childcare, cooking, laundry" /></ApplyField>
          <ApplyField label="Languages" wide><input value={form.languages} onChange={(e) => set('languages', e.target.value)} placeholder="English, Shona, Ndebele" /></ApplyField>
          <ApplyField label="Tell us about your experience" wide><textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} /></ApplyField>
        </div>
        {error && <p className="mt-5 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="oxygen-button mt-8 disabled:opacity-50">{busy ? 'Submitting…' : 'Submit application'}</button>
      </form></section>
    </div>
  </main>
}

function ApplyField({ label, wide, children }: { label: string; wide?: boolean; children: ReactElement }) {
  return <label className={wide ? 'sm:col-span-2' : ''}><span className="mb-2 block text-sm font-semibold">{label}</span><span className="[&>input]:h-12 [&>input]:w-full [&>input]:border [&>input]:border-[#173129]/20 [&>input]:bg-white [&>input]:px-4 [&>input]:outline-none [&>select]:h-12 [&>select]:w-full [&>select]:border [&>select]:border-[#173129]/20 [&>select]:bg-white [&>select]:px-4 [&>textarea]:min-h-28 [&>textarea]:w-full [&>textarea]:border [&>textarea]:border-[#173129]/20 [&>textarea]:bg-white [&>textarea]:p-4 [&>textarea]:outline-none">{children}</span></label>
}

export default ApplyPage
