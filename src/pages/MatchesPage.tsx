import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock3, Sparkles } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatches } from '@/features/matching/hooks/useMatches'
import { useAuthStore } from '@/stores/authStore'

const statusCopy: Record<string, string> = {
  pending: 'Ready to review',
  confirmed: 'Confirmed',
  completed: 'Placement complete',
  cancelled: 'Closed',
}

export function MatchesPage() {
  const { userData } = useAuthStore()
  const role = userData?.role === 'employer' || userData?.role === 'worker' ? userData.role : undefined
  const { matches, isLoading } = useMatches(userData?.uid, role)

  return (
    <div className="max-w-4xl space-y-8">
      <header className="border-b border-[#173129]/15 pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#43892d]">
          Matching
        </p>
        <h1 className="page-title mt-3 text-3xl md:text-4xl">
          {role === 'employer' ? 'Candidate matches' : 'Opportunity matches'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b6e66]">
          Matches are ordered by fit across role requirements, location, availability, and profile information.
        </p>
      </header>

      {isLoading ? (
        <LoadingSpinner className="mx-auto mt-12" />
      ) : matches.length === 0 ? (
        <section className="border border-[#173129]/15 bg-white/55 p-8 sm:p-12">
          <Sparkles className="h-6 w-6 text-[#43892d]" />
          <h2 className="mt-6 font-display text-3xl font-semibold">Your first match starts with a complete brief.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#5b6e66]">
            {role === 'employer'
              ? 'Post a detailed role and the matching system will begin ranking suitable professionals.'
              : 'Complete your profile and verification details so employers can understand your experience and availability.'}
          </p>
          <Link
            to={role === 'employer' ? '/jobs/new' : '/profile'}
            className="oxygen-button mt-7"
          >
            {role === 'employer' ? 'Create a job brief' : 'Complete your profile'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <div className="border-t border-[#173129]/20">
          {matches.map((match, index) => (
            <article
              key={match.id}
              className="grid gap-5 border-b border-[#173129]/20 py-7 sm:grid-cols-[70px_1fr_auto] sm:items-center"
            >
              <div>
                <p className="text-xs font-semibold text-[#43892d]">#{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{Math.round(match.score)}%</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {match.status === 'confirmed' || match.status === 'completed'
                    ? <CheckCircle2 className="h-4 w-4 text-[#43892d]" />
                    : <Clock3 className="h-4 w-4 text-[#6d8078]" />}
                  <h2 className="font-semibold">{statusCopy[match.status] || match.status}</h2>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#6d8078]">
                  Job reference {match.jobId}
                </p>
                {match.reasons?.length > 0 && (
                  <p className="mt-3 text-sm leading-6 text-[#5b6e66]">{match.reasons.slice(0, 3).join(' · ')}</p>
                )}
              </div>
              {role === 'employer' && !match.placementFeePaid && (
                <Link to="/payments" className="text-sm font-semibold text-[#43892d] hover:text-[#173129]">
                  Review access
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchesPage
