import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'
import { useProposal } from '../../context/ProposalContext'
import { TEMPLATES } from '../../data/proposalTemplates'
import SelectionToolbar from './SelectionToolbar'

function buildHTML(sections) {
  if (!sections.length) return ''
  return sections
    .map(s => `<div data-section-id="${s.id}"><h2>${s.title}</h2>${s.content}</div>`)
    .join('')
}

export default function ProposalEditor({ bid }) {
  const { sections, contentVersion, editSelection, isEditing, isGenerating, templateId } = useProposal()
  const [toolbarState, setToolbarState] = useState(null)
  const toolbarActiveRef = useRef(false)

  const template = TEMPLATES.find(t => t.id === templateId) ?? TEMPLATES[0]

  // Load external font when template needs it
  useEffect(() => {
    if (!template.fontUrl) return
    const existing = document.getElementById('proposal-tpl-font')
    if (existing) { existing.href = template.fontUrl; return }
    const link = document.createElement('link')
    link.id = 'proposal-tpl-font'
    link.rel = 'stylesheet'
    link.href = template.fontUrl
    document.head.appendChild(link)
    return () => link.remove()
  }, [template.fontUrl])

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: { attributes: { class: 'outline-none' } },
    onSelectionUpdate({ editor }) {
      if (toolbarActiveRef.current) return
      const { from, to } = editor.state.selection
      if (from === to) return
      const text = editor.state.doc.textBetween(from, to, ' ')
      if (!text.trim() || text.trim().length < 3) return
      const coords = editor.view.coordsAtPos(from)
      toolbarActiveRef.current = true
      setToolbarState({ from, to, text, x: coords.left, y: coords.top })
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(sections.length ? buildHTML(sections) : '')
  }, [contentVersion, editor])

  function handleSelectionSubmit(instruction) {
    if (!toolbarState || !editor) return
    const { from, to, text } = toolbarState
    closeToolbar()
    editSelection(text, instruction, from, to, editor)
  }

  function closeToolbar() {
    toolbarActiveRef.current = false
    setToolbarState(null)
  }

  const isEmpty = sections.length === 0
  const isBusy = isGenerating || isEditing

  return (
    <div className="flex-1 overflow-y-auto bg-surface relative">
      {/* Inject template CSS as a live <style> tag — scoped to wrapperClass */}
      {template.css && <style>{template.css}</style>}

      {toolbarState && !isBusy && (
        <SelectionToolbar
          position={{ x: toolbarState.x, y: toolbarState.y }}
          onSubmit={handleSelectionSubmit}
          onClose={closeToolbar}
        />
      )}

      <div className="min-h-full py-8 px-4">
        {isEmpty ? (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card p-12 flex flex-col items-center justify-center min-h-[500px] text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#D4A000" strokeWidth="1.8" strokeLinecap="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#D4A000" strokeWidth="1.8"/>
                <path d="M9 12h6M9 16h4" stroke="#D4A000" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-heading font-bold text-dark text-lg mb-2">Proposal Canvas</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Click <strong className="text-dark">"Analyze &amp; Generate Proposal"</strong> in the AI panel to create a tailored proposal for this bid.
            </p>
            <div className="w-full mt-8 space-y-3 text-left">
              {['Introduction', 'Scope of Work', 'Team', 'Timeline', 'Pricing'].map(name => (
                <div key={name} className="border border-dashed border-gray-200 rounded-xl p-4">
                  <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-100 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-5/6" />
                    <div className="h-2 bg-gray-100 rounded w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card">
            {/* Document meta header */}
            <div
              className="px-10 pt-10 pb-6 border-b"
              style={
                template.id === 'one'
                  ? { borderColor: '#c5d4e0', background: 'linear-gradient(to right, #f4f6f9, #fff)' }
                  : { borderColor: '#f3f4f6' }
              }
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: template.id === 'one' ? '#c8962a' : '#D4A000' }}
              >
                Proposal
              </p>
              <h1
                style={
                  template.id === 'one'
                    ? { fontFamily: "'Playfair Display', serif", fontSize: '20pt', color: '#0d2340', margin: 0, lineHeight: 1.2 }
                    : {}
                }
                className={template.id !== 'one' ? 'font-heading font-bold text-dark text-2xl leading-tight' : ''}
              >
                {bid?.title}
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: template.id === 'one' ? '#5a6e80' : '#9ca3af' }}
              >
                Submitted to {bid?.agency}
              </p>
            </div>

            {/* TipTap editor — wrapped in template class so scoped CSS applies */}
            <div
              className={`px-10 py-8 ${!template.wrapperClass ? 'proposal-content' : ''}`}
              onClick={closeToolbar}
            >
              <div className={template.wrapperClass ?? ''}>
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        )}
      </div>

      {isBusy && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-float px-4 py-2.5 border border-gray-100">
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
