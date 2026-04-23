import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useApplications } from '../context/ApplicationContext'
import { useBids } from '../context/BidContext'
import { differenceInDays, parseISO, format } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  draft:     { label: 'In Progress',    color: 'bg-amber-50 text-amber-700 border-amber-200' },
  applied:   { label: 'Submitted',      color: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved:  { label: 'Approved',       color: 'bg-green-50 text-green-700 border-green-200' },
  rejected:  { label: 'Not Selected',   color: 'bg-gray-50 text-gray-600 border-gray-200' },
  completed: { label: 'Ready',          color: 'bg-purple-50 text-purple-700 border-purple-200' },
}

const STATUS_FILTERS = ['All', 'In Progress', 'Submitted', 'Approved', 'Not Selected']

const CAT_COLORS = {
  Landscaping:    'bg-green-50 text-green-700',
  Construction:   'bg-orange-50 text-orange-700',
  Transportation: 'bg-blue-50 text-blue-700',
  Accessibility:  'bg-purple-50 text-purple-700',
  Environmental:  'bg-teal-50 text-teal-700',
  Other:          'bg-gray-100 text-gray-600',
}

function getUrgency(deadline) {
  if (!deadline) return null
  const days = differenceInDays(parseISO(deadline), new Date())
  if (days < 0)   return { label: 'Closed', color: 'text-gray-500 bg-gray-50', dot: 'bg-gray-300' }
  if (days <= 3)  return { label: `${days}d left`, color: 'text-red-600 bg-red-50', dot: 'bg-red-500' }
  if (days <= 7)  return { label: `${days}d left`, color: 'text-orange-600 bg-orange-50', dot: 'bg-orange-500' }
  if (days <= 14) return { label: `${days}d left`, color: 'text-yellow-700 bg-yellow-50', dot: 'bg-yellow-500' }
  return { label: `${days}d left`, color: 'text-gray-500 bg-gray-50', dot: 'bg-gray-300' }
}

// ── Upload zone ───────────────────────────────────────────────────────────────
function UploadZone({ label, hint, accept, files, onChange, multiple = false }) {
  const ref = useState(null)[0]
  const inputRef = { current: null }

  function handleDrop(e) {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    onChange(multiple ? [...files, ...dropped] : [dropped[0]])
  }

  function handleChange(e) {
    const picked = Array.from(e.target.files)
    onChange(multiple ? [...files, ...picked] : [picked[0]])
  }

  function removeFile(i) {
    onChange(files.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <label className="label mb-1.5">{label}</label>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-xl p-4 cursor-pointer transition-colors bg-gray-50/50 hover:bg-primary/5"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
        {files.length === 0 ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20">
                <path d="M10 3v10M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark">Drop file{multiple ? 's' : ''} or click to browse</p>
              <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-primary-dark flex-shrink-0" fill="none" viewBox="0 0 16 16">
                  <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M10 2v3.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium text-dark flex-1 truncate">{f.name}</span>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                <button
                  onClick={() => removeFile(i)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
            {multiple && (
              <div
                onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                className="flex items-center gap-1.5 text-xs text-primary-dark font-semibold cursor-pointer hover:underline px-1 pt-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Add more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Create Proposal Modal ─────────────────────────────────────────────────────
function CreateProposalModal({ onClose, onGenerate }) {
  const [step,         setStep]         = useState('form')   // 'form' | 'generating'
  const [projectName,  setProjectName]  = useState('')
  const [agency,       setAgency]       = useState('')
  const [bidFiles,     setBidFiles]     = useState([])
  const [formFiles,    setFormFiles]    = useState([])
  const [draftFiles,   setDraftFiles]   = useState([])

  const canGenerate = projectName.trim().length > 0 && bidFiles.length > 0

  function handleGenerate() {
    setStep('generating')
    setTimeout(() => onGenerate({ projectName, agency, bidFiles, formFiles, draftFiles }), 2200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={step === 'form' ? onClose : undefined} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">

        {step === 'generating' ? (
          /* ── Generating state ── */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 animate-pulse">
              <svg className="w-7 h-7 text-primary-dark" fill="none" viewBox="0 0 28 28">
                <path d="M14 3l2.5 5 5.5.8-4 3.9.9 5.5L14 15.5l-4.9 2.7.9-5.5-4-3.9 5.5-.8L14 3z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-semibold text-dark text-base mb-1.5">Aria is reading your documents…</p>
            <p className="text-sm text-gray-400 max-w-xs">Analyzing your bid documents and generating a tailored proposal. This takes a few seconds.</p>
            <div className="flex items-center gap-1.5 mt-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <h2 className="font-semibold text-dark text-base">Create a Proposal</h2>
                <p className="text-sm text-gray-400 mt-0.5">Upload your bid documents and let Aria generate a proposal for you</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-dark transition-colors flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* ── Form ── */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              {/* Project info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Project / Bid name <span className="text-red-400">*</span></label>
                  <input
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Nicollet Ave Streetscape Phase 3"
                    autoFocus
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">Issuing agency / client</label>
                  <input
                    value={agency}
                    onChange={e => setAgency(e.target.value)}
                    className="input-field"
                    placeholder="e.g. City of Minneapolis"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Uploads */}
              <UploadZone
                label={<>Bid / RFP document <span className="text-red-400">*</span></>}
                hint="PDF of the official bid or RFP you received · Required"
                accept=".pdf"
                files={bidFiles}
                onChange={setBidFiles}
                multiple={false}
              />

              <UploadZone
                label="Form documents"
                hint="Any blank forms, addenda, or supplemental sheets — PDF or Word"
                accept=".pdf,.doc,.docx"
                files={formFiles}
                onChange={setFormFiles}
                multiple
              />

              <UploadZone
                label="Existing proposal draft (optional)"
                hint="Upload a previous proposal or draft for Aria to improve"
                accept=".pdf,.doc,.docx"
                files={draftFiles}
                onChange={setDraftFiles}
                multiple={false}
              />

              {/* Aria note */}
              <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary-dark" fill="none" viewBox="0 0 16 16">
                    <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-dark">Aria reads your uploads</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Aria will extract requirements, scope, and evaluation criteria from your documents and generate a structured proposal tailored to this specific bid.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
              <p className="text-xs text-gray-400">
                {bidFiles.length === 0
                  ? 'Upload the bid document to continue'
                  : `${bidFiles.length + formFiles.length + draftFiles.length} file${bidFiles.length + formFiles.length + draftFiles.length !== 1 ? 's' : ''} ready`}
              </p>
              <div className="flex gap-2">
                <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="btn-primary text-sm disabled:opacity-40"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  Generate with Aria
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyApplicationsPage() {
  const { applications, getBidProgress } = useApplications()
  const { bids } = useBids()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery,  setSearchQuery]  = useState('')
  const [showModal,    setShowModal]    = useState(false)

  const rows = Object.entries(applications).map(([bidId, app]) => {
    const bid = bids.find(b => b.id === bidId)
    return { bidId, app, bid }
  }).filter(({ bid }) => bid)

  const filtered = rows.filter(({ app, bid }) => {
    const statusLabel = STATUS_CONFIG[app.status]?.label || ''
    const matchFilter = activeFilter === 'All' || statusLabel === activeFilter
    const matchSearch = !searchQuery ||
      bid?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid?.agency.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFilter && matchSearch
  })

  const statusCounts = Object.values(applications).reduce((acc, app) => {
    const label = STATUS_CONFIG[app.status]?.label || 'Other'
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  function handleGenerated({ projectName }) {
    setShowModal(false)
    // In a real app this would create a new custom proposal entry
    // For the prototype, we navigate to the browse page
    navigate('/bids')
  }

  return (
    <Layout
      title="My Proposals"
      subtitle={`${rows.length} proposal${rows.length !== 1 ? 's' : ''} across ${rows.length} bid${rows.length !== 1 ? 's' : ''}`}
    >
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',        value: rows.length,                      color: 'text-dark' },
          { label: 'In Progress',  value: statusCounts['In Progress'] || 0, color: 'text-amber-600' },
          { label: 'Submitted',    value: statusCounts['Submitted']   || 0, color: 'text-blue-600' },
          { label: 'Approved',     value: statusCounts['Approved']    || 0, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + search + create button */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative max-w-xs flex-shrink-0">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search proposals…"
          />
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-1">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1',
                activeFilter === f ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
              {f}
              {f !== 'All' && statusCounts[f] ? (
                <span className="ml-1 text-gray-400">({statusCounts[f]})</span>
              ) : null}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-sm flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Proposal
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" fill="none" viewBox="0 0 28 28">
              <path d="M7 3h10.5L22 7.5V25H7V3z" stroke="#D4A000" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M17 3v5h5" stroke="#D4A000" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M10 13h8M10 17h5" stroke="#D4A000" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="font-semibold text-dark mb-1">No proposals found</p>
          <p className="text-sm text-gray-400 mb-5">Start by creating a proposal for an open bid</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">Create your first proposal</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Bid</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Proposal</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Progress</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Deadline</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Budget</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ bidId, app, bid }) => {
                const progress   = getBidProgress(bidId)
                const urgency    = getUrgency(bid?.deadline)
                const statusCfg  = STATUS_CONFIG[app.status]
                const isDraft    = app.status === 'draft' || app.status === 'completed'

                return (
                  <tr
                    key={bidId}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                    onClick={() => navigate(`/applications/${bidId}`)}
                  >
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
                      {app.proposalGenerated ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-dark">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                            <path d="M2.5 8l3 3L13.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Ready
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not generated</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5 min-w-[100px]">
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
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                      >
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

      {/* Modal */}
      {showModal && (
        <CreateProposalModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerated}
        />
      )}
    </Layout>
  )
}
