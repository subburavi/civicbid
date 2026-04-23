import { useEffect, useRef } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY   = '#0d2340'
const BLUE   = '#1a4a7a'
const ACCENT = '#c8962a'
const LIGHT  = '#e8f0f8'
const GRAY   = '#f4f6f9'
const TEXT   = '#1c2b3a'
const MUTED  = '#5a6e80'
const BORDER = '#c5d4e0'
const WHITE  = '#ffffff'

// A4 at 96 dpi
export const PAGE_W = 794
export const PAGE_H = 1123

// ─── Editable primitives ─────────────────────────────────────────────────────

function ET({ value, onChange, style, block = false }) {
  // EditableText: single-line plain text
  const Tag = block ? 'div' : 'span'
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onChange(e.currentTarget.innerText)}
      style={{ outline: 'none', cursor: 'text', whiteSpace: block ? 'pre-wrap' : 'normal', ...style }}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  )
}

function EditableRich({ html, sectionId, version, onUpdate }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html || ''
  }, [version])  // only re-sync when AI edits (version bumps)

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-section-id={sectionId}
      onBlur={e => onUpdate(sectionId, e.currentTarget.innerHTML)}
      style={{
        outline: 'none',
        cursor: 'text',
        fontSize: '9.5pt',
        lineHeight: 1.65,
        color: '#2a3a4a',
        minHeight: 40,
        fontFamily: "'Source Sans 3','Segoe UI',sans-serif",
      }}
    />
  )
}

// ─── Cover Page ───────────────────────────────────────────────────────────────
function CoverPage({ cover, onField }) {
  const f = k => v => onField(`cover.${k}`, v)
  const fc = k => v => onField(`cover.contact.${k}`, v)

  return (
    <div style={{
      width: PAGE_W, height: PAGE_H,
      background: NAVY, position: 'relative', overflow: 'hidden',
      flexShrink: 0, fontFamily: "'Source Sans 3','Segoe UI',sans-serif",
    }}>
      {/* Left gold bar */}
      <div style={{ position:'absolute', top:0, left:0, width:11, height:'100%', background:ACCENT }} />

      {/* Right geo shape */}
      <div style={{
        position:'absolute', top:0, right:0, width:336, height:'100%',
        background:`linear-gradient(160deg,${BLUE} 0%,${NAVY} 100%)`,
        clipPath:'polygon(30% 0%,100% 0%,100% 100%,0% 100%)',
      }} />

      {/* Bottom diagonal tint */}
      <div style={{
        position:'absolute', bottom:0, left:0, width:'100%', height:240,
        background:'rgba(200,150,42,0.07)',
        clipPath:'polygon(0% 100%,100% 38%,100% 100%)',
      }} />

      {/* Main content */}
      <div style={{ position:'relative', zIndex:2, padding:'53px 72px 0' }}>

        {/* Logo row */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:34 }}>
          <div style={{
            width:43, height:43, background:ACCENT, flexShrink:0,
            clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:WHITE, fontWeight:700, fontSize:18, fontFamily:'Georgia,serif' }}>
              {(cover.firmName || 'V').charAt(0)}
            </span>
          </div>
          <div>
            <div style={{ color:WHITE, fontSize:13, fontWeight:600, letterSpacing:'0.04em' }}>
              <ET value={cover.firmName} onChange={f('firmName')} />
            </div>
            <div style={{ color:'rgba(255,255,255,0.58)', fontSize:7.5, letterSpacing:'0.12em', textTransform:'uppercase' }}>
              <ET value={cover.firmTagline} onChange={f('firmTagline')} />
            </div>
          </div>
        </div>

        {/* Gold tag badge */}
        <div style={{ background:ACCENT, color:WHITE, fontSize:7.5, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 14px', display:'inline-block', marginBottom:24 }}>
          <ET value={cover.proposalTag} onChange={f('proposalTag')} />
        </div>

        {/* Main title */}
        <div style={{ color:WHITE, fontFamily:"'Playfair Display',Georgia,serif", fontSize:28, lineHeight:1.2, marginBottom:12, maxWidth:430 }}>
          <ET value={cover.title} onChange={f('title')} block />
        </div>

        {/* Subtitle */}
        <div style={{ color:'rgba(255,255,255,0.72)', fontSize:13, fontWeight:300, marginBottom:16 }}>
          <ET value={cover.subtitle} onChange={f('subtitle')} />
        </div>

        {/* Project ID */}
        <div style={{ color:ACCENT, fontSize:9, letterSpacing:'0.08em', fontWeight:600 }}>
          <ET value={cover.projectId} onChange={f('projectId')} />
        </div>

        {/* Gold divider */}
        <div style={{ width:58, height:2, background:ACCENT, margin:'22px 0' }} />

        {/* Details grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px 22px', maxWidth:410 }}>
          {[
            ['Submitted To',   cover.agency,           f('agency')],
            ['Submission Date',cover.date,              f('date')],
            ['Contact Person', cover.contact?.name,     fc('name')],
            ['Contact Phone',  cover.contact?.phone,    fc('phone')],
            ['Firm Address',   cover.contact?.address,  fc('address')],
            ['Email',          cover.contact?.email,    fc('email')],
          ].map(([label, val, onChange]) => (
            <div key={label}>
              <div style={{ color:'rgba(255,255,255,0.48)', fontSize:7, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:2 }}>
                {label}
              </div>
              <div style={{ color:WHITE, fontSize:9.5, fontWeight:500 }}>
                <ET value={val || ''} onChange={onChange} block />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 72px',
        borderTop:'1px solid rgba(255,255,255,0.1)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        zIndex:2,
      }}>
        <span style={{ color:'rgba(255,255,255,0.42)', fontSize:7.5, fontFamily:"'Source Sans 3',sans-serif" }}>
          Qualifications-Based Selection (QBS) Process
        </span>
        <span style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.68)', fontSize:7, padding:'5px 12px', letterSpacing:'0.06em', fontFamily:"'Source Sans 3',sans-serif" }}>
          PROPOSAL VALID 180 DAYS
        </span>
      </div>
    </div>
  )
}

// ─── Content Page ─────────────────────────────────────────────────────────────
function ContentPage({ section, idx, firmName, sectionVersion, onContentUpdate }) {
  return (
    <div style={{
      width: PAGE_W, minHeight: PAGE_H,
      background: WHITE,
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
      fontFamily: "'Source Sans 3','Segoe UI',sans-serif",
    }}>
      {/* Page header */}
      <div style={{
        background: NAVY, padding: '14px 52px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `3px solid ${ACCENT}`, flexShrink: 0,
      }}>
        <span style={{ color: WHITE, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Proposal — Section {idx + 1}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.52)', fontSize: 7.5 }}>{firmName}</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '28px 52px 24px' }}>
        {/* Section heading row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 18, paddingBottom: 8,
          borderBottom: `2px solid ${LIGHT}`,
        }}>
          <div style={{
            background: NAVY, color: WHITE, fontSize: 8, fontWeight: 700,
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {idx + 1}
          </div>
          <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 14, color: NAVY, fontWeight: 700 }}>
            {section.title}
          </div>
        </div>

        {/* Editable rich-text body */}
        <EditableRich
          html={section.content}
          sectionId={section.id}
          version={sectionVersion}
          onUpdate={onContentUpdate}
        />
      </div>

      {/* Page footer */}
      <div style={{
        background: GRAY, borderTop: `1px solid ${BORDER}`,
        padding: '10px 52px',
        display: 'flex', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 7.5, color: MUTED }}>{firmName} — Proposal</span>
        <span style={{ fontSize: 7.5, color: NAVY, fontWeight: 700 }}>Page {idx + 1}</span>
      </div>
    </div>
  )
}

// ─── Template root ────────────────────────────────────────────────────────────
export default function TemplateNavy({ data, onFieldChange, onContentUpdate, sectionVersions }) {
  // Load fonts
  useEffect(() => {
    const id = 'proposal-navy-font'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap'
    document.head.appendChild(link)
  }, [])

  const firmName = data.cover?.firmName || 'Firm'

  return (
    <>
      <CoverPage cover={data.cover || {}} onField={onFieldChange} />
      {(data.sections || []).map((section, idx) => (
        <ContentPage
          key={section.id}
          section={section}
          idx={idx}
          firmName={firmName}
          sectionVersion={sectionVersions?.[section.id] ?? 0}
          onContentUpdate={onContentUpdate}
        />
      ))}
    </>
  )
}
