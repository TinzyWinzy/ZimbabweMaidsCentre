import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Heart,
  Shield,
  Eye,
  Star,
} from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { SmartLeadForm } from '@/components/shared/SmartLeadForm'

const stats = [
  { value: '50+', label: 'Families Placed' },
  { value: '200+', label: 'Workers Verified' },
  { value: '4', label: 'Years Active' },
  { value: '6', label: 'Cities Served' },
]

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Every profile is verified. Every reference is checked. We stand behind the people we present.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We match carefully, considering not just skills but temperament, schedule, and household culture.',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'We believe in fair work, dignified wages, and building lasting professional relationships.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'From pricing to placement, every step of the process is clear and communicated in advance.',
  },
]

const team = [
  {
    name: 'Tafadzwa Moyo',
    role: 'Founder & Director',
    bio: 'Building dignified domestic placement across Zimbabwe with a decade of experience in human resources.',
  },
  {
    name: 'Rumbidzai Ncube',
    role: 'Operations Lead',
    bio: 'Ensuring every placement runs smoothly from first interview to final confirmation.',
  },
  {
    name: 'Kudzai Chikwanha',
    role: 'Verification Manager',
    bio: 'Oversees all background checks, KYC documentation, and reference verification.',
  },
]

export function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#f4f1e9] text-[#173129]">
      <div id="main-content">
        {/* Hero */}
        <section className="relative flex min-h-[660px] items-center overflow-hidden bg-[#173129]">
          <div className="absolute right-0 top-0 h-full w-px bg-white/10 lg:right-[30%]" />
          <div className="absolute right-[30%] top-0 hidden h-48 w-px bg-[#a7d76e]/50 lg:block" />
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-32 sm:px-10 lg:px-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bfe986]">
              About Zimbabwe Maids Centre
            </p>
            <h1 className="mt-8 max-w-5xl font-display text-[clamp(3.2rem,6.5vw,7rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#f8f4ea]">
              Built on trust,
              <span className="block font-normal italic text-[#a7d76e]">grounded in Zimbabwe.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#c6d1cc] sm:text-lg">
              We connect families with verified domestic professionals through a process built on
              respect, rigour, and a deep understanding of Zimbabwean households.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <a href="#start" className="oxygen-button oxygen-button-light group">
                Start a smart enquiry
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/services"
                className="border-b border-[#f8f4ea]/40 pb-1 text-sm font-semibold text-[#f8f4ea] transition-colors hover:border-[#bfe986] hover:text-[#bfe986]"
              >
                Explore our services
              </Link>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <Reveal className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                Our story
              </p>
              <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.5rem,4.8vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
                A placement service built for Zimbabwean homes.
              </h2>
            </div>
            <div className="border-t border-[#173129]/20 pt-8">
              <div className="space-y-5 text-base leading-8 text-[#5b6e66]">
                <p>
                  Zimbabwe Maids Centre was founded to address a simple problem: families needed
                  reliable domestic help, and skilled workers needed a platform that treated them
                  with dignity. The existing options were fragmented, informal, and lacked proper
                  verification.
                </p>
                <p>
                  Our founders — with backgrounds in HR, social work, and household management —
                  created a service that brings rigour to every placement. We verify identity,
                  check references, and take the time to understand what each household truly needs.
                </p>
                <p>
                  Today, we operate across six cities in Zimbabwe, placing housekeepers, nannies,
                  chefs, cleaners, carers, and gardeners into homes where they thrive. Our mission
                  is to make trusted domestic placement the standard, not the exception.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* By the Numbers */}
        <section className="bg-[#173129] px-6 py-24 text-[#f8f4ea] sm:px-10 lg:py-32">
          <Reveal className="mx-auto max-w-[1280px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7d76e]">
              By the numbers
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,4vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              The impact we&apos;re making across Zimbabwe.
            </h2>
            <div className="mt-16 grid border-y border-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-white/15 p-8 text-left sm:border-r lg:border-b-0 last:border-r-0">
                  <p className="font-display text-5xl font-semibold text-[#a7d76e]">{stat.value}</p>
                  <p className="mt-3 text-sm text-[#c6d1cc]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Our Values */}
        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <Reveal className="mx-auto max-w-[1280px]">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                  What we believe
                </p>
                <h2 className="mt-6 max-w-xl font-display text-[clamp(2.5rem,4.8vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
                  Values that guide every placement.
                </h2>
              </div>
              <p className="max-w-lg self-end text-base leading-7 text-[#5b6e66] lg:ml-auto">
                These principles shape how we work with families, professionals, and our own team
                every single day.
              </p>
            </div>
            <div className="mt-16 grid border-t border-[#173129]/20 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <article key={value.title} className="group border-b border-[#173129]/20 p-7 sm:border-r lg:min-h-[280px] last:border-r-0">
                  <div className="mb-8 flex h-10 w-10 items-center justify-center border border-[#173129]/20">
                    <value.icon className="h-4 w-4 text-[#315d4d]" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5b6e66]">{value.description}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Leadership Team */}
        <section className="bg-[#173129]/5 px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <Reveal className="mx-auto max-w-[1280px]">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#43892d]">
                Leadership
              </p>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                The team behind the service.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#5b6e66]">
                Experienced professionals committed to raising the standard of domestic placement
                in Zimbabwe.
              </p>
            </div>
            <div className="mt-16 grid border-t border-[#173129]/20 lg:grid-cols-3">
              {team.map((member) => (
                <article key={member.name} className="border-b border-[#173129]/20 p-8 lg:border-r last:border-r-0">
                  <div className="flex h-14 w-14 items-center justify-center border border-[#173129]/20 font-display text-xl font-semibold text-[#315d4d]">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{member.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#43892d]">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-[#5b6e66]">{member.bio}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <SmartLeadForm source="about" />

        {/* Footer */}
        <footer className="border-t border-[#173129]/15 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="" className="h-10 w-10 rounded-full object-cover" />
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

export default AboutPage
