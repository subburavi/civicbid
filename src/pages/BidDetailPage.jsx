import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useBids } from '../context/BidContext'
import { useApplications } from '../context/ApplicationContext'
import { PDFViewer } from '../components/bid/PDFViewer'
import { AIAssistant } from '../components/bid/AIAssistant'
import { Badge } from '../components/ui/Badge'
import { Layout } from '../components/layout/Layout'
import { Sidebar } from '../components/layout/Sidebar'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import clsx from 'clsx'

const STATUS_VARIANT = { open: 'open', urgent: 'urgent', closed: 'closed', awarded: 'awarded' }

function ApplyMode({ bid, initialDocId, onBack }) {
  const { startApplication } = useApplications()
  const documents = bid.documents || []
  const [activeDocId, setActiveDocId] = useState(initialDocId || documents[0]?.id || 'doc1')
  const [fieldOverlays, setFieldOverlays] = useState({})

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0]

  useEffect(() => {
    startApplication(bid.id)
  }, [bid.id])

  function handleFieldAnswered(index, fieldId, rawValue, displayValue, fieldType) {
    setFieldOverlays(prev => {
      const docOverlays = [...(prev[activeDocId] || [])]
      docOverlays[index] = { displayValue: rawValue, fieldType }
      return { ...prev, [activeDocId]: docOverlays }
    })
  }

  const currentOverlays = fieldOverlays[activeDocId] || []
  const filledCount = currentOverlays.filter(Boolean).length

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur border-b border-gray-100 px-4 h-12 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-dark transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Overview
            </button>
            <div className="w-px h-4 bg-gray-200 flex-shrink-0"/>
            <p className="text-sm font-semibold text-dark truncate">{bid.title}</p>
            <Badge variant={STATUS_VARIANT[bid.status] || 'gray'} className="flex-shrink-0">{bid.status}</Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-[11px] text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"/>
            AI filling in real time
          </div>
        </header>

        {/* Document tabs */}
        {documents.length > 1 && (
          <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-1 h-9 flex-shrink-0">
            {documents.map(doc => (
              <button key={doc.id} onClick={() => setActiveDocId(doc.id)}
                className={clsx('px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  activeDocId === doc.id ? 'bg-dark text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')}>
                {doc.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT 65% — PDF viewer */}
          <div className="flex flex-col overflow-hidden border-r border-gray-200" style={{ width: '65%' }}>
            <div className="px-3 py-2 border-b border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 5h6M5 8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-semibold text-dark truncate flex-1">{activeDoc?.name}</span>
              {filledCount > 0 && (
                <span className="text-[10px] font-bold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  ✓ {filledCount} auto-filled
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer pdfUrl={activeDoc?.file} fieldOverlays={currentOverlays} />
            </div>
          </div>

          {/* RIGHT 35% — AI Assistant */}
          <div className="flex flex-col overflow-hidden bg-white" style={{ width: '35%' }}>
            <AIAssistant
              key={`${bid.id}-${activeDocId}`}
              bid={bid}
              bidId={bid.id}
              docId={activeDocId}
              onFieldAnswered={handleFieldAnswered}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BidDetailPage() {
  const { id } = useParams()
  const { bids, bookmarkedIds, toggleBookmark } = useBids()
  const { applications } = useApplications()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()

  const initialApplyMode = location.state?.applyMode || false
  const initialDocId = location.state?.docId || null

  const [applyMode, setApplyMode] = useState(initialApplyMode)
  const [pdfModal, setPdfModal] = useState(false)
  const [previewDocId, setPreviewDocId] = useState(null)

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

  if (applyMode) return <ApplyMode bid={bid} initialDocId={initialDocId} onBack={() => setApplyMode(false)} />

  const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null
  const isUrgent = daysLeft !== null && daysLeft <= 10
  const isBookmarked = bookmarkedIds?.includes(bid.id)
  const app = applications[bid.id]

  const previewDoc = bid.documents?.find(d => d.id === previewDocId) || bid.documents?.[0]

  return (
    <Layout title={bid.title} subtitle={bid.agency}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-dark mb-4 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to bids
        </button>

        {/* Header */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant={STATUS_VARIANT[bid.status]}>{bid.status}</Badge>
                {bid.featured && <Badge variant="yellow">⭐ Featured</Badge>}
                {app && (
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Applied
                  </span>
                )}
                {daysLeft !== null && (
                  <span className={`text-xs font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                    {daysLeft <= 0 ? 'Deadline passed' : `${daysLeft} days remaining`}
                  </span>
                )}
              </div>
              <h1 className="font-heading font-bold text-dark text-xl leading-tight mb-1">{bid.title}</h1>
              <p className="text-sm text-gray-500">{bid.agency} · {bid.department}</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={() => setApplyMode(true)} className="btn-primary py-2.5 px-5 text-sm whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {app?.status === 'draft' ? 'Continue Filling' : 'Apply Now'}
              </button>
              <button onClick={() => toggleBookmark(bid.id)}
                className={clsx('btn-secondary py-2 text-xs justify-center',
                  isBookmarked ? 'text-primary-dark bg-primary/10 border-primary/20' : '')}>
                {isBookmarked ? '🔖 Bookmarked' : '+ Bookmark'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
            {[
              { label: 'Deadline', value: bid.deadline ? format(parseISO(bid.deadline), 'MMM d, yyyy') : 'TBD' },
              { label: 'Budget', value: bid.budget || 'TBD' },
              { label: 'Category', value: bid.category },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-sm font-bold text-dark">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{bid.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Requirements */}
          <div className="glass-card p-5">
            <h3 className="font-heading font-semibold text-dark text-sm mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center text-xs">📋</span>
              Requirements
            </h3>
            <ul className="space-y-2">
              {bid.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Buyer + Documents */}
          <div className="glass-card p-5">
            <h3 className="font-heading font-semibold text-dark text-sm mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center text-xs">👤</span>
              Buyer Contact
            </h3>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary-dark text-xs">
                {bid.buyer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-semibold text-dark">{bid.buyer.name}</p>
                <p className="text-[10px] text-gray-400">{bid.buyer.title}</p>
              </div>
            </div>
            <a href={`mailto:${bid.buyer.email}`} className="flex items-center gap-1.5 text-xs text-primary-dark hover:underline mb-1.5">
              📧 {bid.buyer.email}
            </a>
            <p className="text-xs text-gray-500 mb-4">📞 {bid.buyer.phone}</p>

            {/* Documents list */}
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Bid Documents</h4>
            <div className="space-y-2">
              {bid.documents?.map(doc => (
                <div key={doc.id} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-sm flex-shrink-0">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-dark truncate">{doc.label}</p>
                    <p className="text-[10px] text-gray-400 truncate">{doc.name}</p>
                  </div>
                  <button
                    onClick={() => { setPreviewDocId(doc.id); setPdfModal(true) }}
                    className="text-xs font-bold text-primary-dark hover:underline flex-shrink-0">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {bid.tags.map(t => <span key={t} className="badge bg-gray-100 text-gray-500 text-xs">{t}</span>)}
        </div>

        <div className="glass-card p-5 flex items-center justify-between gap-4 border border-primary/20 bg-primary/5">
          <div>
            <p className="font-heading font-bold text-dark">Ready to apply?</p>
            <p className="text-xs text-gray-500 mt-0.5">Our AI guides you through every field — answers auto-fill the PDF live.</p>
          </div>
          <button onClick={() => setApplyMode(true)} className="btn-primary py-2.5 px-6 text-sm flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {app?.status === 'draft' ? 'Continue Filling' : 'Apply Now'}
          </button>
        </div>
      </div>

      {pdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPdfModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <div className="relative bg-white rounded-2xl shadow-float w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                {bid.documents?.map(doc => (
                  <button key={doc.id} onClick={() => setPreviewDocId(doc.id)}
                    className={clsx('px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                      previewDocId === doc.id ? 'bg-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                    {doc.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setPdfModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">✕</button>
            </div>
            <div className="flex-1 min-h-0">
              <PDFViewer pdfUrl={previewDoc?.file} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
