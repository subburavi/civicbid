import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useBids } from '../context/BidContext'
import { useApplications } from '../context/ApplicationContext'
import { differenceInDays, parseISO, format } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  draft: { label: 'In Progress', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  applied: { label: 'Submitted', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  approved: { label: 'Approved', color: 'text-green-700 bg-green-50 border-green-200' },
  rejected: { label: 'Not Selected', color: 'text-gray-600 bg-gray-50 border-gray-200' },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { bids } = useBids()
  const { applications, getBidProgress } = useApplications()
  const navigate = useNavigate()

  const appEntries = Object.entries(applications)
  const draftCount = appEntries.filter(([, a]) => a.status === 'draft').length
  const appliedCount = appEntries.filter(([, a]) => a.status === 'applied').length
  const approvedCount = appEntries.filter(([, a]) => a.status === 'approved').length

  const urgentBids = bids.filter(b => {
    if (b.status === 'closed' || b.status === 'awarded') return false
    const days = b.deadline ? differenceInDays(parseISO(b.deadline), new Date()) : null
    return days !== null && days <= 14
  }).sort((a, b) => differenceInDays(parseISO(a.deadline), new Date()) - differenceInDays(parseISO(b.deadline), new Date()))

  const recentApps = appEntries
    .map(([bidId, app]) => ({ bidId, app, bid: bids.find(b => b.id === bidId) }))
    .filter(({ bid }) => bid)
    .sort((a, b) => new Date(b.app.lastUpdated) - new Date(a.app.lastUpdated))
    .slice(0, 4)

  const STATS = [
    { label: 'In Progress', value: draftCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: '✍️', to: '/applications' },
    { label: 'Submitted', value: appliedCount, color: 'text-blue-600', bg: 'bg-blue-50', icon: '📤', to: '/applications' },
    { label: 'Approved', value: approvedCount, color: 'text-green-600', bg: 'bg-green-50', icon: '✅', to: '/applications' },
    { label: 'Open Bids', value: bids.filter(b => b.status === 'open' || b.status === 'urgent').length, color: 'text-purple-600', bg: 'bg-purple-50', icon: '📋', to: '/bids' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <Layout title="Dashboard" subtitle={`${greeting}, ${user?.name?.split(' ')[0]}`}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <button key={s.label} onClick={() => navigate(s.to)}
            className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:border-gray-200 hover:shadow-sm transition-all">
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3', s.bg)}>
              {s.icon}
            </div>
            <p className={clsx('text-2xl font-bold font-heading', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Recent Applications</h3>
            <button onClick={() => navigate('/applications')}
              className="text-xs font-semibold text-primary-dark hover:underline">View all</button>
          </div>

          {recentApps.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm font-semibold text-dark">No applications yet</p>
              <p className="text-xs text-gray-400 mt-0.5">Start by browsing open bids</p>
              <button onClick={() => navigate('/bids')} className="btn-primary mt-3 text-xs py-1.5">Browse Bids</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map(({ bidId, app, bid }) => {
                const progress = getBidProgress(bidId)
                const cfg = STATUS_CONFIG[app.status]
                const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null
                return (
                  <div key={bidId}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 cursor-pointer transition-colors"
                    onClick={() => navigate(`/applications/${bidId}`)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark truncate">{bid.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{bid.agency}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-2 w-28">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={clsx('h-full rounded-full', progress === 100 ? 'bg-green-500' : 'bg-primary')}
                            style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 w-7">{progress}%</span>
                      </div>
                      <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border', cfg?.color)}>
                        {cfg?.label}
                      </span>
                      {daysLeft !== null && daysLeft <= 7 && (
                        <span className="text-xs font-semibold text-red-500">{daysLeft}d</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Upcoming Deadlines</h3>
            <button onClick={() => navigate('/deadlines')}
              className="text-xs font-semibold text-primary-dark hover:underline">View all</button>
          </div>

          {urgentBids.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-2xl mb-2">⏰</p>
              <p className="text-xs text-gray-400">No urgent deadlines</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {urgentBids.slice(0, 5).map(bid => {
                const days = differenceInDays(parseISO(bid.deadline), new Date())
                return (
                  <div key={bid.id}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/60 cursor-pointer transition-colors"
                    onClick={() => navigate(`/bids/${bid.id}`)}>
                    <div className={clsx('w-1.5 rounded-full self-stretch flex-shrink-0',
                      days <= 3 ? 'bg-red-500' : days <= 7 ? 'bg-orange-400' : 'bg-yellow-400')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-dark truncate">{bid.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {format(parseISO(bid.deadline), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className={clsx('text-xs font-bold flex-shrink-0',
                      days <= 3 ? 'text-red-500' : days <= 7 ? 'text-orange-500' : 'text-yellow-600')}>
                      {days}d
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Quick actions */}
          <div className="px-5 py-4 border-t border-gray-100 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Quick Actions</p>
            <button onClick={() => navigate('/bids')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🔍</span>
              <span className="text-xs font-semibold text-dark">Browse open bids</span>
            </button>
            <button onClick={() => navigate('/applications')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-sm">📁</span>
              <span className="text-xs font-semibold text-dark">My applications</span>
            </button>
            <button onClick={() => navigate('/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <span className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-sm">👤</span>
              <span className="text-xs font-semibold text-dark">Update profile</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
