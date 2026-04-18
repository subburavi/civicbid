import { useState, useRef, useEffect } from 'react'
import { DOCUMENT_FIELDS, AI_CHAT_RESPONSES } from '../../data/mockFormFields'
import { useApplications } from '../../context/ApplicationContext'
import { useToast } from '../../context/ToastContext'
import { useDropzone } from 'react-dropzone'
import { Spinner } from '../ui/Spinner'

function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 mb-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs flex-shrink-0 mb-0.5">🤖</div>
      )}
      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
        isUser ? 'bg-primary text-dark font-medium rounded-br-sm' : 'bg-gray-100 text-dark rounded-bl-sm'
      }`}>
        {msg.content}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2.5">
        <div className="flex gap-1 items-center h-3"><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div>
      </div>
    </div>
  )
}

function FileDropZone({ accept, onFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept ? Object.fromEntries(accept.split(',').map(e => {
      const m = { '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.png': 'image/png' }
      return [m[e.trim()] || e.trim(), [e.trim()]]
    })) : undefined,
    multiple: false,
    onDrop: f => f[0] && onFile(f[0]),
  })
  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-3 cursor-pointer text-center transition-all ${
      isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
    }`}>
      <input {...getInputProps()} />
      <div className="text-xl mb-1">📎</div>
      <p className="text-xs text-gray-500">{isDragActive ? 'Drop here' : 'Drag & drop or click to upload'}</p>
      {accept && <p className="text-[10px] text-gray-300 mt-0.5">{accept}</p>}
    </div>
  )
}

function QuestionCard({ field, index, total, savedValue, onAnswer, onSkip }) {
  const [textVal, setTextVal] = useState(
    savedValue !== undefined && typeof savedValue !== 'boolean' && typeof savedValue !== 'object'
      ? String(savedValue) : ''
  )
  const [hovered, setHovered] = useState(null)
  const boolOpts = [{ label: 'Yes', value: true }, { label: 'No', value: false }]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-float overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-dark leading-snug flex-1 pr-3">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5">*</span>}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {savedValue !== undefined && (
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Saved</span>
          )}
          <span className="text-[11px] text-gray-400 font-medium tabular-nums">{index + 1} of {total}</span>
          <button onClick={onSkip} className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors text-xs">✕</button>
        </div>
      </div>

      {field.type === 'boolean' && (
        <div className="divide-y divide-gray-100">
          {field.description && <p className="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/80">{field.description}</p>}
          {boolOpts.map((opt, i) => (
            <button key={opt.label} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              onClick={() => onAnswer(opt.value, opt.label)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all ${
                savedValue === opt.value ? 'bg-primary/10' : hovered === i ? 'bg-primary/5' : 'hover:bg-gray-50'
              }`}>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 bg-gray-50 flex-shrink-0">{i + 1}</span>
                <span className="font-medium text-dark">{opt.label}</span>
              </div>
              {(hovered === i || savedValue === opt.value) && <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          ))}
        </div>
      )}

      {field.type === 'select' && (
        <div className="divide-y divide-gray-100">
          {field.options?.map((opt, i) => (
            <button key={opt} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              onClick={() => onAnswer(opt, opt)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all ${
                savedValue === opt ? 'bg-primary/10' : hovered === i ? 'bg-primary/5' : 'hover:bg-gray-50'
              }`}>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 bg-gray-50 flex-shrink-0">{i + 1}</span>
                <span className="font-medium text-dark">{opt}</span>
              </div>
              {(hovered === i || savedValue === opt) && <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          ))}
        </div>
      )}

      {(field.type === 'text' || field.type === 'number') && (
        <div className="p-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              {field.type === 'number' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>}
              <input autoFocus type={field.type === 'number' ? 'number' : 'text'}
                placeholder={field.placeholder || 'Type your answer…'}
                value={textVal} onChange={e => setTextVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && textVal.trim() && onAnswer(textVal, textVal)}
                className={`w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${field.type === 'number' ? 'pl-7' : ''}`}
              />
            </div>
            <button onClick={() => textVal.trim() && onAnswer(textVal, textVal)} disabled={!textVal.trim()}
              className="px-3 py-2 bg-primary text-dark text-sm font-bold rounded-xl disabled:opacity-40 hover:bg-primary-dark transition-colors">→</button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">Press Enter or → to continue</p>
        </div>
      )}

      {field.type === 'file' && (
        <div className="p-3">
          {field.description && <p className="text-[11px] text-gray-400 mb-2">{field.description}</p>}
          <FileDropZone accept={field.accept} onFile={f => onAnswer(f, `📎 ${f.name}`)} />
        </div>
      )}

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {field.type === 'boolean' || field.type === 'select' ? 'Click an option to continue' : '↵ Enter to confirm'}
        </p>
        {!field.required && (
          <button onClick={onSkip} className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors">Skip</button>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ fields, answers, onDownload }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-float overflow-hidden animate-slide-up">
      <div className="px-4 py-3 border-b border-gray-100 bg-green-50 flex items-center gap-2">
        <span className="text-green-500">✅</span>
        <p className="text-sm font-semibold text-dark">All fields filled — ready to submit</p>
      </div>
      <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
        {fields.map(f => (
          <div key={f.id} className="flex items-start justify-between px-4 py-2">
            <span className="text-[11px] text-gray-400 w-1/2 pr-2">{f.label}</span>
            <span className="text-[11px] font-semibold text-dark w-1/2 text-right break-words">
              {answers[f.id] !== undefined
                ? typeof answers[f.id] === 'boolean'
                  ? answers[f.id] ? '✓ Yes' : '✗ No'
                  : typeof answers[f.id] === 'object' && answers[f.id]?.name
                  ? `📎 ${answers[f.id].name}`
                  : String(answers[f.id])
                : <span className="text-gray-300 italic">Skipped</span>
              }
            </span>
          </div>
        ))}
      </div>
      <div className="p-3">
        <button onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-dark font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          Download Filled PDF
        </button>
      </div>
    </div>
  )
}

export function AIAssistant({ bid, bidId, docId, onFieldAnswered }) {
  const { addToast } = useToast()
  const { getDocAnswers, saveDocAnswers, startApplication } = useApplications()
  const endRef = useRef(null)

  const resolvedBidId = bidId || bid?.id
  const docFields = DOCUMENT_FIELDS[resolvedBidId]?.[docId] || DOCUMENT_FIELDS.default?.[docId] || DOCUMENT_FIELDS.default?.doc1

  const [phase, setPhase] = useState('intro')
  const [messages, setMessages] = useState([{
    id: 1, role: 'ai',
    content: `Hi! I'll walk you through every field in this bid form one question at a time. Click "Analyze PDF" to begin.`,
  }])
  const [isTyping, setIsTyping] = useState(false)
  const [fields, setFields] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [chatInput, setChatInput] = useState('')

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping, currentIdx])

  function pushAI(content, delay = 700) {
    setIsTyping(true)
    return new Promise(res => setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content }])
      res()
    }, delay))
  }
  function pushUser(content) {
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content }])
  }

  async function handleAnalyze() {
    pushUser('Analyze this PDF and extract all form fields.')
    setPhase('analyzing')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1800))
    setIsTyping(false)

    const f = docFields?.fields || []
    setFields(f)

    // Load saved answers
    const saved = getDocAnswers(resolvedBidId, docId)
    setAnswers(saved)

    const savedCount = Object.keys(saved).length
    const hasSaved = savedCount > 0

    await pushAI(
      hasSaved
        ? `✅ Found ${f.length} fields — ${savedCount} already have saved answers (shown in blue). I'll ask you to confirm or update each one.`
        : `✅ Analysis complete — ${f.length} form fields detected. Your answers will auto-fill on the PDF in real time. Let's start!`,
      100
    )

    // Ensure application is started
    startApplication(resolvedBidId)
    setPhase('questioning')
    setCurrentIdx(0)
    addToast({ message: `${f.length} fields detected — filling in real time`, type: 'success' })
  }

  async function handleAnswer(fieldId, rawValue, displayValue) {
    const field = fields[currentIdx]
    pushUser(displayValue)
    const newAnswers = { ...answers, [fieldId]: rawValue }
    setAnswers(newAnswers)

    // Save to context
    saveDocAnswers(resolvedBidId, docId, newAnswers, fields.length)

    // Notify parent for PDF overlay
    onFieldAnswered?.(currentIdx, fieldId, rawValue, displayValue, field.type)

    const next = currentIdx + 1
    if (next >= fields.length) {
      await pushAI("🎉 All done! Your answers have been filled into the PDF. Review the summary below and download when ready.")
      setCurrentIdx(next)
      setPhase('complete')
      addToast({ message: 'PDF fully filled — ready to download!', type: 'success' })
    } else {
      setIsTyping(true)
      await new Promise(r => setTimeout(r, 350))
      setIsTyping(false)
      setCurrentIdx(next)
    }
  }

  async function handleSkip() {
    const field = fields[currentIdx]
    pushUser(`(Skipped: ${field.label})`)
    const next = currentIdx + 1
    if (next >= fields.length) {
      await pushAI("All done! Here's your summary.")
      setCurrentIdx(next)
      setPhase('complete')
    } else {
      setCurrentIdx(next)
    }
  }

  async function handleChatSend() {
    if (!chatInput.trim()) return
    const msg = chatInput.trim(); setChatInput('')
    pushUser(msg)
    await pushAI(AI_CHAT_RESPONSES[Math.floor(Math.random() * AI_CHAT_RESPONSES.length)])
  }

  function handleDownload() {
    addToast({ message: 'Filled PDF downloaded!', type: 'success' })
  }

  const currentField = phase === 'questioning' && fields ? fields[currentIdx] : null

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 flex-shrink-0 flex items-center gap-2">
        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs flex-shrink-0">🤖</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-dark">AI Bid Assistant</p>
          <p className="text-[10px] text-gray-400 truncate">{bid?.title}</p>
        </div>
        {phase === 'questioning' && fields && (
          <div className="flex-shrink-0 text-[11px] font-bold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full">
            {currentIdx + 1}/{fields.length}
          </div>
        )}
        {phase === 'complete' && (
          <span className="flex-shrink-0 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Complete ✓</span>
        )}
      </div>

      {phase === 'questioning' && fields && (
        <div className="h-0.5 bg-gray-100 flex-shrink-0">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentIdx / fields.length) * 100}%` }} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-3">
        {messages.map(m => <Bubble key={m.id} msg={m} />)}
        {isTyping && <Typing />}
        <div ref={endRef} />
      </div>

      <div className="px-3 pb-3 pt-2 flex-shrink-0 border-t border-gray-100 space-y-2">
        {phase === 'intro' && (
          <button onClick={handleAnalyze}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-dark font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Analyze PDF & Start Questions
          </button>
        )}

        {phase === 'analyzing' && (
          <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400">
            <Spinner size="sm" />Analyzing PDF fields…
          </div>
        )}

        {phase === 'questioning' && currentField && (
          <QuestionCard
            key={`${docId}-${currentField.id}`}
            field={currentField}
            index={currentIdx}
            total={fields.length}
            savedValue={answers[currentField.id]}
            onAnswer={(raw, display) => handleAnswer(currentField.id, raw, display)}
            onSkip={handleSkip}
          />
        )}

        {phase === 'complete' && fields && (
          <SummaryCard fields={fields} answers={answers} onDownload={handleDownload} />
        )}

        {(phase === 'intro' || phase === 'complete') && (
          <div className="flex gap-2">
            <input type="text" placeholder="Ask about this bid…" value={chatInput}
              onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChatSend()}
              className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
            <button onClick={handleChatSend} disabled={!chatInput.trim()}
              className="px-2.5 py-1.5 bg-primary text-dark rounded-xl disabled:opacity-40 hover:bg-primary-dark transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16"><path d="M2 8l12-6-5 14-2-6-5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
