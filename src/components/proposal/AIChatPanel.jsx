import { useState, useRef, useEffect } from 'react'
import { useProposal } from '../../context/ProposalContext'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'scope',        label: 'Scope of Work' },
  { id: 'team',         label: 'Team' },
  { id: 'timeline',     label: 'Timeline' },
  { id: 'pricing',      label: 'Pricing' },
]

// ── Typewriter ────────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 13 }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (idx >= text.length) return
    const t = setTimeout(() => setIdx(i => i + 1), speed)
    return () => clearTimeout(t)
  }, [idx, text.length, speed])
  return (
    <>
      {text.slice(0, idx)}
      {idx < text.length && (
        <span className="inline-block w-px h-3 bg-gray-400 ml-0.5 animate-pulse align-middle" />
      )}
    </>
  )
}

// ── Chat bubbles ──────────────────────────────────────────────────────────────
function ChatMessage({ msg, animate }) {
  const isAI = msg.role === 'ai'
  // Render newlines as line breaks
  const lines = msg.text.split('\n')
  const content = animate
    ? <TypewriterText text={msg.text} />
    : lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 && <br />}</span>)

  return (
    <div className={`flex gap-2 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${isAI ? 'bg-primary/15 text-primary-dark' : 'bg-dark text-white'}`}>
        {isAI ? 'Ar' : 'U'}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${isAI ? 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm' : 'bg-dark text-white rounded-tr-sm'}`}>
        {content}
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-lg flex-shrink-0 bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary-dark">Ar</div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

// ── Section dropdown ──────────────────────────────────────────────────────────
function SectionDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = SECTIONS.find(s => s.id === value)

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-dark bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40"
      >
        <svg width="11" height="11" fill="none" viewBox="0 0 14 14">
          <rect x="1" y="1" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="8" y="1" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="1" y="8" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="8" y="8" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
        {current?.label}
        <svg width="9" height="9" fill="none" viewBox="0 0 10 10" className={`ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-float py-1 min-w-[160px] z-50 animate-fade-in">
          <p className="px-3 pt-1.5 pb-1 text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Edit section</p>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { onChange(s.id); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                s.id === value ? 'text-dark font-semibold bg-primary/5' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.id === value ? 'bg-primary' : 'bg-gray-200'}`} />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Accept / Reject bar (shown after AI proposes a rewrite) ───────────────────
function PendingEditBar({ pendingEdit, onAccept, onReject }) {
  return (
    <div className="mx-3 mb-2 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <div className="px-3 py-2 flex items-start gap-2">
        <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="10" height="10" fill="none" viewBox="0 0 12 12">
            <path d="M2 6.5L4.5 9 10 3.5" stroke="#92400e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-amber-900 mb-0.5">Rewrite proposed</p>
          <p className="text-[10px] text-amber-700 leading-relaxed line-clamp-2">
            "{pendingEdit.proposedText.substring(0, 80)}{pendingEdit.proposedText.length > 80 ? '…' : ''}"
          </p>
        </div>
      </div>
      <div className="flex border-t border-amber-200">
        <button
          onClick={onReject}
          className="flex-1 py-2 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-r border-amber-200"
        >
          Discard
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
        >
          ✓ Apply
        </button>
      </div>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function AIChatPanel({ bid, profile }) {
  const {
    proposalData,
    messages, isGenerating, isEditing,
    generateProposal, editSection, editSelection,
    pendingSelection, dismissSelection,
    pendingEdit, acceptEdit, rejectEdit,
  } = useProposal()

  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedSection, setSelectedSection] = useState('introduction')
  const [instruction, setInstruction] = useState('')
  const [attachment, setAttachment] = useState(null)
  const fileRef = useRef(null)
  const textareaRef = useRef(null)
  const endRef = useRef(null)
  const seenIds = useRef(new Set(messages.map(m => m.id)))

  const isBusy = isGenerating || isEditing
  const hasProposal = !!proposalData

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isBusy])

  // Auto-focus input when selection arrives from canvas
  useEffect(() => {
    if (pendingSelection && hasProposal) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [pendingSelection, hasProposal])

  async function handleGenerate() {
    await generateProposal(bid, profile)
  }

  async function handleSend() {
    if (!instruction.trim()) return
    const instr = instruction.trim()
    setInstruction('')
    setAttachment(null)

    if (pendingSelection) {
      await editSelection(pendingSelection.text, instr, pendingSelection.highlightEl)
    } else {
      await editSection(selectedSection, instr)
    }
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) setAttachment(file)
    e.target.value = ''
  }

  const canSend = !isBusy && !pendingEdit && instruction.trim()

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.5" stroke="#D4A000" strokeWidth="1.4"/>
              <path d="M5.5 8.5c.8 1 4.5 1 4.5-1.5C10 5 8 4.5 8 6.5c0 1.5 1 2 1 3.5" stroke="#D4A000" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-dark">Aria <span className="text-gray-300 font-normal">·</span> <span className="text-xs font-normal text-gray-400">Proposal AI</span></p>
            <p className="text-[10px] text-gray-400 truncate">Analysing: {bid?.title}</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
        </div>

        {bid?.documents?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {bid.documents.map(doc => (
              <span key={doc.id} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 text-[9px] text-gray-500 font-medium">
                <svg width="8" height="8" fill="none" viewBox="0 0 10 12">
                  <rect x="0.5" y="0.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1"/>
                  <path d="M2.5 4h5M2.5 6.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                {doc.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.length === 0 && !isBusy && (
          <div className="text-center pt-12 px-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#D4A000" strokeWidth="1.6" strokeLinecap="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#D4A000" strokeWidth="1.6"/>
              </svg>
            </div>
            <p className="text-xs font-semibold text-dark mb-1">Ready to generate</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Add optional context below, then click <strong className="text-dark">Analyze &amp; Generate</strong>.
            </p>
          </div>
        )}

        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            msg={msg}
            animate={msg.role === 'ai' && !seenIds.current.has(msg.id)}
          />
        ))}

        {isBusy && <ThinkingBubble />}
        <div ref={endRef} />
      </div>

      {/* ── Pending edit accept/reject bar ── */}
      {pendingEdit && (
        <PendingEditBar
          pendingEdit={pendingEdit}
          onAccept={acceptEdit}
          onReject={rejectEdit}
        />
      )}

      {/* ── Action area ── */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white">

        {/* BEFORE generation */}
        {!hasProposal && (
          <div className="p-3 space-y-2">
            <textarea
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Optional: add context or special instructions for the AI…"
              rows={2}
              disabled={isBusy}
              className="input-field text-xs resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isBusy}
              className="w-full btn-primary justify-center py-2.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                    <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4.2 4.2l2.1 2.1M9.7 9.7l2.1 2.1M4.2 11.8l2.1-2.1M9.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Analyze &amp; Generate Proposal
                </>
              )}
            </button>
          </div>
        )}

        {/* AFTER generation — chat-style input */}
        {hasProposal && (
          <div className="p-3 space-y-2">

            {/* Section selector row (hidden during selection or pending edit) */}
            {!pendingSelection && !pendingEdit && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-medium">Editing</span>
                <SectionDropdown
                  value={selectedSection}
                  onChange={setSelectedSection}
                  disabled={isBusy}
                />
              </div>
            )}

            {/* Selection chip */}
            {pendingSelection && !pendingEdit && (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-sm bg-primary flex-shrink-0" style={{ background: 'rgba(245,184,0,0.6)', border: '1.5px solid #D4A000' }} />
                  <span className="text-[10px] text-amber-900 font-medium truncate">
                    Selected: "{pendingSelection.text.substring(0, 45)}{pendingSelection.text.length > 45 ? '…' : ''}"
                  </span>
                  <button
                    onClick={dismissSelection}
                    className="flex-shrink-0 text-amber-400 hover:text-amber-700 ml-auto transition-colors"
                    title="Remove highlight"
                  >
                    <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Attachment chip */}
            {attachment && !pendingEdit && (
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 self-start">
                <svg width="11" height="11" fill="none" viewBox="0 0 14 14" className="text-gray-500 flex-shrink-0">
                  <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span className="text-[10px] text-gray-600 font-medium truncate max-w-[140px]">{attachment.name}</span>
                <button onClick={() => setAttachment(null)} className="text-gray-400 hover:text-gray-600 ml-0.5">
                  <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                    <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Input row — hidden while pending edit awaits decision */}
            {!pendingEdit && (
              <div className={`flex items-end gap-1.5 bg-gray-50 border rounded-xl px-2 py-1.5 transition-colors ${isBusy ? 'opacity-50' : 'focus-within:border-primary/40 focus-within:bg-white border-gray-200'}`}>
                {/* Attachment button */}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => fileRef.current?.click()}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:pointer-events-none"
                  title="Attach file"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                    <path d="M13.5 7.5l-6 6a3.5 3.5 0 01-4.95-4.95l6.5-6.5a2 2 0 012.83 2.83l-6.5 6.5a.5.5 0 01-.71-.71l5.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.txt" />

                {/* Instruction input */}
                <textarea
                  ref={textareaRef}
                  value={instruction}
                  onChange={e => setInstruction(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey && canSend) {
                      e.preventDefault(); handleSend()
                    }
                  }}
                  placeholder={
                    pendingSelection
                      ? 'How should I rewrite this selection?'
                      : 'Instruction — e.g. make it shorter, more formal…'
                  }
                  rows={1}
                  disabled={isBusy}
                  className="flex-1 bg-transparent text-xs text-dark placeholder-gray-400 resize-none outline-none leading-relaxed py-1 min-h-[28px] max-h-[80px]"
                  style={{ fieldSizing: 'content' }}
                />

                {/* Send button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-dark text-white rounded-lg hover:bg-dark/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Send (Enter)"
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 14 14">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Helper hint */}
            {pendingSelection && !pendingEdit && (
              <p className="text-[9px] text-gray-400 text-center">
                Highlighted in document ·{' '}
                <button className="underline hover:text-gray-600 transition-colors" onClick={dismissSelection}>
                  clear selection
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
