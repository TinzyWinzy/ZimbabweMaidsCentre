import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type Intent = 'employer' | 'worker'

interface LeadDraft {
  intent: Intent
  service: string
  location: string
  timing: string
  name: string
  email: string
  phone: string
  source: string
}

interface SmartLeadFormProps {
  source: 'services' | 'about'
}

const services = ['Housekeeper', 'Nanny', 'Chef', 'Cleaner', 'Gardener', 'Carer']

export function SmartLeadForm({ source }: SmartLeadFormProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedIntent = searchParams.get('intent')
  const [step, setStep] = useState(1)
  const [intent, setIntent] = useState<Intent>(requestedIntent === 'worker' ? 'worker' : 'employer')
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')
  const [timing, setTiming] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const guidance = useMemo(() => {
    if (!service || !location) return 'Choose a role and location to shape the next step.'
    return intent === 'employer'
      ? `We’ll use your ${service.toLowerCase()} brief in ${location} to begin a focused candidate search.`
      : `We’ll carry your ${service.toLowerCase()} preference in ${location} into your professional profile.`
  }, [intent, location, service])

  const continueToDetails = () => {
    if (service && location && timing) setStep(2)
  }

  const submitLead = (event: React.FormEvent) => {
    event.preventDefault()
    const draft: LeadDraft = {
      intent,
      service,
      location,
      timing,
      name,
      email,
      phone,
      source,
    }
    sessionStorage.setItem('zmc-lead-draft', JSON.stringify(draft))
    navigate(`/register?role=${intent}`)
  }

  return (
    <section id="start" className="bg-[#173129] px-6 py-24 text-[#f8f4ea] sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7d76e]">
            Smart enquiry · step {step} of 2
          </p>
          <h2 className="mt-6 max-w-xl font-display text-[clamp(2.8rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
            Tell us what you need. We’ll shape the route.
          </h2>
          <p className="mt-7 max-w-lg text-base leading-8 text-[#c6d1cc]">
            This is not a generic contact form. Your answers determine the information we carry
            into your account and the placement path you see next.
          </p>
          <div className="mt-10 border-l border-[#a7d76e]/50 pl-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7d76e]">
              Your next step
            </p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/75" aria-live="polite">
              {guidance}
            </p>
          </div>
        </div>

        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-8 lg:p-10">
          {step === 1 ? (
            <div>
              <fieldset>
                <legend className="text-sm font-semibold">What brings you here?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {([
                    { value: 'employer' as const, label: 'I need help at home', icon: Home },
                    { value: 'worker' as const, label: 'I am looking for work', icon: BriefcaseBusiness },
                  ]).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setIntent(option.value)}
                      aria-pressed={intent === option.value}
                      className={`flex min-h-24 items-center gap-4 border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a7d76e] ${
                        intent === option.value
                          ? 'border-[#a7d76e] bg-[#a7d76e]/12'
                          : 'border-white/15 hover:border-white/35'
                      }`}
                    >
                      <option.icon className="h-5 w-5 shrink-0 text-[#a7d76e]" />
                      <span className="text-sm font-semibold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>{intent === 'employer' ? 'Role needed' : 'Your main role'}</span>
                  <Select
                    value={service}
                    onChange={(event) => setService(event.target.value)}
                    className="h-12 rounded-none border-white/20 bg-[#f8f4ea] px-4 text-[#173129]"
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((item) => <option key={item}>{item}</option>)}
                  </Select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Town or suburb</span>
                  <Input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Harare"
                    className="h-12 rounded-none border-white/20"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-medium sm:col-span-2">
                  <span>{intent === 'employer' ? 'When do you need someone?' : 'When can you start?'}</span>
                  <Select
                    value={timing}
                    onChange={(event) => setTiming(event.target.value)}
                    className="h-12 rounded-none border-white/20 bg-[#f8f4ea] px-4 text-[#173129]"
                    required
                  >
                    <option value="">Select timing</option>
                    <option>Immediately</option>
                    <option>Within 2 weeks</option>
                    <option>Within a month</option>
                    <option>Just exploring</option>
                  </Select>
                </label>
              </div>

              <button
                type="button"
                onClick={continueToDetails}
                disabled={!service || !location || !timing}
                className="oxygen-button oxygen-button-light mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={submitLead}>
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#a7d76e]">{intent}</p>
                  <p className="mt-1 text-sm text-white/70">{service} · {location} · {timing}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Edit
                </button>
              </div>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium sm:col-span-2">
                  <span>Full name</span>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-12 rounded-none"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Email</span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-none"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>WhatsApp / phone</span>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+263"
                    className="h-12 rounded-none"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>
              <p className="mt-5 text-xs leading-5 text-white/55">
                Your answers are saved on this device and used to prefill the account setup that follows.
              </p>
              <button type="submit" className="oxygen-button oxygen-button-light mt-8 w-full sm:w-auto">
                Continue to account setup
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
