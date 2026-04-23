import { useEffect, useRef, useState } from 'react'
import { useProposal } from '../../context/ProposalContext'
import TemplateNavy from './templates/TemplateNavy'
import TemplateClean from './templates/TemplateClean'

const PAGE_W = 794

const TEMPLATE_MAP = {
  navy: TemplateNavy,
  clean: TemplateClean,
}

// Inject a highlight <span> around the current browser selection.
// Returns { text, highlightEl } or null if selection is too short / wrapping fails.
function wrapSelectionWithHighlight() {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed) return null
  const text = sel.toString().trim()
  if (text.length < 3) return null

  const range = sel.getRangeAt(0)

  const span = document.createElement('span')
  span.setAttribute('data-ai-highlight', 'true')
  span.style.cssText = [
    'background: rgba(245,184,0,0.28)',
    'border-bottom: 2px solid #D4A000',
    'border-radius: 2px',
    'cursor: default',
  ].join(';')

  try {
    // extractContents handles multi-node selections by fragmenting boundary elements
    const fragment = range.extractContents()
    span.appendChild(fragment)
    range.insertNode(span)
    sel.removeAllRanges()
    return { text, highlightEl: span }
  } catch {
    // Shouldn't happen with extractContents, but guard anyway
    return null
  }
}

export default function ProposalCanvas({ bid }) {
  const {
    proposalData, templateId,
    updateField, updateSectionContent,
    sectionVersions,
    isEditing, isGenerating,
    setPendingSelection,
    pendingSelection, pendingEdit,
  } = useProposal()

  const containerRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const isBusy = isEditing || isGenerating

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const avail = el.clientWidth - 48
      setZoom(Math.min(1, avail / PAGE_W))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function handleMouseUp() {
    // Don't capture new selections while busy or while a selection/edit is pending
    if (isBusy || pendingSelection || pendingEdit) return
    setTimeout(() => {
      const result = wrapSelectionWithHighlight()
      if (result) setPendingSelection(result)
    }, 10)
  }

  const isEmpty = !proposalData
  const Template = TEMPLATE_MAP[templateId] ?? TemplateClean

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden bg-[#d8dce2] relative select-text"
      onMouseUp={handleMouseUp}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-full py-16 px-6">
          <div
            style={{ width: PAGE_W * 0.9, maxWidth: '100%' }}
            className="bg-white rounded-2xl shadow-card p-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#D4A000" strokeWidth="1.7" strokeLinecap="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#D4A000" strokeWidth="1.7"/>
                <path d="M9 12h6M9 16h4" stroke="#D4A000" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-heading font-bold text-dark text-xl mb-2">Proposal Canvas</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Select a template from the header, then click{' '}
              <strong className="text-dark">"Analyze &amp; Generate Proposal"</strong> to fill it with AI-generated content.
            </p>

            <div className="mt-10 space-y-4 w-full text-left">
              {['Cover Page', 'Introduction', 'Scope of Work', 'Team', 'Timeline', 'Pricing'].map((name, i) => (
                <div
                  key={name}
                  className="border border-dashed border-gray-200 rounded-xl p-4"
                  style={{ opacity: 1 - i * 0.1 }}
                >
                  <div className="h-3 w-28 bg-gray-100 rounded mb-2.5" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-100 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-4/5" />
                    <div className="h-2 bg-gray-100 rounded w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center gap-6" style={{ zoom }}>
          <Template
            data={proposalData}
            onFieldChange={updateField}
            onContentUpdate={updateSectionContent}
            sectionVersions={sectionVersions}
          />
        </div>
      )}

      {isBusy && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2.5 bg-white rounded-xl shadow-float px-5 py-3 border border-gray-100">
            <svg className="animate-spin w-4 h-4 text-primary-dark" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-xs font-semibold text-dark">
              {isGenerating ? 'Generating proposal…' : 'Applying edit…'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
