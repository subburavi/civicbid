import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useToast } from '../context/ToastContext'
import { useState } from 'react'

const STATUS_VARIANT = { open: 'open', urgent: 'urgent', closed: 'closed', awarded: 'awarded' }

export default function ManageBidsPage() {
  const { bids, deleteBid, updateBid } = useBids()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')

  const filtered = bids.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.agency.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id, title) {
    if (confirm(`Delete "${title}"?`)) {
      deleteBid(id)
      addToast({ message: `"${title}" deleted`, type: 'success' })
    }
  }

  function handleAward(bid) {
    updateBid(bid.id, { status: 'awarded' })
    addToast({ message: `"${bid.title}" marked as Awarded`, type: 'success' })
  }

  return (
    <Layout title="Manage Bids" subtitle={`${bids.length} bids total`}>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search bids..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 w-64"
          />
        </div>
        <button onClick={() => navigate('/admin/create')} className="btn-primary py-2 text-sm">
          + Post New Bid
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Bid', 'Agency', 'Deadline', 'Budget', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bid => {
                const daysLeft = differenceInDays(parseISO(bid.deadline), new Date())
                return (
                  <tr key={bid.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        {bid.featured && <span className="text-primary text-xs mt-0.5">⭐</span>}
                        <div>
                          <p className="font-semibold text-dark text-xs leading-snug">{bid.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{bid.category} · ID: {bid.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 max-w-[130px]">{bid.agency}</td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-dark font-medium">{format(parseISO(bid.deadline), 'MMM d, yyyy')}</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${daysLeft <= 10 ? 'text-red-500' : daysLeft <= 0 ? 'text-gray-400' : 'text-gray-400'}`}>
                        {daysLeft <= 0 ? 'Past deadline' : `${daysLeft}d left`}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-dark">{bid.budget || '—'}</td>
                    <td className="px-5 py-4">
                      <Badge variant={STATUS_VARIANT[bid.status] || 'gray'}>{bid.status}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/bids/${bid.id}`)}
                          className="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >View</button>
                        <button
                          onClick={() => navigate(`/admin/edit/${bid.id}`)}
                          className="px-2 py-1 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >Edit</button>
                        {bid.status === 'open' && (
                          <button
                            onClick={() => handleAward(bid)}
                            className="px-2 py-1 text-[10px] font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >Award</button>
                        )}
                        <button
                          onClick={() => handleDelete(bid.id, bid.title)}
                          className="px-2 py-1 text-[10px] font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >Del</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No bids match your search
          </div>
        )}
      </div>
    </Layout>
  )
}
