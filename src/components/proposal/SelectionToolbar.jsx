import { useState, useRef, useEffect } from 'react'

export default function SelectionToolbar({ position, onSubmit, onClose }) {
  const [instruction, setInstruction] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && instruction.trim()) {
      e.preventDefault()
      onSubmit(instruction.trim())
    }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed z-50 flex items-center gap-1.5 bg-dark text-white rounded-xl shadow-float px-2 py-1.5"
      style={{ top: position.y - 52, left: position.x }}
      onMouseDown={e => e.preventDefault()}
    >
      {/* wand icon */}
      <span className="text-primary flex-shrink-0">
        <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
          <path d="M2 14L10 6M7 3l3-3 2 2-3 3M12 8l2-2 2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <input
        ref={inputRef}
        value={instruction}
        onChange={e => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tell AI what to change…"
        className="bg-transparent text-white placeholder-gray-400 text-xs outline-none w-44"
      />
      <button
        onClick={() => instruction.trim() && onSubmit(instruction.trim())}
        disabled={!instruction.trim()}
        className="flex-shrink-0 bg-primary text-dark text-[10px] font-bold px-2 py-0.5 rounded-lg disabled:opacity-40 hover:bg-primary-light transition-colors"
      >
        Rewrite
      </button>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors ml-0.5"
      >
        <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
