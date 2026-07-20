import { useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { api } from '@/lib/api'
import { usePublicWorker } from '@/features/workers/usePublicWorkers'
import { useAuthStore } from '@/stores/authStore'
import type { BookingRequest } from '@/types/worker-directory'

const steps = ['Placement details', 'Your details', 'Review request']

export function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: worker, isLoading } = usePublicWorker(id)
  const { userData } = useAuthStore()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<BookingRequest>({
    clientRequestId: crypto.randomUUID(),
    workerId: id || '',
    clientName: userData?.displayName || '',
    clientEmail: userData?.email || '',
    clientPhone: userData?.phoneNumber || '',
    city: '',
    suburb: '',
    workType: 'live-out',
    startDate: '',
    scheduleNotes: '',
    requirements: '',
  })

  const update = (field: keyof BookingRequest, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const firstStepValid = form.city && form.suburb && form.workType && form.startDate
  const secondStepValid = form.clientName && form.clientEmail.includes('@') && form.clientPhone

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (step < 2) {
      if ((step === 0 && !firstStepValid) || (step === 1 && !secondStepValid)) {
        setError('Please complete the required details before continuing.')
        return
      }
      setError('')
      setStep((current) => current + 1)
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const result = await api<{ id: string }>('/public/bookings', { method: 'POST', body: JSON.stringify(form) })
      navigate(`/booking-confirmed?id=${encodeURIComponent(result.id)}`, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not submit your request.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading || !worker) return <main className="min-h-screen bg-[#f4f1e9] pt-[72px]"><div className="mx-auto max-w-6xl px-5 py-24">Loading placement request…</div></main>

  return (
    <main className="min-h-screen bg-[#f4f1e9] pb-20 pt-[72px] text-[#173129]">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-10">
        <Link to={`/professionals/${worker.id}`} className="inline-flex items-center gap-2 text-sm text-[#5b6e66] hover:text-[#173129]"><ArrowLeft className="h-4 w-4" /> Back to profile</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="bg-[#173129] p-7 text-[#f8f4ea] sm:p-10 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bfe986]">Your selected professional</p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.035em]">{worker.fullName}</h1>
            <p className="mt-3 text-sm text-white/65">{worker.location.suburb}, {worker.location.city} · {worker.experienceYears} years experience</p>
            <div className="mt-7 flex flex-wrap gap-2">{worker.skills.slice(0, 4).map((skill) => <span key={skill} className="border border-white/15 px-2.5 py-1 text-xs text-white/75">{skill}</span>)}</div>
            <div className="mt-9 border-t border-white/15 pt-7">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#bfe986]" /><p className="text-sm leading-6 text-white/70">Submitting a request does not commit you to a hire or payment. Our placement team will confirm availability and next steps.</p></div>
            </div>
          </aside>

          <section className="border border-[#173129]/15 bg-[#faf8f2] p-6 sm:p-10 lg:p-12">
            <div className="flex gap-2" aria-label={`Step ${step + 1} of 3`}>
              {steps.map((label, index) => <div key={label} className="flex-1"><div className={`h-1 ${index <= step ? 'bg-[#43892d]' : 'bg-[#173129]/10'}`} /><p className={`mt-2 hidden text-[11px] sm:block ${index === step ? 'font-semibold text-[#173129]' : 'text-[#7b8b84]'}`}>{label}</p></div>)}
            </div>

            <form onSubmit={submit} className="mt-10">
              {step === 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#43892d]">Step 01</p>
                  <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em]">What would the placement look like?</h2>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Field label="City"><input required value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Harare" /></Field>
                    <Field label="Suburb"><input required value={form.suburb} onChange={(e) => update('suburb', e.target.value)} placeholder="Borrowdale" /></Field>
                    <Field label="Work arrangement"><select value={form.workType} onChange={(e) => update('workType', e.target.value)}><option value="live-out">Live-out</option><option value="live-in">Live-in</option><option value="part-time">Part-time</option><option value="temporary">Temporary</option></select></Field>
                    <Field label="Preferred start date"><input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.startDate} onChange={(e) => update('startDate', e.target.value)} /></Field>
                    <Field label="Schedule notes" wide><textarea value={form.scheduleNotes} onChange={(e) => update('scheduleNotes', e.target.value)} placeholder="Days, hours, or any schedule flexibility" /></Field>
                    <Field label="Household requirements" wide><textarea value={form.requirements} onChange={(e) => update('requirements', e.target.value)} placeholder="Children, pets, duties, experience, or anything else our team should know" /></Field>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#43892d]">Step 02</p>
                  <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em]">How should our team reach you?</h2>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" wide><input required value={form.clientName} onChange={(e) => update('clientName', e.target.value)} /></Field>
                    <Field label="Email address"><input required type="email" value={form.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} /></Field>
                    <Field label="Phone / WhatsApp"><input required type="tel" value={form.clientPhone} onChange={(e) => update('clientPhone', e.target.value)} placeholder="+263…" /></Field>
                  </div>
                  <p className="mt-6 text-xs leading-5 text-[#6d8078]">These details are sent to the placement team and are not displayed publicly.</p>
                </div>
              )}
              {step === 2 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#43892d]">Step 03</p>
                  <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em]">Review your placement request.</h2>
                  <dl className="mt-8 divide-y divide-[#173129]/15 border-y border-[#173129]/15">
                    <Review label="Professional" value={worker.fullName} />
                    <Review label="Placement" value={`${form.workType} · ${form.suburb}, ${form.city}`} />
                    <Review label="Preferred start" value={new Date(`${form.startDate}T12:00:00`).toLocaleDateString('en-ZW', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    <Review label="Contact" value={`${form.clientName} · ${form.clientPhone}`} />
                    {form.requirements && <Review label="Requirements" value={form.requirements} />}
                  </dl>
                  <div className="mt-7 flex gap-3 text-sm leading-6 text-[#5b6e66]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#43892d]" /> I understand that Zimbabwe Maids Centre will contact me to confirm availability and explain placement terms before any payment.</div>
                </div>
              )}

              {error && <p role="alert" className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-700">{error}</p>}
              <div className="mt-10 flex items-center justify-between border-t border-[#173129]/15 pt-6">
                {step > 0 ? <button type="button" onClick={() => { setError(''); setStep((current) => current - 1) }} className="text-sm font-semibold text-[#5b6e66] hover:text-[#173129]">Back</button> : <span />}
                <button type="submit" disabled={submitting} className="oxygen-button disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Sending request…' : step === 2 ? 'Send placement request' : 'Continue'} <ArrowRight className="h-4 w-4" /></button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactElement }) {
  return <label className={`block ${wide ? 'sm:col-span-2' : ''}`}><span className="mb-2 block text-sm font-medium">{label}</span><span className="[&>input]:min-h-12 [&>input]:w-full [&>input]:border [&>input]:border-[#173129]/20 [&>input]:bg-white [&>input]:px-4 [&>input]:outline-none [&>input:focus]:border-[#43892d] [&>select]:min-h-12 [&>select]:w-full [&>select]:border [&>select]:border-[#173129]/20 [&>select]:bg-white [&>select]:px-4 [&>select]:outline-none [&>textarea]:min-h-28 [&>textarea]:w-full [&>textarea]:resize-y [&>textarea]:border [&>textarea]:border-[#173129]/20 [&>textarea]:bg-white [&>textarea]:p-4 [&>textarea]:outline-none">{children}</span></label>
}

function Review({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]"><dt className="text-sm text-[#6d8078]">{label}</dt><dd className="text-sm font-medium leading-6">{value}</dd></div>
}

export default BookingPage
