import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { format, parseISO } from 'date-fns'
import { useToast } from '../context/ToastContext'

const ADMIN_STATS = [
  { label: 'Total Posted', value: '6', icon: '📋', color: 'bg-blue-50', delta: 'All time' },
  { label: 'Active Bids', value: '5', icon: '🟢', color: 'bg-green-50', delta: 'Currently open' },
  { label: 'Applications', value: '23', icon: '📥', color: 'bg-purple-50', delta: 'This month' },
  { label: 'Avg. Budget', value: '$194K', icon: '💰', color: 'bg-yellow-50', delta: 'Per bid' },
]

const STATUS_VARIANT = { open: 'open', urgent: 'urgent', closed: 'closed', awarded: 'awarded' }

export default function AdminDashboardPage() {
  const { bids, deleteBid, updateBid } = useBids()
  const navigate = useNavigate()
  const { addToast } = useToast()

  function handleDelete(id, title) {
    if (confirm(`Delete "${title}"?`)) {
      deleteBid(id)
      addToast({ message: `Bid "${title}" deleted`, type: 'success' })
    }
  }

  function handleToggleStatus(bid) {
    const newStatus = bid.status === 'open' ? 'closed' : 'open'
    updateBid(bid.id, { status: newStatus })
    addToast({ message: `Bid status changed to ${newStatus}`, type: 'info' })
  }

  return (
    <Layout title="Admin Overview" subtitle="Manage and monitor all posted bids">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {ADMIN_STATS.map(s => (
          <div key={s.label} className="glass-card p-4">
            <span className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-lg mb-2`}>{s.icon}</span>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="font-heading font-bold text-2xl text-dark">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => navigate('/admin/create')} className="btn-primary py-2.5 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Post New Bid
        </button>
        <button onClick={() => navigate('/admin/bids')} className="btn-secondary py-2.5 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Manage All Bids
        </button>
      </div>

      {/* Bids table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-dark text-sm">All Posted Bids</h2>
          <span className="text-xs text-gray-400">{bids.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Title', 'Agency', 'Deadline', 'Budget', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bids.map(bid => (
                <tr key={bid.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-dark text-xs leading-snug max-w-[200px]">{bid.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{bid.category}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[140px]">{bid.agency}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                    {format(parseISO(bid.deadline), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-dark whitespace-nowrap">{bid.budget || '—'}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STATUS_VARIANT[bid.status] || 'gray'}>
                      {bid.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/bids/${bid.id}`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/edit/${bid.id}`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(bid)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        {bid.status === 'open' ? 'Close' : 'Open'}
                      </button>
                      <button
                        onClick={() => handleDelete(bid.id, bid.title)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
