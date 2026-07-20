import { useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, ChevronRight, MessageCircle, Search, UserRoundCheck } from 'lucide-react'
import { useApplicants } from '@/features/operations/useOperations'
import type { Applicant, ApplicantStage } from '@/types/operations'

const columns: { stage: ApplicantStage; label: string; accent: string }[] = [
  { stage: 'new', label: 'New', accent: 'bg-sky-500' },
  { stage: 'screened', label: 'Screened', accent: 'bg-violet-500' },
  { stage: 'interviewed', label: 'Interviewed', accent: 'bg-amber-500' },
  { stage: 'training', label: 'Training', accent: 'bg-orange-500' },
  { stage: 'approved', label: 'Approved', accent: 'bg-[#4d8d3a]' },
]

const nextStage: Partial<Record<ApplicantStage, ApplicantStage>> = {
  new: 'screened', screened: 'interviewed', interviewed: 'training', training: 'approved',
}

export function AdminApplicantsPage() {
  const { applicants, isLoading, updateStage, convert } = useApplicants()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [error, setError] = useState('')
  const visible = useMemo(() => applicants.filter((applicant) =>
    !['converted', 'rejected'].includes(applicant.stage) &&
    `${applicant.fullName} ${applicant.phoneNumber} ${applicant.category} ${applicant.location.city}`.toLowerCase().includes(search.toLowerCase())
  ), [applicants, search])

  async function advance(applicant: Applicant) {
    const stage = nextStage[applicant.stage]
    if (!stage) return
    setError('')
    try {
      await updateStage.mutateAsync({ applicantId: applicant.id, stage })
      setSelected((current) => current?.id === applicant.id ? { ...current, stage } : current)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not update stage.') }
  }

  async function convertApplicant(applicant: Applicant) {
    setError('')
    try {
      await convert.mutateAsync(applicant.id)
      setSelected(null)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not convert applicant.') }
  }

  return (
    <div className="space-y-7">
      <header className="border-b border-[#dfe6df] pb-7">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Recruitment desk</p>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">Applicant pipeline</h1>
        <p className="mt-2 text-sm text-[#66766e]">Move candidates deliberately from first contact to a private worker profile.</p>
      </header>
      <label className="flex h-11 max-w-xl items-center gap-3 rounded-lg border border-[#dfe6df] bg-white px-3"><Search className="h-4 w-4 text-[#87938c]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applicants" className="w-full bg-transparent text-sm outline-none" /></label>
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {isLoading ? <p className="py-8 text-sm text-[#66766e]">Loading pipeline…</p> :
        <div className="overflow-x-auto pb-4"><div className="grid min-w-[1120px] grid-cols-5 gap-4">
          {columns.map((column) => {
            const cards = visible.filter((applicant) => applicant.stage === column.stage)
            return <section key={column.stage} className="min-h-[520px] rounded-xl border border-[#dfe6df] bg-[#f4f6f1]">
              <header className="flex items-center justify-between border-b border-[#dfe6df] px-4 py-4"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#52665c]"><span className={`h-2 w-2 rounded-full ${column.accent}`} />{column.label}</span><span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#7b8981]">{cards.length}</span></header>
              <div className="space-y-3 p-3">{cards.map((applicant) => <button key={applicant.id} onClick={() => { setSelected(applicant); setError('') }} className="w-full rounded-lg border border-[#dfe6df] bg-white p-4 text-left shadow-[0_2px_8px_rgba(23,49,41,0.04)] hover:border-[#a8bea5]">
                <p className="font-semibold text-[#253b33]">{applicant.fullName}</p><p className="mt-1 text-xs text-[#7b8981]">{applicant.category} · {applicant.location.city}</p><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-[#7b8981]">{applicant.experienceYears} yrs experience</span><ChevronRight className="h-4 w-4 text-[#9aa59f]" /></div>
              </button>)}</div>
            </section>
          })}
        </div></div>}
      {selected && <ApplicantPanel applicant={selected} onClose={() => setSelected(null)} onAdvance={() => advance(selected)} onReject={async () => { await updateStage.mutateAsync({ applicantId: selected.id, stage: 'rejected' }); setSelected(null) }} onConvert={() => convertApplicant(selected)} busy={updateStage.isPending || convert.isPending} />}
    </div>
  )
}

function ApplicantPanel({ applicant, onClose, onAdvance, onReject, onConvert, busy }: { applicant: Applicant; onClose: () => void; onAdvance: () => void; onReject: () => void; onConvert: () => void; busy: boolean }) {
  const whatsapp = `https://wa.me/${(applicant.whatsappNumber || applicant.phoneNumber).replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${applicant.fullName}, this is Zimbabwe Maids Centre regarding your application.`)}`
  const next = nextStage[applicant.stage]
  return <div className="fixed inset-0 z-[70] flex justify-end bg-[#10271f]/45"><aside className="h-full w-full max-w-xl overflow-y-auto bg-[#f8f7f2] p-6 shadow-2xl sm:p-8">
    <button onClick={onClose} className="text-sm font-semibold text-[#617069]">Close</button>
    <div className="mt-8 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dfe6d9] font-display text-xl font-semibold text-[#315d4d]">{applicant.fullName.split(/\s+/).slice(0, 2).map((item) => item[0]).join('')}</div><div><h2 className="font-display text-3xl font-semibold text-[#173129]">{applicant.fullName}</h2><p className="mt-1 text-sm text-[#66766e]">{applicant.category} · {applicant.location.suburb || applicant.location.city}</p></div></div>
    <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#dfe6df] bg-[#dfe6df]"><Metric label="Experience" value={`${applicant.experienceYears} years`} /><Metric label="Expected salary" value={`$${applicant.expectedSalary}`} /><Metric label="Phone" value={applicant.phoneNumber} /><Metric label="Source" value={applicant.source} /></div>
    <section className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8981]">Skills</p><div className="mt-3 flex flex-wrap gap-2">{applicant.skills.length ? applicant.skills.map((skill) => <span key={skill} className="rounded-full border border-[#d6ded7] bg-white px-3 py-1.5 text-xs">{skill}</span>) : <span className="text-sm text-[#7b8981]">Not captured yet</span>}</div></section>
    {applicant.bio && <section className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8981]">Candidate summary</p><p className="mt-3 text-sm leading-7 text-[#52665c]">{applicant.bio}</p></section>}
    {applicant.interviewAt && <div className="mt-8 flex gap-3 rounded-lg bg-[#eee9da] p-4 text-sm text-[#645b45]"><CalendarClock className="h-5 w-5" /> Interview {new Date(applicant.interviewAt).toLocaleString()}</div>}
    <div className="mt-10 space-y-3 border-t border-[#dfe6df] pt-6">
      <a href={whatsapp} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d6ded7] bg-white text-sm font-semibold text-[#315d4d]"><MessageCircle className="h-4 w-4" /> WhatsApp applicant</a>
      {next && <button disabled={busy} onClick={onAdvance} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#173129] text-sm font-semibold text-white"><CheckCircle2 className="h-4 w-4" /> Move to {columns.find((column) => column.stage === next)?.label}</button>}
      {applicant.stage === 'approved' && <button disabled={busy} onClick={onConvert} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#43892d] text-sm font-semibold text-white"><UserRoundCheck className="h-4 w-4" /> Convert to private worker profile</button>}
      <button disabled={busy} onClick={onReject} className="h-10 w-full text-sm font-semibold text-red-700">Reject application</button>
    </div>
  </aside></div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a978f]">{label}</p><p className="mt-1 text-sm font-semibold capitalize text-[#31483f]">{value || '—'}</p></div>
}

export default AdminApplicantsPage
