import { useParams, useNavigate } from 'react-router-dom'
import { useBids } from '../context/BidContext'
import { PDFViewer } from '../components/bid/PDFViewer'
import { AIAssistant } from '../components/bid/AIAssistant'
import { Badge } from '../components/ui/Badge'
import { Layout } from '../components/layout/Layout'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'

const STATUS_VARIANT = { open: 'open', urgent: 'urgent', closed: 'closed', awarded: 'awarded' }

/* ─────────────────────────────────────────────────────────────── */
/*  APPLY MODE — sidebar stays, content = 65% PDF + 35% AI chat  */
/* ─────────────────────────────────────────────────────────────── */
function ApplyMode({ bid, onBack }) {
  // fieldOverlays[i] = { displayValue, fieldType } | null
  const [fieldOverlays, setFieldOverlays] = useState([])

  function handleFieldAnswered(index, fieldId, rawValue, displayValue, fieldType) {
    setFieldOverlays(prev => {
      const next = [...prev]
      next[index] = { displayValue: rawValue, fieldType }
      return next
    })
  }

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

        {/* Split content — fills remaining height exactly */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT 65% — PDF viewer */}
          <div className="flex flex-col overflow-hidden border-r border-gray-200" style={{ width: '65%' }}>
            {/* PDF label bar */}
            <div className="px-3 py-2 border-b border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 5h6M5 8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-semibold text-dark truncate">{bid.pdfLabel}</span>
              {fieldOverlays.filter(Boolean).length > 0 && (
                <span className="ml-auto text-[10px] font-bold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  ✓ {fieldOverlays.filter(Boolean).length} auto-filled
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer pdfUrl={bid.pdfFile} fieldOverlays={fieldOverlays} />
            </div>
          </div>

          {/* RIGHT 35% — AI Assistant */}
          <div className="flex flex-col overflow-hidden bg-white" style={{ width: '35%' }}>
            <AIAssistant bid={bid} onFieldAnswered={handleFieldAnswered} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */
/*  BID OVERVIEW                                                    */
/* ─────────────────────────────────────────────────────────────── */
export default function BidDetailPage() {
  const { id } = useParams()
  const { bids } = useBids()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [applyMode, setApplyMode] = useState(false)
  const [pdfModal, setPdfModal] = useState(false)

  const bid = bids.find(b => b.id === id)

  if (!bid) {
    return (
      <Layout title="Bid Not Found">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-heading font-bold text-xl text-dark mb-2">Bid not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">← Back</button>
        </div>
      </Layout>
    )
  }

  if (applyMode) return <ApplyMode bid={bid} onBack={() => setApplyMode(false)} />

  const daysLeft = differenceInDays(parseISO(bid.deadline), new Date())
  const isUrgent = daysLeft <= 10

  return (
    <Layout title={bid.title} subtitle={bid.agency}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
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
                <span className={`text-xs font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                  {daysLeft <= 0 ? 'Deadline passed' : `${daysLeft} days remaining`}
                </span>
              </div>
              <h1 className="font-heading font-bold text-dark text-xl leading-tight mb-1">{bid.title}</h1>
              <p className="text-sm text-gray-500">{bid.agency} · {bid.department}</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={() => setApplyMode(true)} className="btn-primary py-2.5 px-5 text-sm whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Apply Now
              </button>
              <button onClick={() => setPdfModal(true)} className="btn-secondary py-2 text-xs justify-center">📄 View PDF</button>
            </div>
          </div>

          {/* Key figures */}
          <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Deadline</p>
              <p className="text-sm font-bold text-dark">{format(parseISO(bid.deadline), 'MMM d, yyyy')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Budget</p>
              <p className="text-sm font-bold text-dark">{bid.budget || 'TBD'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Category</p>
              <p className="text-sm font-bold text-dark">{bid.category}</p>
            </div>
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

          {/* Buyer */}
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
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14"><rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              {bid.buyer.email}
            </a>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14"><path d="M2 1.5a.5.5 0 0 1 .5-.5h1.2a.5.5 0 0 1 .49.393l.6 2.4a.5.5 0 0 1-.143.485l-.7.7a6.4 6.4 0 0 0 3.075 3.075l.7-.7a.5.5 0 0 1 .485-.143l2.4.6A.5.5 0 0 1 11 8.1V9.5a.5.5 0 0 1-.5.5H9C4.858 10 1.5 6.142 1.5 2V1.5z" stroke="currentColor" strokeWidth="1.2"/></svg>
              {bid.buyer.phone}
            </div>

            {/* PDF chip */}
            <div className="mt-4 flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
              <div className="text-base flex-shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-dark truncate">{bid.pdfLabel}</p>
                <p className="text-[10px] text-gray-400">Posted {format(parseISO(bid.postedDate), 'MMM d, yyyy')}</p>
              </div>
              <button onClick={() => setApplyMode(true)} className="text-xs font-bold text-primary-dark hover:underline flex-shrink-0">Open →</button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {bid.tags.map(t => <span key={t} className="badge bg-gray-100 text-gray-500 text-xs">{t}</span>)}
        </div>

        {/* CTA banner */}
        <div className="glass-card p-5 flex items-center justify-between gap-4 border border-primary/20 bg-primary/5">
          <div>
            <p className="font-heading font-bold text-dark">Ready to apply?</p>
            <p className="text-xs text-gray-500 mt-0.5">Our AI guides you through every field — answers auto-fill the PDF live.</p>
          </div>
          <button onClick={() => setApplyMode(true)} className="btn-primary py-2.5 px-6 text-sm flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Apply Now
          </button>
        </div>
      </div>

      {/* PDF modal preview */}
      {pdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPdfModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <div className="relative bg-white rounded-2xl shadow-float w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="text-sm font-semibold text-dark">{bid.pdfLabel}</p>
              <button onClick={() => setPdfModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">✕</button>
            </div>
            <div className="flex-1 min-h-0">
              <PDFViewer pdfUrl={bid.pdfFile} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
