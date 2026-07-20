import { Link } from 'react-router-dom'
import {
  ArrowDown,
  Check,
  Home,
  UtensilsCrossed,
  Sun,
  Scissors,
  HeartHandshake,
  TreePine,
} from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { SmartLeadForm } from '@/components/shared/SmartLeadForm'
import { logoUrl } from '@/lib/brand'

const serviceList = [
  {
    icon: Home,
    title: 'Housekeepers',
    description: 'Experienced professionals for daily cleaning, laundry, and general household organisation. Our housekeepers are matched to the rhythm and standards of your home.',
    attributes: ['Daily & weekly cleaning', 'Laundry & ironing', 'Basic meal preparation', 'Household organisation'],
  },
  {
    icon: HeartHandshake,
    title: 'Nannies',
    description: 'Caring and experienced nannies who provide attentive childcare, developmental activities, and a safe environment for children of all ages.',
    attributes: ['Full-time & part-time care', 'Newborn & toddler experience', 'Educational play', 'Light child-related housekeeping'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Chefs',
    description: 'Skilled home cooks and qualified chefs who prepare nutritious, well-presented meals tailored to your family\'s preferences and dietary requirements.',
    attributes: ['Daily meal preparation', 'Event & dinner party catering', 'Dietary-specific cooking', 'Menu planning & shopping'],
  },
  {
    icon: Scissors,
    title: 'Cleaners',
    description: 'Thorough and reliable cleaners who handle deep cleaning, move-in/move-out services, and maintaining pristine living and working spaces.',
    attributes: ['Deep cleaning services', 'Move-in / move-out', 'Commercial & residential', 'Eco-friendly products available'],
  },
  {
    icon: TreePine,
    title: 'Gardeners',
    description: 'Knowledgeable gardeners who care for your outdoor spaces — from lawns and flower beds to vegetable gardens and general grounds maintenance.',
    attributes: ['Lawn mowing & edging', 'Planting & pruning', 'Weeding & mulching', 'Irrigation maintenance'],
  },
  {
    icon: Sun,
    title: 'Carers',
    description: 'Compassionate caregivers who provide companionship, personal care, and daily support for elderly or vulnerable family members in the comfort of home.',
    attributes: ['Elderly care & companionship', 'Personal care assistance', 'Medication reminders', 'Light housekeeping & meals'],
  },
]

const safeguards = [
  'Government-issued ID and address verification',
  'Professional reference checks with former employers',
  'Police clearance and background screening',
  'Face-to-face interview by our placement team',
  'Ongoing quality check-ins after placement',
]

const process = [
  {
    number: '01',
    eyebrow: 'Tell us what matters',
    title: 'Create a considered brief.',
    description:
      'Share the role, location, schedule, experience level, and household preferences that matter to you.',
  },
  {
    number: '02',
    eyebrow: 'Review with confidence',
    title: 'Meet relevant candidates.',
    description:
      'Browse profiles selected for fit, with verification information presented clearly before you decide.',
  },
  {
    number: '03',
    eyebrow: 'Move forward securely',
    title: 'Connect and make the hire.',
    description:
      'Complete payment securely, unlock contact details, and begin the conversation with your preferred candidate.',
  },
]

export function ServicesPage() {
  return (
    <main className="overflow-hidden bg-[#f4f1e9] text-[#173129]">
      <div id="main-content">
        {/* Hero */}
        <section className="bg-[#173129] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
          <Reveal className="mx-auto max-w-[1280px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7d76e]">
              Our services
            </p>
            <h1 className="mt-8 max-w-4xl font-display text-[clamp(3rem,6.2vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#f8f4ea]">
              Expertise for every
              <span className="block font-normal italic text-[#a7d76e]">corner of your home.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#c6d1cc] sm:text-lg">
              From daily housekeeping to specialised care, we connect you with verified professionals
              whose skills and experience match your household&apos;s unique needs.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <a href="#service-grid" className="oxygen-button oxygen-button-light group">
                Explore services
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#start"
                className="border-b border-[#f8f4ea]/40 pb-1 text-sm font-semibold text-[#f8f4ea] transition-colors hover:border-[#bfe986] hover:text-[#bfe986]"
              >
                Tell us what you need
              </a>
            </div>
          </Reveal>
        </section>

        {/* Service Grid */}
        <section id="service-grid" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1280px]">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                Find the right fit
              </p>
              <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,5vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                Services designed around your household.
              </h2>
            </Reveal>
            <div className="mt-16 border-t border-[#173129]/20">
              {serviceList.map((service, i) => (
                <Reveal key={service.title}>
                  <article className="group grid gap-7 border-b border-[#173129]/20 py-8 md:grid-cols-[72px_0.75fr_1.25fr] lg:gap-10 lg:py-12">
                    <div className="flex items-start gap-4 md:block">
                      <span className="text-xs font-semibold text-[#43892d]">{String(i + 1).padStart(2, '0')}</span>
                      <div className="mt-0 flex h-10 w-10 items-center justify-center border border-[#173129]/20 md:mt-6">
                        <service.icon className="h-4 w-4 text-[#315d4d]" />
                      </div>
                    </div>
                    <div className="lg:pt-1">
                      <h3 className="font-display text-3xl font-semibold lg:text-4xl">{service.title}</h3>
                      <p className="mt-4 max-w-lg text-sm leading-7 text-[#5b6e66]">{service.description}</p>
                    </div>
                    <ul className="grid content-start gap-x-8 gap-y-0 border-t border-[#173129]/15 sm:grid-cols-2 md:border-t-0">
                        {service.attributes.map((attr) => (
                          <li key={attr} className="flex items-center gap-3 border-b border-[#173129]/15 py-4 text-sm text-[#496057]">
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#78b83c]" />
                            {attr}
                          </li>
                        ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="bg-[#173129] px-6 py-24 text-[#f8f4ea] sm:px-10 lg:px-16 lg:py-32">
          <Reveal className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7d76e]">
                Trust, made visible
              </p>
              <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,4.8vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
                Every professional is verified before they appear.
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-[#c6d1cc]">
                Our five-step screening process means you review candidates who have already been
                vetted — so you can focus on finding the right fit.
              </p>
            </div>
            <div className="border-y border-white/15">
              {safeguards.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-5 border-b border-white/15 py-5 last:border-b-0"
                >
                  <span className="text-xs text-[#a7d76e] shrink-0">0{index + 1}</span>
                  <span className="flex-1 text-base">{item}</span>
                  <Check className="h-4 w-4 text-[#a7d76e] shrink-0" />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* How It Works */}
        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <Reveal className="mx-auto max-w-[1280px]">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                  A clearer path
                </p>
                <h2 className="mt-6 max-w-xl font-display text-[clamp(2.5rem,4.8vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
                  From first search to the right introduction.
                </h2>
              </div>
              <p className="max-w-lg self-end text-base leading-7 text-[#5b6e66] lg:ml-auto">
                A simple process that respects your time while keeping the important decisions in
                your hands.
              </p>
            </div>
            <div className="mt-16 border-t border-[#173129]/20">
              {process.map((step) => (
                <article
                  key={step.number}
                  className="group grid gap-6 border-b border-[#173129]/20 py-8 transition-colors hover:bg-white/35 sm:grid-cols-[80px_0.75fr_1.25fr] sm:px-4 lg:items-center"
                >
                  <span className="text-xs font-semibold text-[#43892d]">{step.number}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6d8078]">
                      {step.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{step.title}</h3>
                  </div>
                  <p className="max-w-xl leading-7 text-[#5b6e66] lg:ml-auto">{step.description}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <SmartLeadForm source="services" />

        {/* Footer */}
        <footer className="border-t border-[#173129]/15 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                <p className="font-display text-xl font-semibold">Zimbabwe Maids Centre</p>
              </div>
              <p className="mt-4 text-sm text-[#6d8078]">
                Considered domestic placement across Zimbabwe.
              </p>
            </div>
            <div className="text-sm text-[#6d8078] sm:text-right">
              <div className="mb-4 flex gap-5 sm:justify-end">
                <Link to="/about" className="hover:text-[#173129]">About</Link>
                <Link to="/services" className="hover:text-[#173129]">Services</Link>
                <Link to="/register" className="hover:text-[#173129]">Find a professional</Link>
                <Link to="/register" className="hover:text-[#173129]">Join as a worker</Link>
              </div>
              <p>&copy; {new Date().getFullYear()} Zimbabwe Maids Centre.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default ServicesPage
