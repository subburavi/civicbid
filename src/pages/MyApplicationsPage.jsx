import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useApplications } from '../context/ApplicationContext'
import { useBids } from '../context/BidContext'
import { differenceInDays, parseISO } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  draft: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  applied: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Not Selected', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  completed: { label: 'Ready', color: 'bg-purple-50 text-purple-700 border-purple-200' },
}

const STATUS_FILTERS = ['All', 'In Progress', 'Submitted', 'Approved', 'Not Selected']

function getUrgency(deadline) {
  if (!deadline) return null
  const days = differenceInDays(parseISO(deadline), new Date())
  if (days <= 3) return { label: `${days}d left`, color: 'text-red-600 bg-red-50', dot: 'bg-red-500' }
  if (days <= 7) return { label: `${days}d left`, color: 'text-orange-600 bg-orange-50', dot: 'bg-orange-500' }
  if (days <= 14) return { label: `${days}d left`, color: 'text-yellow-700 bg-yellow-50', dot: 'bg-yellow-500' }
  return { label: `${days}d left`, color: 'text-gray-500 bg-gray-50', dot: 'bg-gray-300' }
}

export default function MyApplicationsPage() {
  const { applications, getBidProgress } = useApplications()
  const { bids } = useBids()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const rows = Object.entries(applications).map(([bidId, app]) => {
    const bid = bids.find(b => b.id === bidId)
    return { bidId, app, bid }
  }).filter(({ bid }) => bid)

  const filtered = rows.filter(({ app, bid }) => {
    const statusLabel = STATUS_CONFIG[app.status]?.label || ''
    const matchFilter = activeFilter === 'All' || statusLabel === activeFilter
    const matchSearch = !searchQuery || bid?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid?.agency.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFilter && matchSearch
  })

  const statusCounts = Object.values(applications).reduce((acc, app) => {
    const label = STATUS_CONFIG[app.status]?.label || 'Other'
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  return (
    <Layout title="My Applications" subtitle={`${rows.length} bid application${rows.length !== 1 ? 's' : ''}`}>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: rows.length, color: 'text-dark' },
          { label: 'In Progress', value: statusCounts['In Progress'] || 0, color: 'text-amber-600' },
          { label: 'Submitted', value: statusCounts['Submitted'] || 0, color: 'text-blue-600' },
          { label: 'Approved', value: statusCounts['Approved'] || 0, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search applications..." />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeFilter === f ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
              {f}
              {f !== 'All' && statusCounts[f] ? (
                <span className="ml-1 text-gray-400">({statusCounts[f]})</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="font-semibold text-dark">No applications found</p>
          <p className="text-sm text-gray-500 mt-1">Start by browsing available bids</p>
          <button onClick={() => navigate('/bids')} className="btn-primary mt-4 text-sm">Browse Bids</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Bid</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Progress</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Deadline</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Budget</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ bidId, app, bid }) => {
                const progress = getBidProgress(bidId)
                const urgency = getUrgency(bid?.deadline)
                const statusCfg = STATUS_CONFIG[app.status]
                const isDraft = app.status === 'draft' || app.status === 'completed'

                return (
                  <tr key={bidId}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                    onClick={() => navigate(`/applications/${bidId}`)}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-dark text-sm leading-tight">{bid?.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{bid?.agency}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold border', statusCfg?.color)}>
                        {statusCfg?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full transition-all',
                              progress === 100 ? 'bg-green-500' : progress > 50 ? 'bg-primary' : 'bg-amber-400')}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-8">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {bid?.deadline && urgency ? (
                        <div className={clsx('inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold', urgency.color)}>
                          <span className={clsx('w-1.5 h-1.5 rounded-full', urgency.dot)} />
                          {urgency.label}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-dark">{bid?.budget}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/applications/${bidId}`) }}
                        className={clsx('text-xs font-semibold px-3 py-1.5 rounded-lg transition-all',
                          isDraft
                            ? 'bg-primary text-dark hover:bg-primary/80'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                        {isDraft ? 'Continue' : 'View'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
