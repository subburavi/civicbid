import { useState, useEffect, useRef } from 'react'

const LOG_STEPS = [
  { type: 'system', text: 'Bid document uploaded — Event 4125',                                                                                   delay: 500  },
  { type: 'aria',   text: 'Reading Nicollet Ave Planting & Maintenance RFP…',                                                                     delay: 900  },
  { type: 'system', text: '✓ Detected 8 required form fields',                                                                                    delay: 700  },
  { type: 'aria',   text: 'Starting auto-fill from company profile…',                                                                             delay: 800  },
  { type: 'field',  key: 'Company name',    value: 'Abdullahi Engineering LLC',                                                                   delay: 500  },
  { type: 'field',  key: 'Bid amount',      value: '$42,500',                                                                                     delay: 400  },
  { type: 'field',  key: 'License #',       value: 'BC-204871',                                                                                   delay: 400  },
  { type: 'field',  key: 'Prevailing wage', value: 'Confirmed ✓',                                                                                delay: 400  },
  { type: 'field',  key: 'MBE/WBE cert',   value: 'Not applicable',                                                                              delay: 400  },
  { type: 'aria',   text: '6 of 8 fields filled · 2 require manual input',                                                                        delay: 700  },
  { type: 'system', text: 'Starting proposal generation…',                                                                                        delay: 900  },
  { type: 'aria',   text: 'Writing Introduction section…',                                                                                        delay: 1000 },
  { type: 'prose',  text: '"Abdullahi Engineering LLC is pleased to submit this proposal for the Nicollet Ave Planting & Maintenance project…"',   delay: 800  },
  { type: 'aria',   text: 'Writing Scope of Work…',                                                                                               delay: 900  },
  { type: 'prose',  text: '"Our team will deliver full-season boulevard planting, tree installation, and maintenance along Nicollet Avenue…"',     delay: 900  },
  { type: 'aria',   text: 'Writing Experience, Pricing, Team sections…',                                                                          delay: 1100 },
  { type: 'system', text: '✓ Proposal complete — 5 sections · 1,240 tokens used',                                                                delay: 800  },
  { type: 'done',   text: 'Ready to review and export',                                                                                           delay: 600  },
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

export function AriaLog({ height = 'h-96' }) {
  const [visible, setVisible] = useState(0)
  const [typing,  setTyping]  = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      while (!cancelled) {
        setVisible(0)
        setTyping(false)
        await sleep(800)
        for (let i = 0; i < LOG_STEPS.length; i++) {
          if (cancelled) break
          setTyping(true)
          await sleep(LOG_STEPS[i].delay)
          if (cancelled) break
          setVisible(i + 1)
          setTyping(i + 1 < LOG_STEPS.length)
        }
        await sleep(3200)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [visible])

  const entries = LOG_STEPS.slice(0, visible)

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary/15 blur-3xl rounded-3xl scale-90 translate-y-6 pointer-events-none" />
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-float" style={{ background: '#0d0d0d' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]" style={{ background: '#141414' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 12 12">
                  <path d="M6 1l1.2 2.4 2.8.4-2 2 .5 2.8L6 7.5 3.5 8.6 4 5.8 2 3.8l2.8-.4L6 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-400">Aria · Proposal AI</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-green-400">Live</span>
          </div>
        </div>

        {/* Log body */}
        <div ref={scrollRef} className={`${height} overflow-y-auto p-5 space-y-2.5`} style={{ scrollbarColor: '#333 transparent' }}>
          {entries.map((entry, i) => {
            if (entry.type === 'system') return (
              <div key={i} className="flex items-start gap-2.5 opacity-0 animate-[fadeUp_0.3s_ease_forwards]">
                <span className="text-[10px] font-mono text-gray-600 mt-0.5 flex-shrink-0 w-14">{String(i + 1).padStart(2, '0')} sys</span>
                <span className="text-xs text-gray-500 leading-relaxed">{entry.text}</span>
              </div>
            )
            if (entry.type === 'aria') return (
              <div key={i} className="flex items-start gap-2.5 opacity-0 animate-[fadeUp_0.3s_ease_forwards]">
                <span className="text-[10px] font-mono text-primary/60 mt-0.5 flex-shrink-0 w-14">{String(i + 1).padStart(2, '0')} aria</span>
                <div className="flex-1 pl-3 border-l border-primary/30">
                  <span className="text-xs text-primary-light leading-relaxed">{entry.text}</span>
                </div>
              </div>
            )
            if (entry.type === 'field') return (
              <div key={i} className="flex items-center gap-2.5 opacity-0 animate-[fadeUp_0.3s_ease_forwards] ml-16">
                <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[11px] font-mono text-gray-500">{entry.key}</span>
                <span className="text-[11px] text-gray-600">→</span>
                <span className="text-[11px] font-mono text-green-400">{entry.value}</span>
              </div>
            )
            if (entry.type === 'prose') return (
              <div key={i} className="ml-16 pl-3 border-l border-white/10 opacity-0 animate-[fadeUp_0.3s_ease_forwards]">
                <p className="text-[11px] text-gray-500 leading-relaxed italic">{entry.text}</p>
              </div>
            )
            if (entry.type === 'done') return (
              <div key={i} className="flex items-center gap-2.5 mt-3 opacity-0 animate-[fadeUp_0.3s_ease_forwards]">
                <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-lg px-3 py-1.5 ml-16">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 14 14">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs font-semibold text-primary">{entry.text}</span>
                </div>
              </div>
            )
            return null
          })}

          {typing && (
            <div className="flex items-center gap-2.5 ml-16">
              <div className="flex items-center gap-1 px-2.5 py-1.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.9s' }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-5 py-3.5 border-t border-white/[0.06] flex items-center gap-3" style={{ background: '#141414' }}>
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <span className="text-[10px] text-gray-600 font-mono">aria&gt;</span>
            <span className="text-xs text-gray-600 flex-1">Ask Aria to refine any section…</span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 14 14">
              <path d="M2 7h10M8 4l4 3-4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
