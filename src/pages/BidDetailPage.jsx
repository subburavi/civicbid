import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useBids } from '../context/BidContext'
import { PDFViewer } from '../components/bid/PDFViewer'
import { Badge } from '../components/ui/Badge'
import { Layout } from '../components/layout/Layout'
import { Sidebar } from '../components/layout/Sidebar'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useState } from 'react'
import clsx from 'clsx'

const STATUS_VARIANT = { open: 'open', urgent: 'urgent', closed: 'closed', awarded: 'awarded' }

// ── Full-page PDF viewer ───────────────────────────────────────────────────────
function PDFPage({ bid, docId, onBack }) {
  const documents = bid.documents || []
  const [activeDocId, setActiveDocId] = useState(docId || documents[0]?.id)
  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0]

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-5 h-12 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-dark transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Overview
          </button>
          <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

          {/* Doc tabs */}
          <div className="flex items-center gap-1">
            {documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  activeDocId === doc.id ? 'bg-dark text-white' : 'text-gray-500 hover:text-dark hover:bg-gray-100'
                )}
              >
                <svg width="9" height="10" fill="none" viewBox="0 0 10 12">
                  <rect x="0.5" y="0.5" width="9" height="11" rx="1"
                    stroke={activeDocId === doc.id ? 'rgba(255,255,255,0.5)' : '#EF4444'} strokeWidth="1"/>
                  <path d="M2.5 4h5M2.5 6.5h3"
                    stroke={activeDocId === doc.id ? 'rgba(255,255,255,0.5)' : '#EF4444'} strokeWidth="1" strokeLinecap="round"/>
                </svg>
                {doc.label}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[11px] text-gray-400 truncate max-w-xs">{activeDoc?.name}</div>
        </header>

        {/* Full-height PDF viewer */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <PDFViewer pdfUrl={activeDoc?.file} />
        </div>
      </div>
    </div>
  )
}

// ── Bid overview ───────────────────────────────────────────────────────────────
function OverviewPage({ bid, onViewPdf }) {
  const navigate = useNavigate()
  const { bookmarkedIds, toggleBookmark } = useBids()

  const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null
  const isUrgent = daysLeft !== null && daysLeft <= 10
  const isBookmarked = bookmarkedIds?.includes(bid.id)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-5 h-12 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/bids')}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-dark transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Bids
          </button>
          <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
          <p className="text-sm font-bold text-dark truncate flex-1">{bid.title}</p>
          <Badge variant={STATUS_VARIANT[bid.status]}>{bid.status}</Badge>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => toggleBookmark(bid.id)}
              className={clsx('h-8 w-8 flex items-center justify-center rounded-lg border transition-all',
                isBookmarked ? 'bg-primary/10 border-primary/20 text-primary-dark' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600')}
            >
              <svg width="13" height="13" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 16 16">
                <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link to={`/proposals/${bid.id}`} className="btn-primary h-8 px-4 text-xs items-center">
              <svg width="13" height="13" fill="none" viewBox="0 0 16 16">
                <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4.2 4.2l2.1 2.1M9.7 9.7l2.1 2.1M4.2 11.8l2.1-2.1M9.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Generate Proposal
            </Link>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-7 space-y-7">

            {/* Hero */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {bid.featured && <Badge variant="yellow">⭐ Featured</Badge>}
              </div>
              <h1 className="font-heading font-bold text-dark text-2xl leading-tight mb-1">{bid.title}</h1>
              <p className="text-sm text-gray-400">{bid.agency} &middot; {bid.department}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: 'Deadline',
                  value: bid.deadline ? format(parseISO(bid.deadline), 'MMM d, yyyy') : 'TBD',
                  sub: daysLeft !== null ? (daysLeft <= 0 ? 'Passed' : `${daysLeft} days left`) : null,
                  accent: isUrgent,
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 18 18">
                      <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M6 1v3M12 1v3M2 7h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  label: 'Budget',
                  value: bid.budget || 'TBD',
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 18 18">
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M9 5.5v7M6.5 7.5h3a1.5 1.5 0 010 3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  label: 'Category',
                  value: bid.category,
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 18 18">
                      <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  ),
                },
                {
                  label: 'Posted',
                  value: bid.postedDate ? format(parseISO(bid.postedDate), 'MMM d, yyyy') : 'N/A',
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 18 18">
                      <path d="M9 2v4M9 12v4M2 9h4M12 9h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  ),
                },
              ].map(stat => (
                <div key={stat.label} className={`rounded-xl border p-4 ${stat.accent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                  <div className={`mb-2 ${stat.accent ? 'text-red-400' : 'text-gray-400'}`}>{stat.icon}</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
                  <p className={`text-sm font-bold ${stat.accent ? 'text-red-600' : 'text-dark'}`}>{stat.value}</p>
                  {stat.sub && <p className={`text-[10px] mt-0.5 font-semibold ${stat.accent ? 'text-red-400' : 'text-gray-400'}`}>{stat.sub}</p>}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-xs font-bold text-dark uppercase tracking-widest mb-3">About This Bid</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{bid.description}</p>
              {bid.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {bid.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements + Buyer */}
            <div className="grid grid-cols-2 gap-4">
              {/* Requirements */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-xs font-bold text-dark uppercase tracking-widest mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {bid.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-primary/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="9" height="9" fill="none" viewBox="0 0 10 10">
                          <path d="M2 5l2.5 2.5L8 2" stroke="#D4A000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buyer contact */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-xs font-bold text-dark uppercase tracking-widest mb-4">Buyer Contact</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center font-bold text-primary-dark text-sm flex-shrink-0">
                    {bid.buyer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark">{bid.buyer.name}</p>
                    <p className="text-xs text-gray-400">{bid.buyer.title}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <a href={`mailto:${bid.buyer.email}`} className="flex items-center gap-2 text-sm text-primary-dark hover:underline">
                    <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    {bid.buyer.email}
                  </a>
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                      <path d="M2.5 4C2.5 3.17 3.17 2.5 4 2.5h1.5l1.2 2.9-.95.95a8 8 0 004.85 4.85l.95-.95 2.9 1.2v1.5c0 .83-.67 1.5-1.5 1.5A11.5 11.5 0 012.5 4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                    {bid.buyer.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            {bid.documents?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-xs font-bold text-dark uppercase tracking-widest mb-4">Bid Documents</h2>
                <div className="space-y-2">
                  {bid.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" fill="none" viewBox="0 0 18 22">
                          <rect x="1" y="1" width="16" height="20" rx="2" stroke="#EF4444" strokeWidth="1.4"/>
                          <path d="M4 7h10M4 11h7M4 15h5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark">{doc.label}</p>
                        <p className="text-xs text-gray-400 truncate">{doc.name}</p>
                      </div>
                      {doc.required && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full flex-shrink-0">Required</span>
                      )}
                      <button
                        onClick={() => onViewPdf(doc.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:border-dark hover:text-dark transition-all flex-shrink-0 group-hover:border-gray-300"
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 14 14">
                          <path d="M7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M5 7a2 2 0 104 0 2 2 0 00-4 0z" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        View PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Proposal CTA */}
            <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6.5" stroke="#D4A000" strokeWidth="1.4"/>
                      <path d="M5.5 8.5c.8 1 4.5 1 4.5-1.5C10 5 8 4.5 8 6.5c0 1.5 1 2 1 3.5" stroke="#D4A000" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-0.5">Generate a Proposal with Aria</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Aria reads the bid documents and writes a complete, tailored proposal — cover page, scope, team, timeline, and pricing.
                    </p>
                    {bid.documents?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {bid.documents.map(doc => (
                          <span key={doc.id} className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-0.5 text-xs text-gray-500 font-medium">
                            <svg width="8" height="9" fill="none" viewBox="0 0 10 12">
                              <rect x="0.5" y="0.5" width="9" height="11" rx="1" stroke="#EF4444" strokeWidth="1"/>
                              <path d="M2.5 4h5M2.5 6.5h3" stroke="#EF4444" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                            {doc.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Link to={`/proposals/${bid.id}`} className="btn-primary px-6 py-2.5 text-sm whitespace-nowrap flex-shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                    <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4.2 4.2l2.1 2.1M9.7 9.7l2.1 2.1M4.2 11.8l2.1-2.1M9.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Open Proposal Builder
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page entry ────────────────────────────────────────────────────────────────
export default function BidDetailPage() {
  const { id } = useParams()
  const { bids } = useBids()
  const navigate = useNavigate()

  const [view, setView] = useState('overview')
  const [pdfDocId, setPdfDocId] = useState(null)

  const bid = bids.find(b => b.id === id)

  if (!bid) {
    return (
      <Layout title="Bid Not Found">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-heading font-bold text-xl text-dark mb-2">Bid not found</h2>
          <button onClick={() => navigate('/bids')} className="btn-primary mt-4">Browse Bids</button>
        </div>
      </Layout>
    )
  }

  if (view === 'pdf') {
    return (
      <PDFPage
        bid={bid}
        docId={pdfDocId}
        onBack={() => setView('overview')}
      />
    )
  }

  return (
    <OverviewPage
      bid={bid}
      onViewPdf={docId => { setPdfDocId(docId); setView('pdf') }}
    />
  )
}
