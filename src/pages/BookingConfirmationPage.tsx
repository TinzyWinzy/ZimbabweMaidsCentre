import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react'

export function BookingConfirmationPage() {
  const [params] = useSearchParams()
  const reference = params.get('id')
  return (
    <main className="flex min-h-screen items-center bg-[#173129] px-5 py-28 text-[#f8f4ea]">
      <section className="mx-auto w-full max-w-3xl">
        <CheckCircle2 className="h-11 w-11 text-[#bfe986]" />
        <p className="mt-9 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bfe986]">Request received</p>
        <h1 className="mt-5 font-display text-[clamp(3.6rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.055em]">Your placement conversation has started.</h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-white/70">Our team will review the professional’s availability and contact you using the details provided. No hire or payment has been confirmed at this stage.</p>
        {reference && <p className="mt-6 text-xs uppercase tracking-[0.15em] text-white/45">Request reference {reference}</p>}
        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Link to="/professionals" className="oxygen-button oxygen-button-light">Browse more professionals <ArrowRight className="h-4 w-4" /></Link>
          <a href="tel:+263785458828" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"><Phone className="h-4 w-4" /> Call the placement team</a>
        </div>
      </section>
    </main>
  )
}

export default BookingConfirmationPage
