import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import { useApplications } from '../context/ApplicationContext'
import { useUserProfile } from '../context/UserProfileContext'
import { differenceInDays, parseISO } from 'date-fns'
import clsx from 'clsx'

const CATEGORY_ICONS = {
  Landscaping: '🌿',
  Construction: '🏗️',
  Transportation: '🚦',
  Accessibility: '♿',
  Environmental: '🌱',
}

const STATUS_COLORS = {
  open: 'bg-green-50 text-green-700 border-green-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  closed: 'bg-gray-50 text-gray-500 border-gray-200',
  awarded: 'bg-blue-50 text-blue-700 border-blue-200',
}

function BidCard({ bid, appStatus, isBookmarked, onToggleBookmark }) {
  const navigate = useNavigate()
  const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => navigate(`/bids/${bid.id}`)}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize', STATUS_COLORS[bid.status])}>
                {bid.status}
              </span>
              {appStatus && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Applied
                </span>
              )}
              {bid.featured && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary-dark border border-primary/30">
                  Featured
                </span>
              )}
            </div>
            <h3 className="font-semibold text-dark text-sm leading-tight group-hover:text-primary-dark transition-colors">
              {bid.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{bid.agency}</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onToggleBookmark(bid.id) }}
            className={clsx('flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all',
              isBookmarked ? 'bg-primary/20 text-primary-dark' : 'bg-gray-50 text-gray-300 hover:text-gray-500')}>
            <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 20 20">
              <path d="M5 3h10a1 1 0 011 1v13l-6-4-6 4V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{bid.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{CATEGORY_ICONS[bid.category] || '📋'}</span>
              <span className="text-xs text-gray-500">{bid.category}</span>
            </div>
            <span className="text-xs font-bold text-dark">{bid.budget}</span>
          </div>
          {daysLeft !== null && (
            <span className={clsx('text-xs font-semibold px-2 py-1 rounded-lg',
              daysLeft <= 3 ? 'bg-red-50 text-red-600' :
              daysLeft <= 7 ? 'bg-orange-50 text-orange-600' :
              daysLeft <= 14 ? 'bg-yellow-50 text-yellow-700' :
              'bg-gray-50 text-gray-500')}>
              {daysLeft}d left
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BrowseBidsPage() {
  const { bids, filteredBids, filterCategory, setFilterCategory, searchQuery, setSearchQuery, bookmarkedIds, toggleBookmark } = useBids()
  const { applications } = useApplications()
  const { profile } = useUserProfile()
  const [activeTab, setActiveTab] = useState('all')
  const [localSearch, setLocalSearch] = useState('')

  const interestedCategories = profile?.interestedCategories || []

  const recommendedBids = bids.filter(b =>
    interestedCategories.includes(b.category) && b.status !== 'closed' && b.status !== 'awarded'
  )

  const displayBids = activeTab === 'recommended' ? recommendedBids : filteredBids

  const filtered = displayBids.filter(b =>
    !localSearch ||
    b.title.toLowerCase().includes(localSearch.toLowerCase()) ||
    b.agency.toLowerCase().includes(localSearch.toLowerCase())
  )

  const CATEGORIES = ['All', 'Landscaping', 'Construction', 'Transportation', 'Accessibility', 'Environmental']

  return (
    <Layout title="Browse Bids" subtitle={`${filtered.length} bids available`}>
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-5">
        {[
          { id: 'all', label: 'All Bids', count: bids.length },
          { id: 'recommended', label: 'Recommended', count: recommendedBids.length, highlight: true },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={clsx('flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all',
              activeTab === tab.id ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            {tab.label}
            {tab.highlight && interestedCategories.length > 0 ? (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            ) : null}
            <span className={clsx('text-xs', activeTab === tab.id ? 'text-gray-400' : 'text-gray-400')}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Recommended notice */}
      {activeTab === 'recommended' && interestedCategories.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-lg">✨</span>
          <p className="text-sm text-primary-dark">
            Showing bids matching your interests:{' '}
            <span className="font-semibold">{interestedCategories.join(', ')}</span>
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input value={localSearch} onChange={e => setLocalSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search bids..." />
        </div>
        {activeTab !== 'recommended' && (
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)}
                className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  filterCategory === cat
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                {cat !== 'All' && CATEGORY_ICONS[cat] ? `${CATEGORY_ICONS[cat]} ` : ''}{cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* All / Recommended grid */}
      {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-dark">No bids found</p>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === 'recommended'
                  ? 'Update your category interests in Profile to see recommendations'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(bid => (
                <BidCard key={bid.id} bid={bid}
                  appStatus={applications[bid.id]?.status}
                  isBookmarked={bookmarkedIds.includes(bid.id)}
                  onToggleBookmark={toggleBookmark} />
              ))}
            </div>
      )}
    </Layout>
  )
}
