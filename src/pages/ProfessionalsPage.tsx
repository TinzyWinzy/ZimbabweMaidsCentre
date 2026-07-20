import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Search, ShieldCheck, Star } from 'lucide-react'
import { usePublicWorkers } from '@/features/workers/usePublicWorkers'

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('')
}

export function ProfessionalsPage() {
  const { data: workers = [], isLoading, error } = usePublicWorkers()
  const [search, setSearch] = useState('')
  const [workType, setWorkType] = useState('all')

  const filtered = useMemo(() => workers.filter((worker) => {
    const needle = search.toLowerCase()
    const searchable = [
      worker.fullName, worker.location.city, worker.location.suburb,
      ...worker.skills, ...worker.languages,
    ].join(' ').toLowerCase()
    const typeMatches = workType === 'all' || worker.availability?.type === workType
    return searchable.includes(needle) && typeMatches
  }), [workers, search, workType])

  return (
    <main className="min-h-screen bg-[#f4f1e9] pb-24 pt-[72px] text-[#173129]">
      <section className="border-b border-[#173129]/15 bg-[#173129] px-5 py-16 text-[#f8f4ea] sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bfe986]">
            Available professionals
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <h1 className="max-w-4xl font-display text-[clamp(3rem,6vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
              Meet people ready to care for your home.
            </h1>
            <p className="max-w-lg text-base leading-8 text-white/70 lg:ml-auto">
              Explore reviewed profiles, compare practical experience, then send a placement request directly to our team.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="-mt-7 grid gap-3 border border-[#173129]/15 bg-[#faf8f2] p-4 shadow-[0_18px_45px_rgba(10,24,20,0.09)] sm:grid-cols-[1fr_230px]">
            <label className="flex min-h-12 items-center gap-3 border border-[#173129]/15 bg-white px-4 focus-within:border-[#43892d]">
              <Search className="h-4 w-4 text-[#6d8078]" />
              <span className="sr-only">Search professionals</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by skill, language, or location"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#7b8b84]"
              />
            </label>
            <select
              aria-label="Filter by work arrangement"
              value={workType}
              onChange={(event) => setWorkType(event.target.value)}
              className="min-h-12 border border-[#173129]/15 bg-white px-4 text-sm outline-none focus:border-[#43892d]"
            >
              <option value="all">All arrangements</option>
              <option value="livein">Live-in</option>
              <option value="liveout">Live-out</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-b border-[#173129]/15 pb-5 pt-14">
            <p className="text-sm text-[#5b6e66]">
              {isLoading ? 'Loading professionals…' : `${filtered.length} professional${filtered.length === 1 ? '' : 's'} available`}
            </p>
            <p className="hidden items-center gap-2 text-xs font-semibold text-[#43892d] sm:flex">
              <ShieldCheck className="h-4 w-4" /> Verification shown per profile
            </p>
          </div>

          {error ? (
            <div className="py-20 text-center">
              <h2 className="font-display text-3xl font-semibold">Profiles are temporarily unavailable.</h2>
              <p className="mt-3 text-sm text-[#5b6e66]">Please try again shortly or contact our placement team.</p>
            </div>
          ) : !isLoading && filtered.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="font-display text-3xl font-semibold">No exact matches yet.</h2>
              <button onClick={() => { setSearch(''); setWorkType('all') }} className="mt-4 text-sm font-semibold text-[#43892d]">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#173129]/15">
              {filtered.map((worker, index) => (
                <article key={worker.id} className="grid gap-7 py-9 md:grid-cols-[120px_1fr_auto] md:items-center">
                  <div className="flex aspect-square w-[120px] items-center justify-center overflow-hidden bg-[#dfe6d9] font-display text-3xl font-semibold text-[#315d4d]">
                    {worker.photoURL ? (
                      <img src={worker.photoURL} alt="" className="h-full w-full object-cover object-center" />
                    ) : initials(worker.fullName)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-xs font-semibold text-[#43892d]">#{String(index + 1).padStart(2, '0')}</p>
                      {worker.verificationStatus?.overall !== 'pending' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#e4eedb] px-2.5 py-1 text-[11px] font-semibold text-[#315d4d]">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified profile
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.025em]">{worker.fullName}</h2>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5b6e66]">
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {worker.location.suburb}, {worker.location.city}</span>
                      <span>{worker.experienceYears} years experience</span>
                      {worker.rating > 0 && <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-[#b48b34] text-[#b48b34]" /> {worker.rating.toFixed(1)} ({worker.reviewCount})</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {worker.skills.slice(0, 4).map((skill) => <span key={skill} className="border border-[#173129]/15 px-2.5 py-1 text-xs">{skill}</span>)}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6d8078]">Expected monthly</p>
                    <p className="mt-1 font-display text-xl font-semibold">${worker.expectedSalary.min}–${worker.expectedSalary.max}</p>
                    <Link to={`/professionals/${worker.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#43892d] hover:text-[#173129]">
                      View profile <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default ProfessionalsPage
