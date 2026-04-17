import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import { useToast } from '../context/ToastContext'
import { BID_CATEGORIES } from '../data/mockBids'
import { useDropzone } from 'react-dropzone'

const AGENCIES = [
  'City of Minneapolis – Public Works',
  'Hennepin County',
  'MnDOT District 3',
  'MnDOT Freight Division',
  'City of Burnsville',
  'Dakota County',
  'City of St. Paul',
  'Metro Transit',
]

function PDFUploadZone({ value, onChange }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: files => files[0] && onChange(files[0]),
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all text-center ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">📄</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-dark">{value.name}</p>
            <p className="text-xs text-gray-400">{(value.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null) }}
            className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
          >✕</button>
        </div>
      ) : (
        <>
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm font-medium text-dark mb-1">
            {isDragActive ? 'Drop your PDF here' : 'Drag & drop a PDF or click to browse'}
          </p>
          <p className="text-xs text-gray-400">PDF files only · Max 10MB</p>
        </>
      )}
    </div>
  )
}

export default function CreateBidPage() {
  const navigate = useNavigate()
  const { addBid } = useBids()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)

  const [form, setForm] = useState({
    title: '',
    agency: '',
    department: '',
    category: 'Construction',
    deadline: '',
    budget: '',
    description: '',
    requirements: '',
    buyerName: '',
    buyerTitle: '',
    buyerEmail: '',
    buyerPhone: '',
    tags: '',
    featured: false,
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const bid = {
      title: form.title,
      agency: form.agency,
      department: form.department,
      category: form.category,
      deadline: form.deadline,
      budget: form.budget,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      buyer: {
        name: form.buyerName,
        title: form.buyerTitle,
        email: form.buyerEmail,
        phone: form.buyerPhone,
      },
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: form.featured,
      pdfFile: '/sample-bid.pdf',
      pdfLabel: pdfFile ? pdfFile.name : 'bid-document.pdf',
    }

    addBid(bid)
    setLoading(false)
    addToast({ message: `Bid "${form.title}" posted successfully!`, type: 'success' })
    navigate('/admin/bids')
  }

  return (
    <Layout title="Post New Bid" subtitle="Create a new government bid opportunity">
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="glass-card p-6 mb-4">
          <h2 className="font-heading font-semibold text-dark mb-4 text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-xs">📋</span>
            Bid Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Bid Title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)} className="input-field" placeholder="e.g. Nicollet Ave Planting & Maintenance" />
            </div>
            <div>
              <label className="label">Agency *</label>
              <select required value={form.agency} onChange={e => set('agency', e.target.value)} className="input-field">
                <option value="">Select agency...</option>
                {AGENCIES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <input value={form.department} onChange={e => set('department', e.target.value)} className="input-field" placeholder="e.g. Public Works" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
                {BID_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Budget</label>
              <input value={form.budget} onChange={e => set('budget', e.target.value)} className="input-field" placeholder="e.g. $42,500" />
            </div>
            <div>
              <label className="label">Deadline *</label>
              <input required type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} className="input-field" placeholder="Construction, Minneapolis, Roads" />
            </div>
            <div className="col-span-2">
              <label className="label">Description *</label>
              <textarea required rows={4} value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" placeholder="Describe the bid scope, objectives, and key deliverables..." />
            </div>
            <div className="col-span-2">
              <label className="label">Requirements (one per line)</label>
              <textarea rows={4} value={form.requirements} onChange={e => set('requirements', e.target.value)} className="input-field resize-none" placeholder={'Prevailing Wage Agreement required\nBid deposit: 5% of total\nLicensed contractor in Minnesota'} />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-primary" />
              <label htmlFor="featured" className="text-sm font-medium text-dark cursor-pointer">Mark as Featured bid</label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-4">
          <h2 className="font-heading font-semibold text-dark mb-4 text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-xs">👤</span>
            Buyer Contact
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input required value={form.buyerName} onChange={e => set('buyerName', e.target.value)} className="input-field" placeholder="Sarah Johnson" />
            </div>
            <div>
              <label className="label">Title</label>
              <input value={form.buyerTitle} onChange={e => set('buyerTitle', e.target.value)} className="input-field" placeholder="Procurement Specialist" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input required type="email" value={form.buyerEmail} onChange={e => set('buyerEmail', e.target.value)} className="input-field" placeholder="sjohnson@agency.gov" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={form.buyerPhone} onChange={e => set('buyerPhone', e.target.value)} className="input-field" placeholder="(612) 555-0000" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="font-heading font-semibold text-dark mb-4 text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center text-xs">📄</span>
            Bid Document (PDF)
          </h2>
          <PDFUploadZone value={pdfFile} onChange={setPdfFile} />
          <p className="text-xs text-gray-400 mt-2">Upload the official bid document. If not available now, a sample PDF will be used.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2.5 px-6 text-sm"
          >
            {loading ? 'Posting...' : '📋 Post Bid'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="btn-secondary py-2.5 px-6 text-sm">
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  )
}
