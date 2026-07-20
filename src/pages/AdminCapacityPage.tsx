import { useQuery } from '@tanstack/react-query'
import { Activity, ArrowDownToLine, CheckCircle2, Gauge, Target, UsersRound } from 'lucide-react'
import { api } from '@/lib/api'

type Capacity = {
  target: number
  completed: number
  requiredPerDay: number
  projected: number
  conversionRate: number
  funnel: Record<string, number>
  inventory: { published_workers: number; private_workers: number; active_applicants: number; pending_verifications: number }
  monthly: { month: string; inquiries: number; completed: number }[]
  daily: { day: string; completed: number }[]
}

const funnelLabels: Record<string, string> = {
  inquiry: 'New inquiries', matched: 'Matched', booked: 'Booked', fee_paid: 'Fee paid',
  worker_assigned: 'Worker assigned', started: 'Started', completed: 'Completed', cancelled: 'Cancelled',
}

export function AdminCapacityPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['capacity'], queryFn: () => api<Capacity>('/admin/capacity'), refetchInterval: 60_000 })
  if (isLoading) return <p className="py-12 text-sm text-[#66766e]">Calculating placement capacity…</p>
  if (error || !data) return <p className="py-12 text-sm text-red-700">Capacity metrics are temporarily unavailable.</p>
  const progress = Math.min(100, (data.completed / data.target) * 100)
  const maxMonthly = Math.max(1, ...data.monthly.map((item) => item.inquiries))
  const onPace = data.projected >= data.target

  return <div className="space-y-7">
    <header className="flex flex-col gap-5 border-b border-[#dfe6df] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Scale command</p><h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">Placement capacity</h1><p className="mt-2 text-sm text-[#66766e]">Live operational progress against the 1,000-placement monthly target.</p></div>
      <div className="flex flex-wrap gap-2">{['bookings', 'workers', 'applicants'].map((entity) => <a key={entity} href={`/api/admin/export?entity=${entity}`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d6ded7] bg-white px-3 text-xs font-semibold capitalize text-[#40564c]"><ArrowDownToLine className="h-4 w-4" /> {entity}</a>)}</div>
    </header>

    <section className="overflow-hidden rounded-xl bg-[#173129] p-6 text-white sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9fc594]">This month</p><div className="mt-4 flex items-end gap-3"><span className="font-display text-7xl font-semibold leading-none">{data.completed}</span><span className="pb-2 text-sm text-white/55">of {data.target} placements</span></div></div>
        <div className={`w-fit rounded-lg px-4 py-3 text-sm font-semibold ${onPace ? 'bg-[#315d4d] text-[#c9efa1]' : 'bg-amber-200/10 text-amber-200'}`}>{onPace ? 'On target pace' : `${Math.max(0, data.target - data.projected)} projected shortfall`} · projected {data.projected}</div>
      </div>
      <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#9fc594]" style={{ width: `${progress}%` }} /></div>
      <div className="mt-3 flex justify-between text-xs text-white/45"><span>{progress.toFixed(1)}% complete</span><span>{data.requiredPerDay} completions/day required</span></div>
    </section>

    <section className="grid overflow-hidden rounded-xl border border-[#dfe6df] bg-white sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={Gauge} label="Projected month" value={String(data.projected)} note="At current completion pace" />
      <Metric icon={Target} label="Conversion rate" value={`${data.conversionRate}%`} note="Inquiries completed this month" />
      <Metric icon={UsersRound} label="Published workers" value={String(data.inventory.published_workers)} note={`${data.inventory.private_workers} private profiles`} />
      <Metric icon={Activity} label="Recruitment supply" value={String(data.inventory.active_applicants)} note={`${data.inventory.pending_verifications} checks pending`} />
    </section>

    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-xl border border-[#dfe6df] bg-white p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8981]">Six-month throughput</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[#173129]">Inquiries versus completions</h2>
        <div className="mt-8 space-y-5">{data.monthly.length ? data.monthly.map((item) => <div key={item.month} className="grid grid-cols-[72px_1fr_56px] items-center gap-3">
          <span className="text-xs font-semibold text-[#617069]">{new Date(`${item.month}-01T12:00:00`).toLocaleDateString('en-ZW', { month: 'short', year: '2-digit' })}</span>
          <div className="space-y-1"><div className="h-2 rounded-full bg-[#e6ebe5]"><div className="h-full rounded-full bg-[#9aab9e]" style={{ width: `${(item.inquiries / maxMonthly) * 100}%` }} /></div><div className="h-2 rounded-full bg-[#e6ebe5]"><div className="h-full rounded-full bg-[#4d8d3a]" style={{ width: `${(item.completed / maxMonthly) * 100}%` }} /></div></div>
          <span className="text-right text-xs text-[#617069]">{item.completed}/{item.inquiries}</span>
        </div>) : <p className="text-sm text-[#7b8981]">Throughput history begins with the first booking.</p>}</div>
        <div className="mt-7 flex gap-5 border-t border-[#e4e9e3] pt-4 text-xs text-[#7b8981]"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#9aab9e]" /> Inquiries</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#4d8d3a]" /> Completed</span></div>
      </section>
      <section className="rounded-xl border border-[#dfe6df] bg-white p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8981]">Current-month funnel</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[#173129]">Where placements stand</h2>
        <div className="mt-6 divide-y divide-[#e8ece7]">{Object.entries(funnelLabels).map(([key, label]) => <div key={key} className="flex items-center justify-between py-3"><span className="text-sm text-[#52665c]">{label}</span><span className="font-display text-xl font-semibold text-[#173129]">{data.funnel[key] || 0}</span></div>)}</div>
      </section>
    </div>

    <section className="rounded-xl border border-[#bfd2ba] bg-[#eef5ea] p-5">
      <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#43892d]" /><div><p className="text-sm font-semibold text-[#315d4d]">Capacity interpretation</p><p className="mt-1 text-sm leading-6 text-[#52665c]">The software records and reports the 1,000/month target. Achieving it also requires enough verified worker inventory, placement staff, payment capacity, and client demand. Watch the projected pace, conversion rate, and pending verification supply together.</p></div></div>
    </section>
  </div>
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Gauge; label: string; value: string; note: string }) {
  return <div className="border-b border-r border-[#e4e9e3] p-5 last:border-r-0 sm:p-6"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7b8981]">{label}</p><Icon className="h-4 w-4 text-[#4d8d3a]" /></div><p className="mt-4 font-display text-4xl font-semibold text-[#173129]">{value}</p><p className="mt-2 text-xs text-[#7b8981]">{note}</p></div>
}

export default AdminCapacityPage
