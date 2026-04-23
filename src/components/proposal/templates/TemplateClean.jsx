import { useEffect, useRef } from 'react'

export const PAGE_W = 794
export const PAGE_H = 1123

function ET({ value, onChange, style }) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onChange(e.currentTarget.innerText)}
      style={{ outline: 'none', cursor: 'text', ...style }}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  )
}

function EditableRich({ html, sectionId, version, onUpdate }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html || ''
  }, [version])

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-section-id={sectionId}
      onBlur={e => onUpdate(sectionId, e.currentTarget.innerHTML)}
      style={{ outline: 'none', cursor: 'text' }}
    />
  )
}

function TitlePage({ cover, onField }) {
  const f = k => v => onField(`cover.${k}`, v)
  return (
    <div style={{
      width: PAGE_W, minHeight: PAGE_H,
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter',sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* Top accent */}
      <div style={{ height: 6, background: '#1a1a1a', flexShrink: 0 }} />

      {/* Cover body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 20 }}>
          <ET value={cover.proposalTag} onChange={f('proposalTag')} />
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#111', lineHeight: 1.15, marginBottom: 16, maxWidth: 560 }}>
          <ET value={cover.title} onChange={f('title')} style={{ display: 'block' }} />
        </div>
        <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 400, marginBottom: 48 }}>
          <ET value={cover.subtitle} onChange={f('subtitle')} />
        </div>

        {/* Divider */}
        <div style={{ width: 48, height: 2, background: '#111', marginBottom: 40 }} />

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px', maxWidth: 420 }}>
          {[
            ['Submitted To',  cover.agency],
            ['Date',          cover.date],
            ['Contact',       cover.contact?.name],
            ['Phone',         cover.contact?.phone],
          ].map(([label, val], i) => (
            <div key={label}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#111', fontWeight: 500 }}>{val || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '18px 72px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: '#9ca3af' }}>
          <ET value={cover.firmName} onChange={f('firmName')} />
        </span>
        <span style={{ fontSize: 9, color: '#9ca3af' }}>Proposal · Cover</span>
      </div>
    </div>
  )
}

function ContentPage({ section, idx, firmName, sectionVersion, onContentUpdate }) {
  return (
    <div style={{
      width: PAGE_W, minHeight: PAGE_H,
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter',sans-serif",
    }}>
      {/* Thin top bar */}
      <div style={{ height: 4, background: '#1a1a1a', flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: '12px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {firmName} — Proposal
        </span>
        <span style={{ fontSize: 9, color: '#9ca3af' }}>Section {idx + 1}</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '40px 56px 32px' }}>
        {/* Section title */}
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20, lineHeight: 1.2 }}>
          {section.title}
        </div>
        <div style={{ width: 36, height: 3, background: '#111', marginBottom: 24 }} />

        {/* Editable content */}
        <div style={{ fontSize: '10pt', lineHeight: 1.7, color: '#374151' }}>
          <style>{`
            [data-section-id="${section.id}"] p { margin: 0 0 10px; }
            [data-section-id="${section.id}"] ul { padding-left: 20px; margin: 0 0 10px; }
            [data-section-id="${section.id}"] li { margin-bottom: 4px; }
            [data-section-id="${section.id}"] strong { font-weight: 700; color: #111; }
          `}</style>
          <EditableRich
            html={section.content}
            sectionId={section.id}
            version={sectionVersion}
            onUpdate={onContentUpdate}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 56px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: '#9ca3af' }}>{firmName}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Page {idx + 1}</span>
      </div>
    </div>
  )
}

export default function TemplateClean({ data, onFieldChange, onContentUpdate, sectionVersions }) {
  const firmName = data.cover?.firmName || 'Firm'

  return (
    <>
      <TitlePage cover={data.cover || {}} onField={onFieldChange} />
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
