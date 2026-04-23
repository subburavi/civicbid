import { useParams, useNavigate } from 'react-router-dom'
import { useApplications } from '../context/ApplicationContext'
import { useBids } from '../context/BidContext'
import { Sidebar } from '../components/layout/Sidebar'
import { format, parseISO, differenceInDays } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  draft:     { label: 'In Progress',      color: 'bg-amber-50 text-amber-700 border-amber-200' },
  applied:   { label: 'Submitted',        color: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved:  { label: 'Approved',         color: 'bg-green-50 text-green-700 border-green-200' },
  rejected:  { label: 'Not Selected',     color: 'bg-gray-50 text-gray-500 border-gray-200' },
  completed: { label: 'Ready to Submit',  color: 'bg-purple-50 text-purple-700 border-purple-200' },
}

const ACTIVITY_ICONS = {
  start: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5 8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  ai_fill: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.2 3.2l2.1 2.1M10.7 10.7l2.1 2.1M3.2 12.8l2.1-2.1M10.7 5.3l2.1-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  proposal: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M4 2h5.5L13 5.5V14H4V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M6 8h4M6 10.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  edit: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M10 3l3 3-7 7H3v-3L10 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rewrite: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M2.5 8A5.5 5.5 0 0113.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11.5 6l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 12l-2-2 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  export: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  submit: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <path d="M2 8l5 5L14 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  status: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const ACTIVITY_COLORS = {
  start:    'bg-gray-50 text-gray-500 border-gray-200',
  ai_fill:  'bg-amber-50 text-amber-600 border-amber-200',
  proposal: 'bg-primary/10 text-primary-dark border-primary/25',
  edit:     'bg-blue-50 text-blue-600 border-blue-200',
  rewrite:  'bg-violet-50 text-violet-600 border-violet-200',
  export:   'bg-teal-50 text-teal-600 border-teal-200',
  submit:   'bg-green-50 text-green-600 border-green-200',
  status:   'bg-green-50 text-green-700 border-green-200',
}

function fmtK(n) {
  if (!n) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

function fmtDate(iso) {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'MMM d, h:mm a') } catch { return iso }
}

export default function ApplicationDetailPage() {
  const { bidId } = useParams()
  const navigate = useNavigate()
  const { applications, getDocProgress } = useApplications()
  const { bids } = useBids()

  const app = applications[bidId]
  const bid = bids.find(b => b.id === bidId)

  if (!bid || !app) {
    return (
      <div className="flex h-screen bg-surface">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-semibold text-dark text-lg mb-2">Application not found</p>
            <button onClick={() => navigate('/applications')} className="btn-primary text-sm">Back to Applications</button>
          </div>
        </div>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[app.status]
  const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null
  const activity = app.activity || []
  const totalTokens = activity.reduce((s, a) => s + (a.tokens || 0), 0)

  const totalAnswered = Object.values(app.documents || {}).reduce((s, d) => s + (d.answeredCount || 0), 0)
  const totalFields   = Object.values(app.documents || {}).reduce((s, d) => s + (d.totalFields || 0), 0)
  const overallPct    = totalFields ? Math.round((totalAnswered / totalFields) * 100) : 0

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Header ── */}
        <header className="bg-white border-b border-gray-100 px-6 h-14 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => navigate('/applications')}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-dark transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Applications
          </button>

          <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            <h1 className="font-semibold text-dark text-sm truncate">{bid.title}</h1>
            <span className={clsx('px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0', statusCfg?.color)}>
              {statusCfg?.label}
            </span>
            {daysLeft !== null && daysLeft >= 0 && (
              <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0',
                daysLeft <= 3 ? 'bg-red-50 text-red-600' :
                daysLeft <= 7 ? 'bg-orange-50 text-orange-600' :
                'bg-gray-50 text-gray-500')}>
                {daysLeft}d left
              </span>
            )}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate(`/bids/${bidId}`)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              View Bid
            </button>
            {app.proposalGenerated ? (
              <button
                onClick={() => navigate(`/proposals/${bidId}`)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                  <path d="M4 2h5.5L13 5.5V14H4V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
                View Proposal
              </button>
            ) : (
              <button
                onClick={() => navigate(`/proposals/${bidId}`)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                  <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
                Generate Proposal
              </button>
            )}
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-5 p-6 items-start">

            {/* ── LEFT: Bid details + buyer ── */}
            <div className="col-span-3 space-y-4">

              {/* Bid details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-dark text-sm mb-3">Bid Details</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Agency',     value: bid.agency },
                    { label: 'Department', value: bid.department },
                    { label: 'Category',   value: bid.category },
                    { label: 'Budget',     value: bid.budget },
                    { label: 'Deadline',   value: bid.deadline ? format(parseISO(bid.deadline), 'MMM d, yyyy') : '—' },
                    { label: 'Posted',     value: bid.postedDate ? format(parseISO(bid.postedDate), 'MMM d, yyyy') : '—' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-start gap-2">
                      <span className="text-xs text-gray-400 flex-shrink-0">{row.label}</span>
                      <span className="text-xs font-semibold text-dark text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form completion */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark text-sm">Form Completion</h3>
                  <span className="text-xs font-bold text-dark">{overallPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={clsx('h-full rounded-full transition-all',
                      overallPct === 100 ? 'bg-green-500' : overallPct > 50 ? 'bg-primary' : 'bg-amber-400')}
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{totalAnswered} of {totalFields} fields filled</p>
              </div>

              {/* Buyer contact */}
              {bid.buyer && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-dark text-sm mb-3">Buyer Contact</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      {bid.buyer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark leading-tight">{bid.buyer.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{bid.buyer.title}</p>
                      <a href={`mailto:${bid.buyer.email}`} className="text-xs text-primary-dark hover:underline mt-1.5 block truncate">
                        {bid.buyer.email}
                      </a>
                      {bid.buyer.phone && (
                        <p className="text-xs text-gray-400 mt-0.5">{bid.buyer.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── CENTER: Activity timeline ── */}
            <div className="col-span-5">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                {/* Timeline header with token total */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-dark text-sm">Activity Log</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.length} actions recorded</p>
                  </div>
                  {totalTokens > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                      <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 16 16">
                        <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.2 3.2l2.1 2.1M10.7 10.7l2.1 2.1M3.2 12.8l2.1-2.1M10.7 5.3l2.1-2.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                      <span className="text-xs font-bold text-amber-700">{fmtK(totalTokens)} tokens used</span>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="p-5">
                  {activity.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No activity recorded yet.</p>
                  ) : (
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100" />

                      <div className="space-y-0">
                        {activity.map((item, idx) => {
                          const iconColor = ACTIVITY_COLORS[item.type] || ACTIVITY_COLORS.start
                          const icon = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.start
                          const isLast = idx === activity.length - 1

                          return (
                            <div key={item.id} className="flex gap-4 relative">
                              {/* Icon dot */}
                              <div className={clsx(
                                'w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 relative z-10 bg-white mt-1',
                                iconColor
                              )}>
                                {icon}
                              </div>

                              {/* Content */}
                              <div className={clsx('flex-1 min-w-0 py-1', !isLast && 'pb-5')}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-dark leading-tight">{item.label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.detail}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{fmtDate(item.at)}</span>
                                    {item.tokens > 0 && (
                                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                        {fmtK(item.tokens)} tok
                                      </span>
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
                </div>
              </div>
            </div>

            {/* ── RIGHT: Proposal + Documents ── */}
            <div className="col-span-4 space-y-4">

              {/* Proposal card */}
              <div className={clsx('rounded-2xl border p-5',
                app.proposalGenerated
                  ? 'bg-white border-gray-100'
                  : 'bg-white border-dashed border-gray-200')}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    app.proposalGenerated ? 'bg-primary/10' : 'bg-gray-50')}>
                    <svg className={clsx('w-5 h-5', app.proposalGenerated ? 'text-primary-dark' : 'text-gray-400')}
                      fill="none" viewBox="0 0 20 20">
                      <path d="M5 2h8.5L17 5.5V18H5V2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                      <path d="M13 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                      <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">
                      {app.proposalGenerated ? 'Proposal Ready' : 'No Proposal Yet'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {app.proposalGenerated
                        ? 'Generated with Aria · Available to export'
                        : 'Generate a proposal using Aria AI'}
                    </p>
                  </div>
                </div>

                {app.proposalGenerated ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/proposals/${bidId}`)}
                      className="btn-primary w-full justify-center text-xs py-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                        <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View & Edit Proposal
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="btn-secondary text-xs py-1.5 justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                          <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Export PDF
                      </button>
                      <button className="btn-secondary text-xs py-1.5 justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                          <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Export Word
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/proposals/${bidId}`)}
                    className="btn-primary w-full justify-center text-xs py-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                      <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                    Generate with Aria
                  </button>
                )}
              </div>

              {/* Documents */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-dark text-sm">Bid Documents</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{bid.documents?.length || 0} documents · {overallPct}% complete</p>
                </div>

                <div className="divide-y divide-gray-50">
                  {bid.documents?.map(doc => {
                    const pct = getDocProgress(bidId, doc.id)
                    const docData = app.documents?.[doc.id]

                    return (
                      <div key={doc.id} className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            pct === 100 ? 'bg-green-50' : pct > 0 ? 'bg-amber-50' : 'bg-gray-50')}>
                            <svg className={clsx('w-4 h-4',
                              pct === 100 ? 'text-green-600' : pct > 0 ? 'text-amber-600' : 'text-gray-400')}
                              fill="none" viewBox="0 0 16 16">
                              <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                              <path d="M10 2v3.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                              <path d="M5 8h6M5 10.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold text-dark truncate">{doc.label}</p>
                              {doc.required && (
                                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded flex-shrink-0">REQ</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={clsx('h-full rounded-full',
                                    pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-primary' : 'bg-gray-200')}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-gray-400 flex-shrink-0 w-14 text-right">
                                {docData?.answeredCount || 0}/{docData?.totalFields || '?'} fields
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Timeline key dates */}
              {(app.startedAt || app.submittedAt) && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-dark text-sm mb-3">Key Dates</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Started',   date: app.startedAt },
                      { label: 'Submitted', date: app.submittedAt },
                      { label: 'Updated',   date: app.lastUpdated },
                    ].filter(d => d.date).map(d => (
                      <div key={d.label} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-400">{d.label}</span>
                        <span className="text-xs font-semibold text-dark">
                          {format(new Date(d.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
