import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, ChevronDown, Mail, MapPin, MessageCircle, Phone, Search } from 'lucide-react'
import { api } from '@/lib/api'

type BookingStatus = 'inquiry' | 'matched' | 'booked' | 'fee_paid' | 'worker_assigned' | 'started' | 'completed' | 'cancelled'
type Booking = {
  id: string; workerName: string; clientName: string; clientEmail: string; clientPhone: string
  location: { city: string; suburb: string }; workType: string; startDate: string
  scheduleNotes: string; requirements: string; status: BookingStatus; createdAt: string
}

const statuses: { value: BookingStatus; label: string }[] = [
  { value: 'inquiry', label: 'Inquiry' }, { value: 'matched', label: 'Matched' },
  { value: 'booked', label: 'Booked' }, { value: 'fee_paid', label: 'Fee paid' },
  { value: 'worker_assigned', label: 'Worker assigned' }, { value: 'started', label: 'Started' },
  { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' },
]

export function AdminBookingsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('active')
  const [expanded, setExpanded] = useState<string | null>(null)
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ['admin-bookings'], queryFn: () => api<Booking[]>('/bookings') })
  const updateStatus = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => api('/bookings', { method: 'PATCH', body: JSON.stringify({ bookingId, status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  })
  const filtered = useMemo(() => bookings.filter((booking) => {
    const matchesSearch = `${booking.clientName} ${booking.workerName} ${booking.clientPhone} ${booking.location.suburb}`.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'active' ? !['completed', 'cancelled'].includes(booking.status) : booking.status === filter)
    return matchesSearch && matchesFilter
  }), [bookings, search, filter])

  return (
    <div className="space-y-7">
      <header className="border-b border-[#dfe6df] pb-7">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Placement operations</p>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">Booking pipeline</h1>
        <p className="mt-2 text-sm text-[#66766e]">Move every client request from first inquiry through successful placement.</p>
      </header>
      <div className="grid gap-3 rounded-xl border border-[#dfe6df] bg-white p-4 sm:grid-cols-[1fr_210px]">
        <label className="flex h-11 items-center gap-3 rounded-lg border border-[#dfe6df] px-3 focus-within:border-[#4d8d3a]"><Search className="h-4 w-4 text-[#87938c]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client or professional" className="w-full bg-transparent text-sm outline-none" /></label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-11 rounded-lg border border-[#dfe6df] bg-white px-3 text-sm outline-none"><option value="active">Active requests</option><option value="all">All requests</option>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select>
      </div>
      <section className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white">
        {isLoading ? <p className="p-8 text-sm text-[#66766e]">Loading requests…</p> : filtered.length === 0 ? <div className="p-10 text-center"><p className="font-display text-2xl font-semibold text-[#173129]">No placement requests in this view.</p><p className="mt-2 text-sm text-[#7b8981]">New website inquiries will appear here automatically.</p></div> :
          <div className="divide-y divide-[#e4e9e3]">{filtered.map((booking) => {
            const status = statuses.find((item) => item.value === booking.status)
            const whatsapp = `https://wa.me/${booking.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${booking.clientName}, this is Zimbabwe Maids Centre regarding your placement request for ${booking.workerName}.`)}`
            return <article key={booking.id}>
              <button onClick={() => setExpanded(expanded === booking.id ? null : booking.id)} className="grid w-full gap-4 p-5 text-left hover:bg-[#f8faf6] sm:grid-cols-[1fr_1fr_150px_28px] sm:items-center">
                <div><p className="font-semibold text-[#173129]">{booking.clientName}</p><p className="mt-1 text-xs text-[#7b8981]">{booking.location.suburb}, {booking.location.city}</p></div>
                <div><p className="text-sm font-medium text-[#31483f]">{booking.workerName}</p><p className="mt-1 text-xs capitalize text-[#7b8981]">{booking.workType} · start {new Date(`${booking.startDate}T12:00:00`).toLocaleDateString()}</p></div>
                <span className="w-fit rounded-full bg-[#e8f0e7] px-3 py-1 text-xs font-semibold text-[#315d4d]">{status?.label}</span>
                <ChevronDown className={`h-4 w-4 text-[#7b8981] transition-transform ${expanded === booking.id ? 'rotate-180' : ''}`} />
              </button>
              {expanded === booking.id && <div className="border-t border-[#e4e9e3] bg-[#f8faf6] p-5 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Detail icon={Phone} label="Phone" value={booking.clientPhone} />
                    <Detail icon={Mail} label="Email" value={booking.clientEmail} />
                    <Detail icon={MapPin} label="Location" value={`${booking.location.suburb}, ${booking.location.city}`} />
                    <Detail icon={CalendarDays} label="Preferred start" value={new Date(`${booking.startDate}T12:00:00`).toLocaleDateString('en-ZW', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    {(booking.scheduleNotes || booking.requirements) && <div className="sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8981]">Placement brief</p><p className="mt-2 text-sm leading-6 text-[#4d6259]">{[booking.scheduleNotes, booking.requirements].filter(Boolean).join(' · ')}</p></div>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8981]">Update stage</label>
                    <select value={booking.status} disabled={updateStatus.isPending} onChange={(e) => updateStatus.mutate({ bookingId: booking.id, status: e.target.value as BookingStatus })} className="mt-2 h-11 w-full rounded-lg border border-[#d6ded7] bg-white px-3 text-sm">{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
                    <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#173129] text-sm font-semibold text-white hover:bg-[#294b40]"><MessageCircle className="h-4 w-4" /> WhatsApp client</a>
                  </div>
                </div>
              </div>}
            </article>
          })}</div>}
      </section>
    </div>
  )
}

function Detail({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 h-4 w-4 text-[#4d8d3a]" /><div><p className="text-xs text-[#7b8981]">{label}</p><p className="mt-1 text-sm font-medium text-[#31483f]">{value}</p></div></div>
}

export default AdminBookingsPage
