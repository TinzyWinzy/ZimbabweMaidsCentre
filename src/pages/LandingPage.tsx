import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Sparkles, Users, Briefcase, CreditCard, MessageCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '1,000+', label: 'Placements/Month' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24h', label: 'Avg. Time to Match' },
  { value: '10K+', label: 'Verified Workers' },
]

const features = [
  {
    icon: Shield,
    title: 'Verified Workers',
    desc: 'Every worker undergoes KYC, background checks, and reference validation before appearing on our platform.',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    desc: 'Our AI algorithm matches you with the ideal domestic worker based on skills, location, and salary preferences.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Pay placement fees securely via Paynow or EcoCash. Contact details unlock only after payment confirmation.',
  },
  {
    icon: MessageCircle,
    title: 'Direct Chat',
    desc: 'Secure in-app messaging lets you interview candidates and build rapport before making a final decision.',
  },
  {
    icon: Briefcase,
    title: 'Job Alerts',
    desc: 'Workers receive tailored job alerts via WhatsApp and push notifications — never miss an opportunity.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    desc: 'Our team handles disputes, refunds, and placement guarantees so you can hire with complete peace of mind.',
  },
]

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up as an employer or worker. Complete your profile with detailed preferences, skills, and requirements.' },
  { num: '02', title: 'Get Matched', desc: 'Our matching engine finds the best candidates or jobs based on your profile. Review scores and compatibility.' },
  { num: '03', title: 'Connect & Hire', desc: 'Pay the placement fee to unlock contact details. Chat, interview, and confirm your perfect match.' },
]

const testimonials = [
  { name: 'Tendai M.', role: 'Employer, Harare', text: '"Found a wonderful nanny for my twins in under 48 hours. The verification badges gave me total peace of mind."', rating: 5 },
  { name: 'Chipo M.', role: 'Worker, Bulawayo', text: '"I was matched with three great families within a week of uploading my documents. The WhatsApp alerts made it so easy."', rating: 5 },
  { name: 'Michael K.', role: 'Employer, Borrowdale', text: '"The encrypted contact system is brilliant — no spam, only serious candidates. EcoCash payment was seamless."', rating: 5 },
]

function useParallax(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const speed = 0.15
      const yOffset = (window.innerHeight - rect.top) * speed
      el.style.setProperty('--parallax-y', `${Math.max(0, yOffset)}px`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
}

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = 'true'
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 data-[revealed=true]:opacity-100 data-[revealed=true]:translate-y-0 ${className}`}>
      {children}
    </div>
  )
}

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  useParallax(heroRef)

  return (
    <div className="overflow-hidden">
      {/* ─── TOP NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-full ring-2 ring-white/20" />
          <span className="font-bold text-white text-lg drop-shadow-sm">ZimMaids</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
          <Link to="/register">
            <Button size="sm" className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg text-sm h-8">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-16" style={{ '--parallax-y': '0px' } as React.CSSProperties}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 50% 80%, rgba(22, 163, 74, 0.08) 0%, transparent 50%)`
        }} />
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/5 animate-float" style={{
              width: `${2 + Math.random() * 6}px`,
              height: `${2 + Math.random() * 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
            }} />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted by 10,000+ families across Zimbabwe
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white mb-6">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-green-300 bg-clip-text text-transparent">
              Domestic Worker
            </span>
            <br />
            With Peace of Mind
          </h1>

          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-emerald-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Zimbabwe Maids Centre connects you with verified, trusted domestic workers through 
            intelligent matching, secure payments, and end-to-end support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="relative h-12 px-8 text-base bg-white text-emerald-900 hover:bg-emerald-50 shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-emerald-400/40 text-emerald-100 hover:bg-emerald-800/40 hover:text-white transition-all">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Glass stats preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.slice(0, 4).map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center transition-all hover:bg-white/10 hover:scale-105">
                <div className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-white">{stat.value}</div>
                <div className="text-xs text-emerald-200/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative py-24 px-4 bg-gray-50">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold text-gray-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                A complete platform designed to make hiring domestic workers simple, safe, and satisfying.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat) => (
                <div key={feat.title} className="group relative rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 hover:border-emerald-200/60">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <AnimatedSection className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to your perfect match.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

            {steps.map((step) => (
              <div key={step.num} className="relative text-center group">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%),
                           radial-gradient(circle at 70% 30%, white 0%, transparent 50%)`
        }} />
        <AnimatedSection className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white mb-1">{stat.value}</div>
                <div className="text-emerald-300/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative py-24 px-4 bg-gray-50">
        <AnimatedSection className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.3) 0%, transparent 40%),
                           radial-gradient(circle at 20% 80%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`
        }} />
        <AnimatedSection className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-emerald-200/80 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of Zimbabwean families and workers already using Zimbabwe Maids Centre.
          </p>
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 text-lg bg-white text-emerald-900 hover:bg-emerald-50 shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-full" />
                <span className="font-bold text-emerald-800">ZimMaids</span>
              </div>
              <p className="text-sm text-gray-500">Harare, Zimbabwe<br />+263 785 458 828</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Employers</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Post a Job</Link></li>
                <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Browse Workers</Link></li>
                <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Workers</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Create Profile</Link></li>
                <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Find Jobs</Link></li>
                <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Verification Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Zimbabwe Maids Centre. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Keyframes for floating particles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  )
}
