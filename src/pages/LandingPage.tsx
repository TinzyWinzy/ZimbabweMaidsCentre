import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { logoUrl } from '@/lib/brand'
import makingBed from '../../makingbed.jpg'
import couchWork from '../../couchwork.jpg'
import cooking from '../../cooking.jpg'
import gardening from '../../gardening.jpg'

const services = [
  {
    number: '01',
    title: 'Housekeepers',
    description: 'Experienced support for considered, beautifully maintained homes.',
    image: couchWork,
    position: '50% 32%',
  },
  {
    number: '02',
    title: 'Chefs',
    description: 'Skilled home cooks and chefs matched to your household preferences.',
    image: cooking,
    position: '50% 38%',
  },
  {
    number: '03',
    title: 'Gardeners',
    description: 'Reliable outdoor care for gardens, grounds, and everyday maintenance.',
    image: gardening,
    position: '55% 42%',
  },
]

const safeguards = [
  'Identity and KYC documentation',
  'Background and reference checks',
  'Profile review before publication',
  'Secure payment confirmation',
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

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#f4f1e9] text-[#173129]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-20 focus:z-[100] focus:bg-[#173129] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <section className="relative min-h-[860px] border-b border-[#173129]/10 bg-[#f4f1e9] pt-24 lg:min-h-[800px]">
          <div className="mx-auto grid min-h-[736px] max-w-[1440px] grid-cols-1 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative z-10 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
              <p className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5a7468]">
                <span className="h-px w-8 bg-[#78b83c]" />
                Zimbabwe&apos;s considered placement service
              </p>

              <h1 className="max-w-[700px] font-display text-[clamp(3.5rem,7.2vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#173129]">
                The right help,
                <span className="block font-normal italic text-[#43892d]">chosen well.</span>
              </h1>

              <p className="mt-9 max-w-xl text-base leading-8 text-[#496057] sm:text-lg">
                A more thoughtful way to find verified domestic professionals for your home—from
                housekeepers and nannies to chefs, carers, and gardeners.
              </p>

              <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Link to="/services?intent=employer#start" className="oxygen-button group">
                  Find a professional
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/services?intent=worker#start"
                  className="border-b border-[#173129]/30 pb-1 text-sm font-semibold text-[#173129] transition-colors hover:border-[#78b83c] hover:text-[#43892d]"
                >
                  I&apos;m looking for work
                </Link>
              </div>

              <div className="mt-16 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-[#173129]/15 pt-7 text-sm text-[#496057] sm:grid-cols-3">
                <span>Identity checked</span>
                <span>References reviewed</span>
                <span className="col-span-2 sm:col-span-1">Secure payments</span>
              </div>
            </div>

            <div className="relative min-h-[560px] overflow-hidden lg:min-h-full">
              <img
                src={makingBed}
                alt="A professional housekeeper preparing a beautifully presented room"
                className="absolute inset-0 h-full w-full object-cover object-[52%_35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122820]/25 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-auto">
                <div className="oxygen-frost flex max-w-sm items-center gap-4 p-4 sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#173129]/15 bg-white/50">
                    <ShieldCheck className="h-5 w-5 text-[#315d4d]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#173129]">Verification before visibility</p>
                    <p className="mt-1 text-xs leading-5 text-[#496057]">
                      Profiles are reviewed before they appear on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <Reveal className="mx-auto max-w-[1280px]">
            <div className="grid gap-10 border-b border-[#173129]/15 pb-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                Expertise for the home
              </p>
              <h2 className="max-w-4xl font-display text-[clamp(2.8rem,5vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                People who understand the details of a well-run home.
              </h2>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-12">
              <article className="lg:col-span-7">
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:aspect-[5/6]">
                  <img
                    src={services[0].image}
                    alt="A professional housekeeper caring for a living room"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: services[0].position }}
                    loading="lazy"
                  />
                  <span className="absolute left-5 top-5 bg-[#f4f1e9] px-3 py-2 text-xs font-semibold text-[#173129]">
                    {services[0].number}
                  </span>
                </div>
                <div className="grid gap-4 border-b border-[#173129]/15 py-6 sm:grid-cols-[1fr_1fr]">
                  <h3 className="font-display text-3xl font-semibold">{services[0].title}</h3>
                  <p className="leading-7 text-[#5b6e66]">{services[0].description}</p>
                </div>
              </article>

              <div className="space-y-12 lg:col-span-5 lg:pt-28">
                {services.slice(1).map((service) => (
                  <article key={service.title}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={service.image}
                        alt={`A professional ${service.title.toLowerCase().replace(/s$/, '')} at work`}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: service.position }}
                        loading="lazy"
                      />
                      <span className="absolute left-4 top-4 bg-[#f4f1e9] px-3 py-2 text-xs font-semibold text-[#173129]">
                        {service.number}
                      </span>
                    </div>
                    <div className="grid gap-3 border-b border-[#173129]/15 py-5 sm:grid-cols-[0.7fr_1.3fr]">
                      <h3 className="font-display text-2xl font-semibold">{service.title}</h3>
                      <p className="text-sm leading-6 text-[#5b6e66]">{service.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="bg-[#173129] px-6 py-24 text-[#f8f4ea] sm:px-10 lg:px-16 lg:py-32">
          <Reveal className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7d76e]">
                Trust, made visible
              </p>
              <h2 className="mt-6 max-w-3xl font-display text-[clamp(3rem,5.4vw,6rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
                Confidence should never be an assumption.
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-[#c6d1cc]">
                Our platform is designed to bring the information that matters into the open, so
                families and professionals can move forward with greater clarity.
              </p>
            </div>

            <div className="border-y border-white/15">
              {safeguards.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-5 border-b border-white/15 py-5 last:border-b-0"
                >
                  <span className="text-xs text-[#a7d76e]">0{index + 1}</span>
                  <span className="flex-1 text-base">{item}</span>
                  <Check className="h-4 w-4 text-[#a7d76e]" />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="how-it-works" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <Reveal className="mx-auto max-w-[1280px]">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                  A clearer path
                </p>
                <h2 className="mt-6 max-w-xl font-display text-[clamp(3rem,5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                  From first search to the right introduction.
                </h2>
              </div>
              <p className="max-w-lg self-end text-base leading-8 text-[#5b6e66] lg:ml-auto">
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

        <section className="px-4 pb-4 sm:px-6 sm:pb-6">
          <Reveal className="relative mx-auto min-h-[620px] max-w-[1440px] overflow-hidden">
            <img
              src={couchWork}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[48%_30%]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#10271f]/65" />
            <div className="relative flex min-h-[620px] items-center px-6 py-20 sm:px-12 lg:px-24">
              <div className="max-w-3xl text-[#f8f4ea]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bfe986]">
                  Begin with confidence
                </p>
                <h2 className="mt-6 font-display text-[clamp(3.2rem,6.2vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
                  Find the person who fits your home.
                </h2>
                <p className="mt-8 max-w-xl text-base leading-8 text-white/75">
                  Create your brief and begin reviewing professionals suited to your needs.
                </p>
                <Link to="/services?intent=employer#start" className="oxygen-button oxygen-button-light group mt-10">
                  Tell us what you need
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <Reveal className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                Contact
              </p>
              <h2 className="mt-6 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Let&apos;s talk.
              </h2>
              <p className="mt-6 max-w-sm leading-7 text-[#5b6e66]">
                Questions about finding a professional or joining the platform? Our team is here to
                help.
              </p>
            </div>

            <div className="grid gap-8 border-t border-[#173129]/20 pt-8 sm:grid-cols-3 lg:border-t-0 lg:pt-0">
              {[
                { icon: Phone, label: 'Call', value: '+263 785 458 828', href: 'tel:+263785458828' },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'info@zimbabwemaidscentre.co.zw',
                  href: 'mailto:info@zimbabwemaidscentre.co.zw',
                },
                { icon: MapPin, label: 'Visit', value: 'Harare, Zimbabwe' },
              ].map((item) => (
                <div key={item.label} className="border-b border-[#173129]/20 pb-8">
                  <item.icon className="h-5 w-5 text-[#43892d]" />
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d8078]">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-3 block break-words text-sm leading-6 text-[#173129] hover:text-[#43892d]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm leading-6">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

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

export default LandingPage
