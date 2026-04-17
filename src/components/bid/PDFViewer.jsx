import { useEffect, useRef, useState } from 'react'
import { Spinner } from '../ui/Spinner'

let pdfjsLib = null
async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()
  pdfjsLib = pdfjs
  return pdfjs
}

/* Convert annotation rect (PDF space) → CSS px relative to canvas */
function rectToScreen(rect, viewport) {
  const [x1, y1, x2, y2] = rect
  // PDF y grows upward; viewport y grows downward
  const [sx1, sy1] = viewport.convertToViewportPoint(x1, y2) // top-left
  const [sx2, sy2] = viewport.convertToViewportPoint(x2, y1) // bottom-right
  return {
    left: Math.round(Math.min(sx1, sx2)),
    top: Math.round(Math.min(sy1, sy2)),
    width: Math.round(Math.abs(sx2 - sx1)),
    height: Math.round(Math.abs(sy2 - sy1)),
  }
}

/* Single field overlay rendered on top of the PDF canvas */
function FieldOverlay({ rect, displayValue, fieldType }) {
  const text =
    fieldType === 'boolean'
      ? displayValue === true || displayValue === 'Yes' ? '✓  Yes' : '✗  No'
      : fieldType === 'file'
      ? typeof displayValue === 'object' ? `📎 ${displayValue.name}` : '📎 Attached'
      : String(displayValue)

  const fontSize = Math.min(Math.max(rect.height * 0.52, 9), 13)

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: rect.left, top: rect.top, width: Math.max(rect.width, 80), height: Math.max(rect.height, 18), zIndex: 20 }}
    >
      {/* Highlight background */}
      <div
        className="w-full h-full rounded-sm flex items-center px-1.5 overflow-hidden"
        style={{
          background: 'rgba(245,184,0,0.22)',
          border: '1.5px solid rgba(245,184,0,0.75)',
          animation: 'overlay-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: fontSize + 'px',
            color: '#1A1A1A',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            width: '100%',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  )
}

export function PDFViewer({ pdfUrl, fieldOverlays = [] }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [viewport, setViewport] = useState(null)
  const [annotations, setAnnotations] = useState([])
  const renderTaskRef = useRef(null)

  /* Load document */
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPdfjs()
      .then(pdfjs => pdfjs.getDocument(pdfUrl).promise)
      .then(doc => {
        if (!cancelled) { setPdfDoc(doc); setNumPages(doc.numPages); setCurrentPage(1); setLoading(false) }
      })
      .catch(() => { if (!cancelled) { setError('Failed to load PDF.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [pdfUrl])

  /* Render page + collect Widget annotations */
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return
    let cancelled = false

    async function render() {
      const page = await pdfDoc.getPage(currentPage)
      if (cancelled) return

      const vp = page.getViewport({ scale })
      const canvas = canvasRef.current
      canvas.width = vp.width
      canvas.height = vp.height

      if (renderTaskRef.current) renderTaskRef.current.cancel()
      renderTaskRef.current = page.render({ canvasContext: canvas.getContext('2d'), viewport: vp })
      try { await renderTaskRef.current.promise } catch { return }
      if (cancelled) return

      // Collect sorted form-field annotations for overlay positioning
      try {
        const annots = await page.getAnnotations()
        const widgets = annots
          .filter(a => a.subtype === 'Widget' && a.rect)
          .sort((a, b) => b.rect[3] - a.rect[3]) // top of PDF first (higher y2 = higher on page)
        if (!cancelled) { setAnnotations(widgets); setViewport(vp) }
      } catch { /* no annotations */ }
    }

    render()
    return () => { cancelled = true }
  }, [pdfDoc, currentPage, scale])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <Spinner size="lg" /><p className="text-sm">Loading PDF…</p>
    </div>
  )
  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <span className="text-2xl">⚠️</span><p className="text-sm text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white flex-shrink-0 gap-2">
        {/* Page nav */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 text-xs">‹</button>
          <span className="text-xs text-gray-500 font-medium"><b className="text-dark">{currentPage}</b>/{numPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage === numPages}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 text-xs">›</button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button onClick={() => setScale(s => Math.max(0.7, +(s - 0.15).toFixed(2)))}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-bold">−</button>
          <span className="text-[11px] text-gray-500 w-8 text-center font-medium">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(2.5, +(s + 0.15).toFixed(2)))}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-bold">+</button>
        </div>

        {/* Filled fields indicator */}
        {fieldOverlays.filter(Boolean).length > 0 && (
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-bold text-primary-dark">
              ✓ {fieldOverlays.filter(Boolean).length} field{fieldOverlays.filter(Boolean).length !== 1 ? 's' : ''} filled
            </span>
          </div>
        )}

        {/* Download */}
        <a href={pdfUrl} download className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary-dark rounded-lg text-[11px] font-semibold hover:bg-primary/20 transition-colors">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14"><path d="M7 1v8M4.5 6.5l2.5 2.5 2.5-2.5M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Download
        </a>
      </div>

      {/* Canvas + overlays */}
      <div className="flex-1 overflow-auto bg-gray-100 p-3 flex justify-center min-h-0">
        {/* Wrapper — position:relative so overlays are anchored to canvas */}
        <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start' }}>
          <canvas ref={canvasRef} className="pdf-page-canvas" />

          {/* Overlay layer */}
          {viewport && fieldOverlays.map((overlay, idx) => {
            if (!overlay) return null
            const annot = annotations[idx]
            if (!annot) return null
            const rect = rectToScreen(annot.rect, viewport)
            return (
              <FieldOverlay
                key={`${idx}-${overlay.displayValue}`}
                rect={rect}
                displayValue={overlay.displayValue}
                fieldType={overlay.fieldType}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
