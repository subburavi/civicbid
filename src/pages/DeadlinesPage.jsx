import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import { useApplications } from '../context/ApplicationContext'
import { differenceInDays, parseISO, format } from 'date-fns'
import clsx from 'clsx'

function getUrgency(days) {
  if (days <= 0) return { label: 'Overdue', bar: 'bg-red-600', badge: 'bg-red-100 text-red-700 border-red-200' }
  if (days <= 3) return { label: `${days}d`, bar: 'bg-red-500', badge: 'bg-red-50 text-red-600 border-red-200' }
  if (days <= 7) return { label: `${days}d`, bar: 'bg-orange-500', badge: 'bg-orange-50 text-orange-600 border-orange-200' }
  if (days <= 14) return { label: `${days}d`, bar: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
  return { label: `${days}d`, bar: 'bg-green-500', badge: 'bg-green-50 text-green-700 border-green-200' }
}

export default function DeadlinesPage() {
  const { bids } = useBids()
  const { applications, getBidProgress } = useApplications()
  const navigate = useNavigate()

  const tracked = bids
    .filter(b => applications[b.id] && b.deadline)
    .map(b => {
      const days = differenceInDays(parseISO(b.deadline), new Date())
      return { bid: b, app: applications[b.id], days, progress: getBidProgress(b.id) }
    })
    .sort((a, b) => a.days - b.days)

  const upcoming = bids
    .filter(b => !applications[b.id] && b.deadline && b.status !== 'closed')
    .map(b => ({ bid: b, days: differenceInDays(parseISO(b.deadline), new Date()) }))
    .filter(({ days }) => days >= 0 && days <= 30)
    .sort((a, b) => a.days - b.days)

  return (
    <Layout title="Deadlines" subtitle="Track bid deadlines for your applications">
      {tracked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4">Your Applications</h2>
          <div className="space-y-3">
            {tracked.map(({ bid, app, days, progress }) => {
              const urg = getUrgency(days)
              return (
                <div key={bid.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => navigate(`/applications/${bid.id}`)}>
                  <div className="flex items-start gap-4">
                    <div className={clsx('w-2 rounded-full self-stretch flex-shrink-0', urg.bar)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-semibold text-dark text-sm truncate">{bid.title}</p>
                        <span className={clsx('text-xs font-bold px-2 py-1 rounded-lg border flex-shrink-0', urg.badge)}>
                          {urg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{bid.agency} · Due {format(parseISO(bid.deadline), 'MMM d, yyyy')}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full', progress === 100 ? 'bg-green-500' : 'bg-primary')}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{progress}% complete</span>
                        {app.status === 'draft' && (
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/bids/${bid.id}`, { state: { applyMode: true } }) }}
                            className="text-xs font-semibold text-primary-dark hover:underline">
                            Continue →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4">Upcoming (Not Applied)</h2>
          <div className="grid grid-cols-2 gap-3">
            {upcoming.map(({ bid, days }) => {
              const urg = getUrgency(days)
              return (
                <div key={bid.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition-all cursor-pointer"
                  onClick={() => navigate(`/bids/${bid.id}`)}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-dark text-sm">{bid.title}</p>
                    <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-lg border flex-shrink-0', urg.badge)}>
                      {urg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{bid.agency}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Due {format(parseISO(bid.deadline), 'MMM d, yyyy')}</p>
                  <p className="text-xs font-bold text-dark mt-2">{bid.budget}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tracked.length === 0 && upcoming.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">⏰</p>
          <p className="font-semibold text-dark">No deadlines to track</p>
          <p className="text-sm text-gray-500 mt-1">Start applying to bids to see their deadlines here</p>
          <button onClick={() => navigate('/bids')} className="btn-primary mt-4 text-sm">Browse Bids</button>
        </div>
      )}
    </Layout>
  )
}
