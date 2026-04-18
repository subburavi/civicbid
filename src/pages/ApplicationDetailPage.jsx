import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useApplications } from '../context/ApplicationContext'
import { useBids } from '../context/BidContext'
import { differenceInDays, parseISO, format } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  draft: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  applied: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Not Selected', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  completed: { label: 'Ready to Submit', color: 'bg-purple-50 text-purple-700 border-purple-200' },
}

export default function ApplicationDetailPage() {
  const { bidId } = useParams()
  const navigate = useNavigate()
  const { applications, getDocProgress, getDocAnswers } = useApplications()
  const { bids } = useBids()
  const [expandedDoc, setExpandedDoc] = useState(null)

  const app = applications[bidId]
  const bid = bids.find(b => b.id === bidId)

  if (!bid || !app) {
    return (
      <Layout title="Application Not Found">
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-semibold text-dark text-lg">Application not found</p>
          <button onClick={() => navigate('/applications')} className="btn-primary mt-4 text-sm">Back to Applications</button>
        </div>
      </Layout>
    )
  }

  const daysLeft = bid.deadline ? differenceInDays(parseISO(bid.deadline), new Date()) : null
  const statusCfg = STATUS_CONFIG[app.status]
  const isDraft = app.status === 'draft' || app.status === 'completed'

  const totalAnswered = Object.values(app.documents || {}).reduce((s, d) => s + (d.answeredCount || 0), 0)
  const totalFields = Object.values(app.documents || {}).reduce((s, d) => s + (d.totalFields || 0), 0)
  const overallPct = totalFields ? Math.round((totalAnswered / totalFields) * 100) : 0

  return (
    <Layout
      title={bid.title}
      subtitle={bid.agency}
    >
      {/* Back */}
      <button onClick={() => navigate('/applications')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark mb-5 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
          <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        My Applications
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Bid info + docs */}
        <div className="col-span-1 space-y-4">
          {/* Status card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold border', statusCfg?.color)}>
                {statusCfg?.label}
              </span>
              {daysLeft !== null && (
                <span className={clsx('text-xs font-semibold px-2 py-1 rounded-lg',
                  daysLeft <= 3 ? 'bg-red-50 text-red-600' :
                  daysLeft <= 7 ? 'bg-orange-50 text-orange-600' :
                  'bg-gray-50 text-gray-500')}>
                  {daysLeft}d left
                </span>
              )}
            </div>

            {/* Overall progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-gray-600">Overall completion</span>
                <span className="text-xs font-bold text-dark">{overallPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all',
                    overallPct === 100 ? 'bg-green-500' : overallPct > 50 ? 'bg-primary' : 'bg-amber-400')}
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{totalAnswered} of {totalFields} fields filled</p>
            </div>

            {isDraft && (
              <button
                onClick={() => navigate(`/bids/${bidId}`, { state: { applyMode: true } })}
                className="btn-primary w-full justify-center text-sm py-2">
                Continue Filling
                <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                  <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Bid details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-dark text-sm">Bid Details</h3>
            {[
              { label: 'Agency', value: bid.agency },
              { label: 'Department', value: bid.department },
              { label: 'Category', value: bid.category },
              { label: 'Budget', value: bid.budget },
              { label: 'Deadline', value: bid.deadline ? format(parseISO(bid.deadline), 'MMM d, yyyy') : '—' },
              { label: 'Posted', value: bid.postedDate ? format(parseISO(bid.postedDate), 'MMM d, yyyy') : '—' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-400 flex-shrink-0">{row.label}</span>
                <span className="text-xs font-semibold text-dark text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Buyer contact */}
          {bid.buyer && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-dark text-sm mb-3">Buyer Contact</h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {bid.buyer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark">{bid.buyer.name}</p>
                  <p className="text-xs text-gray-400">{bid.buyer.title}</p>
                  <a href={`mailto:${bid.buyer.email}`} className="text-xs text-primary-dark hover:underline mt-1 block">
                    {bid.buyer.email}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Documents */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-dark">Bid Documents</h3>
              <p className="text-xs text-gray-400 mt-0.5">Click a document to review or fill out</p>
            </div>

            <div className="divide-y divide-gray-50">
              {bid.documents?.map((doc, idx) => {
                const docPct = getDocProgress(bidId, doc.id)
                const answers = getDocAnswers(bidId, doc.id)
                const answerCount = Object.keys(answers).length
                const docData = app.documents?.[doc.id]
                const isExpanded = expandedDoc === doc.id

                return (
                  <div key={doc.id}>
                    <div
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 cursor-pointer transition-colors"
                      onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}>
                      {/* Doc icon */}
                      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        docPct === 100 ? 'bg-green-50' : docPct > 0 ? 'bg-amber-50' : 'bg-gray-50')}>
                        <svg className={clsx('w-5 h-5',
                          docPct === 100 ? 'text-green-600' : docPct > 0 ? 'text-amber-600' : 'text-gray-400')}
                          fill="none" viewBox="0 0 20 20">
                          <path d="M5 2h7l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6"/>
                          <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                          <path d="M7 9h6M7 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-dark truncate">{doc.label}</p>
                          {doc.required && (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0">Required</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{doc.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={clsx('h-full rounded-full',
                                docPct === 100 ? 'bg-green-500' : docPct > 0 ? 'bg-primary' : 'bg-gray-200')}
                              style={{ width: `${docPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                            {answerCount}/{docData?.totalFields || '?'} fields
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={clsx('text-xs font-bold',
                          docPct === 100 ? 'text-green-600' : docPct > 0 ? 'text-amber-600' : 'text-gray-400')}>
                          {docPct}%
                        </span>
                        <svg className={clsx('w-4 h-4 text-gray-400 transition-transform', isExpanded ? 'rotate-180' : '')}
                          fill="none" viewBox="0 0 20 20">
                          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-4 bg-gray-50/40">
                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() => navigate(`/bids/${bidId}`, { state: { applyMode: true, docId: doc.id } })}
                            className="btn-primary text-xs py-1.5">
                            {docPct > 0 ? 'Continue Filling' : 'Start Filling'}
                          </button>
                          <a href={doc.file} target="_blank" rel="noreferrer"
                            className="btn-secondary text-xs py-1.5">
                            View PDF
                          </a>
                        </div>

                        {answerCount > 0 && (
                          <div className="mt-3 space-y-1.5">
                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Saved answers</p>
                            {Object.entries(answers).slice(0, 4).map(([k, v]) => (
                              <div key={k} className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400 font-mono">{k}</span>
                                <span className="text-gray-600 truncate max-w-[200px]">
                                  {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                                </span>
                              </div>
                            ))}
                            {answerCount > 4 && (
                              <p className="text-xs text-gray-400">+{answerCount - 4} more answers saved</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Application timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-dark mb-4">Timeline</h3>
            <div className="space-y-3">
              {[
                { label: 'Application started', date: app.startedAt, show: true },
                { label: 'Last updated', date: app.lastUpdated, show: true },
                { label: 'Submitted', date: app.submittedAt, show: !!app.submittedAt },
              ].filter(t => t.show).map(t => (
                <div key={t.label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-xs text-gray-500 flex-1">{t.label}</span>
                  <span className="text-xs font-semibold text-dark">
                    {t.date ? format(new Date(t.date), 'MMM d, yyyy h:mm a') : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
