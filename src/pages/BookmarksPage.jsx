import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import { useApplications } from '../context/ApplicationContext'
import { differenceInDays, parseISO, format } from 'date-fns'
import clsx from 'clsx'

const STATUS_COLORS = {
  open: 'bg-green-50 text-green-700 border-green-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  closed: 'bg-gray-50 text-gray-500 border-gray-200',
  awarded: 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function BookmarksPage() {
  const { bids, bookmarkedIds, toggleBookmark } = useBids()
  const { applications } = useApplications()
  const navigate = useNavigate()

  const bookmarked = bids.filter(b => bookmarkedIds.includes(b.id))

  return (
    <Layout title="Bookmarks" subtitle={`${bookmarked.length} saved bid${bookmarked.length !== 1 ? 's' : ''}`}>
      {bookmarked.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24">
              <path d="M5 3h14a1 1 0 011 1v17l-8-5-8 5V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-heading font-bold text-dark text-lg">No bookmarks yet</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">Save bids you're interested in and they'll appear here for easy access.</p>
          <button onClick={() => navigate('/bids')} className="btn-primary mt-5 text-sm">Browse Bids</button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarked.map(bid => {
            const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null
            const app = applications[bid.id]
            const isApplied = !!app

            return (
              <div key={bid.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all flex items-center gap-5">
                {/* Left: bid info */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/bids/${bid.id}`)}>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize', STATUS_COLORS[bid.status])}>
                      {bid.status}
                    </span>
                    <span className="text-xs text-gray-400">{bid.category}</span>
                    {isApplied && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Applied
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-dark leading-tight mb-0.5 hover:text-primary-dark transition-colors">
                    {bid.title}
                  </h3>
                  <p className="text-sm text-gray-400">{bid.agency}</p>
                </div>

                {/* Middle: deadline + budget */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Budget</p>
                    <p className="text-sm font-bold text-dark">{bid.budget}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Deadline</p>
                    {bid.deadline ? (
                      <p className={clsx('text-sm font-bold',
                        daysLeft !== null && daysLeft <= 3 ? 'text-red-600' :
                        daysLeft !== null && daysLeft <= 7 ? 'text-orange-600' : 'text-dark')}>
                        {format(parseISO(bid.deadline), 'MMM d')}
                        {daysLeft !== null && (
                          <span className="text-[10px] font-semibold ml-1 text-gray-400">({daysLeft}d)</span>
                        )}
                      </p>
                    ) : <p className="text-sm text-gray-400">—</p>}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/bids/${bid.id}`, { state: { applyMode: !isApplied } })}
                    className={clsx('text-xs font-semibold px-4 py-2 rounded-xl transition-all',
                      isApplied
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-primary text-dark hover:bg-primary/80')}>
                    {isApplied ? 'View Application' : 'Apply Now'}
                  </button>
                  <button
                    onClick={() => toggleBookmark(bid.id)}
                    title="Remove bookmark"
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10 text-primary-dark hover:bg-red-50 hover:text-red-500 transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3h10a1 1 0 011 1v13l-6-4-6 4V4a1 1 0 011-1z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
