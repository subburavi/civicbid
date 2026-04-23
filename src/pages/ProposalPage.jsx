import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBids } from '../context/BidContext'
import { useUserProfile } from '../context/UserProfileContext'
import { ProposalProvider, useProposal } from '../context/ProposalContext'
import { Sidebar } from '../components/layout/Sidebar'
import ProposalCanvas from '../components/proposal/ProposalCanvas'
import AIChatPanel from '../components/proposal/AIChatPanel'
import { Badge } from '../components/ui/Badge'
import { TEMPLATES } from '../data/proposalTemplates'

// ── Template switcher ──────────────────────────────────────────────────────────
function TemplateSwitcher() {
  const { templateId, setTemplateId } = useProposal()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = TEMPLATES.find(t => t.id === templateId)

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`btn-secondary py-1.5 text-xs gap-1.5 ${open ? 'bg-gray-100' : ''}`}
        title="Switch template"
      >
        {/* grid icon */}
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
        Template
        <svg width="10" height="10" fill="none" viewBox="0 0 10 10" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-float p-3 z-50 animate-fade-in" style={{ width: 300 }}>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5 px-0.5">Choose Template</p>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map(t => {
              const isActive = templateId === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => { setTemplateId(t.id); setOpen(false) }}
                  className={`text-left rounded-lg border-2 overflow-hidden transition-all ${
                    isActive ? 'border-primary shadow-sm' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {/* Mini preview */}
                  <div className="h-20 relative flex flex-col" style={{ background: t.previewBg || '#fff' }}>
                    {/* header bar */}
                    <div className="h-3 w-full flex-shrink-0" style={{ background: t.color }} />
                    {/* body lines */}
                    <div className="flex-1 p-2 space-y-1">
                      <div className="h-1.5 rounded-full w-3/4" style={{ background: t.lineColor || '#d1d5db' }} />
                      <div className="h-1.5 rounded-full w-full" style={{ background: t.lineColor || '#e5e7eb' }} />
                      <div className="h-1.5 rounded-full w-5/6" style={{ background: t.lineColor || '#e5e7eb' }} />
                      <div className="h-1.5 rounded-full w-2/3" style={{ background: t.lineColor || '#e5e7eb' }} />
                    </div>
                  </div>
                  {/* label */}
                  <div className="px-2 py-1.5 bg-white">
                    <p className="text-[11px] font-semibold text-dark">{t.name}</p>
                    <p className="text-[9px] text-gray-400 leading-tight">{t.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Export helpers ─────────────────────────────────────────────────────────────
function buildFullHtml(proposalData, templateId, bid) {
  const { cover, sections } = proposalData
  const isNavy = templateId === 'navy'

  const fontLink = isNavy
    ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"/>`
    : ''

  const navyCover = `
<div style="width:794px;height:1123px;background:#0d2340;position:relative;overflow:hidden;font-family:'Source Sans 3',sans-serif;margin:0 auto 24px;box-shadow:0 4px 24px rgba(0,0,0,.18);">
  <div style="position:absolute;top:0;left:0;width:11px;height:100%;background:#c8962a;"></div>
  <div style="position:absolute;top:0;right:0;width:336px;height:100%;background:linear-gradient(160deg,#1a4a7a,#0d2340);clip-path:polygon(30% 0%,100% 0%,100% 100%,0% 100%);"></div>
  <div style="position:absolute;bottom:0;left:0;width:100%;height:240px;background:rgba(200,150,42,.07);clip-path:polygon(0% 100%,100% 38%,100% 100%);"></div>
  <div style="position:relative;z-index:2;padding:53px 72px 0;">
    <div style="background:#c8962a;color:white;font-size:7.5pt;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:4px 14px;display:inline-block;margin-bottom:24px;">${cover.proposalTag || 'Proposal'}</div>
    <div style="color:white;font-family:'Playfair Display',Georgia,serif;font-size:28pt;line-height:1.2;margin-bottom:12px;max-width:430px;">${cover.title}</div>
    <div style="color:rgba(255,255,255,.72);font-size:13pt;font-weight:300;margin-bottom:16px;">${cover.subtitle}</div>
    <div style="color:#c8962a;font-size:9pt;font-weight:600;">${cover.projectId}</div>
    <div style="width:58px;height:2px;background:#c8962a;margin:22px 0;"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px 22px;max-width:410px;">
      ${[['Submitted To',cover.agency],['Date',cover.date],['Contact',cover.contact?.name],['Phone',cover.contact?.phone],['Address',cover.contact?.address],['Email',cover.contact?.email]].map(([l,v])=>`<div><div style="color:rgba(255,255,255,.45);font-size:7pt;text-transform:uppercase;letter-spacing:.12em;margin-bottom:2px;">${l}</div><div style="color:white;font-size:9.5pt;font-weight:500;">${v||'—'}</div></div>`).join('')}
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 72px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;z-index:2;">
    <span style="color:rgba(255,255,255,.42);font-size:7.5pt;">Qualifications-Based Selection (QBS) Process</span>
    <span style="border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.68);font-size:7pt;padding:5px 12px;">PROPOSAL VALID 180 DAYS</span>
  </div>
</div>`

  const navySection = (s, i) => `
<div style="width:794px;min-height:1123px;background:white;display:flex;flex-direction:column;font-family:'Source Sans 3',sans-serif;margin:0 auto 24px;box-shadow:0 4px 24px rgba(0,0,0,.12);">
  <div style="background:#0d2340;padding:14px 52px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #c8962a;flex-shrink:0;">
    <span style="color:white;font-size:8.5pt;font-weight:600;letter-spacing:.08em;text-transform:uppercase;">Proposal — Section ${i+1}</span>
    <span style="color:rgba(255,255,255,.52);font-size:7.5pt;">${cover.firmName}</span>
  </div>
  <div style="flex:1;padding:28px 52px 24px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:8px;border-bottom:2px solid #e8f0f8;">
      <div style="background:#0d2340;color:white;font-size:8pt;font-weight:700;width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</div>
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:14pt;color:#0d2340;font-weight:700;">${s.title}</div>
    </div>
    <div style="font-size:9.5pt;line-height:1.65;color:#2a3a4a;">${s.content}</div>
  </div>
  <div style="background:#f4f6f9;border-top:1px solid #c5d4e0;padding:10px 52px;display:flex;justify-content:space-between;flex-shrink:0;">
    <span style="font-size:7.5pt;color:#5a6e80;">${cover.firmName} — Proposal</span>
    <span style="font-size:7.5pt;color:#0d2340;font-weight:700;">Page ${i+1}</span>
  </div>
</div>`

  const cleanSection = (s, i) => `
<div style="width:794px;min-height:1123px;background:white;font-family:sans-serif;margin:0 auto 24px;box-shadow:0 2px 12px rgba(0,0,0,.08);">
  <div style="height:4px;background:#111;"></div>
  <div style="padding:12px 56px;display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;">
    <span style="font-size:9pt;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">${cover.firmName} — Proposal</span>
    <span style="font-size:9pt;color:#9ca3af;">Section ${i+1}</span>
  </div>
  <div style="padding:40px 56px 32px;">
    <div style="font-size:22pt;font-weight:800;color:#111;margin-bottom:20px;">${s.title}</div>
    <div style="width:36px;height:3px;background:#111;margin-bottom:24px;"></div>
    <div style="font-size:10pt;line-height:1.7;color:#374151;">${s.content}</div>
  </div>
  <div style="padding:12px 56px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;">
    <span style="font-size:9pt;color:#9ca3af;">${cover.firmName}</span>
    <span style="font-size:9pt;font-weight:700;color:#111;">Page ${i+1}</span>
  </div>
</div>`

  const pagesHtml = isNavy
    ? navyCover + sections.map(navySection).join('')
    : sections.map(cleanSection).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Proposal — ${cover.title}</title>
${fontLink}
<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#d8dce2;padding:32px 0;}ul{padding-left:20px;}li{margin-bottom:4px;}p{margin-bottom:8px;}strong{font-weight:700;}@media print{body{background:white;padding:0;}}</style>
</head>
<body>${pagesHtml}</body>
</html>`
}

// ── Export dropdown ────────────────────────────────────────────────────────────
function ExportDropdown({ bid }) {
  const { proposalData, templateId } = useProposal()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!proposalData) return null

  function exportAsPDF() {
    setOpen(false)
    const html = buildFullHtml(proposalData, templateId, bid)
    const win = window.open('', '_blank', 'width=950,height=850')
    if (!win) return
    win.document.write(html + `<script>window.onload=function(){window.focus();window.print()}<\/script>`)
    win.document.close()
  }

  function exportAsWord() {
    setOpen(false)
    const { cover, sections } = proposalData
    const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head>
<meta charset='utf-8'>
<style>
  body{font-family:Calibri,sans-serif;font-size:11pt;line-height:1.6;color:#1c2b3a;}
  h1{font-size:20pt;color:#0d2340;margin:0 0 4pt;}
  h2{font-size:13pt;color:#0d2340;border-bottom:1pt solid #c8962a;padding-bottom:3pt;margin:24pt 0 8pt;}
  p{margin:0 0 6pt;}ul{margin:4pt 0 10pt 16pt;}li{margin:2pt 0;}
  strong{font-weight:700;color:#0d2340;}.meta{color:#5a6e80;font-size:9pt;margin-bottom:24pt;}
</style></head><body>
<h1>${cover.title}</h1>
<p class="meta">Submitted to ${cover.agency}&nbsp;·&nbsp;${cover.date}&nbsp;·&nbsp;${cover.firmName}</p>
${sections.map(s => `<h2>${s.title}</h2>${s.content}`).join('')}
</body></html>`

    const blob = new Blob(['﻿' + wordHtml], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proposal-${bid.id}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="btn-secondary py-1.5 text-xs"
      >
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16">
          <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Export
        <svg width="10" height="10" fill="none" viewBox="0 0 10 10" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-float py-1.5 min-w-[168px] z-50 animate-fade-in">
          <button
            onClick={exportAsPDF}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="#EF4444" strokeWidth="1.3"/>
              <path d="M5 6h3M5 9h6M5 11.5h4" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <div className="text-left">
              <p className="font-semibold">Download as PDF</p>
              <p className="text-[9px] text-gray-400">Via browser print</p>
            </div>
          </button>
          <button
            onClick={exportAsWord}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="#2563EB" strokeWidth="1.3"/>
              <path d="M5 6l1.5 5L8 7l1.5 4L11 6" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-left">
              <p className="font-semibold">Download as Word</p>
              <p className="text-[9px] text-gray-400">Opens in Microsoft Word</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

// ── Layout ─────────────────────────────────────────────────────────────────────
function ProposalLayout({ bid, profile }) {
  const navigate = useNavigate()
  const { proposalData } = useProposal()

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur border-b border-gray-100 px-4 h-12 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate(`/bids/${bid.id}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-dark transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Bid Details
          </button>
          <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
          <p className="text-sm font-semibold text-dark truncate">{bid.title}</p>
          <Badge variant="open" className="flex-shrink-0">Proposal Draft</Badge>

          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <TemplateSwitcher />
            <ExportDropdown bid={bid} />
            <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              AI ready
            </div>
          </div>
        </header>

        {/* Split-screen */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT — A4 canvas */}
          <div className="flex flex-col overflow-hidden" style={{ width: '62%' }}>
            <div className="px-3 py-2 border-b border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 16 16">
                <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 5h6M5 8h4M5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-semibold text-dark">A4 Document</span>
              {proposalData && (
                <span className="text-[10px] text-gray-400">
                  · {bid.agency}
                  {bid.documents?.length > 0 && ` · ${bid.documents.length} doc${bid.documents.length > 1 ? 's' : ''} analysed`}
                </span>
              )}
              <span className="ml-auto text-[10px] text-gray-400">Click text to edit · Select → AI rewrite</span>
            </div>
            <ProposalCanvas bid={bid} />
          </div>

          {/* RIGHT — AI panel */}
          <div className="flex flex-col overflow-hidden" style={{ width: '38%' }}>
            <AIChatPanel bid={bid} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ProposalPage() {
  const { bidId } = useParams()
  const navigate = useNavigate()
  const { bids } = useBids()
  const { profile } = useUserProfile()
  const bid = bids.find(b => b.id === bidId)

  if (!bid) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">Bid not found.</p>
          <button onClick={() => navigate('/bids')} className="btn-primary text-sm">Browse Bids</button>
        </div>
      </div>
    )
  }

  return (
    <ProposalProvider>
      <ProposalLayout bid={bid} profile={profile} />
    </ProposalProvider>
  )
}
