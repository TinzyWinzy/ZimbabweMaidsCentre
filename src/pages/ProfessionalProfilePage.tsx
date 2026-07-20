import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, MapPin, ShieldCheck, Star } from 'lucide-react'
import { usePublicWorker } from '@/features/workers/usePublicWorkers'

const verificationLabels: Record<string, string> = {
  kyc: 'Identity documents',
  backgroundCheck: 'Background check',
  referenceCheck: 'References',
  training: 'Training record',
}

export function ProfessionalProfilePage() {
  const { id } = useParams()
  const { data: worker, isLoading, error } = usePublicWorker(id)

  if (isLoading) return <main className="min-h-screen bg-[#f4f1e9] pt-[72px]"><div className="mx-auto max-w-6xl px-5 py-24">Loading profile…</div></main>
  if (error || !worker) return <main className="min-h-screen bg-[#f4f1e9] pt-[72px]"><div className="mx-auto max-w-6xl px-5 py-24"><h1 className="font-display text-4xl font-semibold">Professional not found.</h1><Link to="/professionals" className="mt-6 inline-block text-[#43892d]">Return to directory</Link></div></main>

  const initials = worker.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('')

  return (
    <main className="min-h-screen bg-[#f4f1e9] pb-24 pt-[72px] text-[#173129]">
      <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-10 lg:px-16">
        <Link to="/professionals" className="inline-flex items-center gap-2 text-sm text-[#5b6e66] hover:text-[#173129]">
          <ArrowLeft className="h-4 w-4" /> All professionals
        </Link>

        <section className="mt-8 grid overflow-hidden border border-[#173129]/15 bg-[#faf8f2] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex min-h-[420px] items-center justify-center bg-[#dfe6d9] font-display text-8xl font-semibold text-[#315d4d] lg:min-h-[650px]">
            {worker.photoURL ? <img src={worker.photoURL} alt="" className="h-full w-full object-cover object-center" /> : initials}
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-3">
              {worker.verificationStatus?.overall !== 'pending' && <span className="inline-flex items-center gap-2 bg-[#e4eedb] px-3 py-1.5 text-xs font-semibold text-[#315d4d]"><ShieldCheck className="h-4 w-4" /> Verified profile</span>}
              {worker.rating > 0 && <span className="flex items-center gap-1.5 text-sm"><Star className="h-4 w-4 fill-[#b48b34] text-[#b48b34]" /> {worker.rating.toFixed(1)} from {worker.reviewCount} reviews</span>}
            </div>
            <h1 className="mt-7 font-display text-[clamp(3.4rem,6vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]">{worker.fullName}</h1>
            <p className="mt-6 flex items-center gap-2 text-sm text-[#5b6e66]"><MapPin className="h-4 w-4" /> {worker.location.suburb}, {worker.location.city}</p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#496057]">{worker.bio}</p>
            <div className="mt-9 grid grid-cols-2 gap-6 border-y border-[#173129]/15 py-6">
              <div><p className="text-xs uppercase tracking-[0.14em] text-[#6d8078]">Experience</p><p className="mt-2 font-display text-2xl font-semibold">{worker.experienceYears} years</p></div>
              <div><p className="text-xs uppercase tracking-[0.14em] text-[#6d8078]">Monthly range</p><p className="mt-2 font-display text-2xl font-semibold">${worker.expectedSalary.min}–${worker.expectedSalary.max}</p></div>
            </div>
            <Link to={`/book/${worker.id}`} className="oxygen-button mt-8 self-start">Request this professional <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="grid gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#43892d]">Practical fit</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em]">Skills and working preferences</h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {worker.skills.map((skill) => <span key={skill} className="border border-[#173129]/15 bg-white/40 px-4 py-2 text-sm">{skill}</span>)}
            </div>
            <dl className="mt-10 divide-y divide-[#173129]/15 border-y border-[#173129]/15">
              <div className="grid grid-cols-2 py-5"><dt className="text-sm text-[#6d8078]">Languages</dt><dd className="text-sm font-medium">{worker.languages.join(', ') || 'Not specified'}</dd></div>
              <div className="grid grid-cols-2 py-5"><dt className="text-sm text-[#6d8078]">Arrangement</dt><dd className="text-sm font-medium capitalize">{worker.availability?.type?.replace(/([a-z])([A-Z])/g, '$1 $2') || 'Flexible'}</dd></div>
              <div className="grid grid-cols-2 py-5"><dt className="text-sm text-[#6d8078]">Available days</dt><dd className="text-sm font-medium">{worker.availability?.days?.join(', ') || 'Discuss with placement team'}</dd></div>
            </dl>
          </div>
          <aside className="bg-[#173129] p-7 text-[#f8f4ea] sm:p-10">
            <ShieldCheck className="h-7 w-7 text-[#bfe986]" />
            <h2 className="mt-6 font-display text-3xl font-semibold">Verification record</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">The status below reflects checks recorded by the Zimbabwe Maids Centre placement team.</p>
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {Object.entries(verificationLabels).map(([key, label]) => {
                const approved = worker.verificationStatus?.[key] === 'approved'
                return <div key={key} className="flex items-center justify-between py-4"><span className="text-sm">{label}</span><span className={`flex items-center gap-1.5 text-xs ${approved ? 'text-[#bfe986]' : 'text-white/55'}`}>{approved && <Check className="h-4 w-4" />}{approved ? 'Approved' : 'Pending'}</span></div>
              })}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default ProfessionalProfilePage
