import { Layout } from '../components/layout/Layout'
import { BidCard } from '../components/dashboard/BidCard'
import { useBids } from '../context/BidContext'
import { useAuth } from '../context/AuthContext'
import { BID_CATEGORIES } from '../data/mockBids'

const STAT_CARDS = [
  { label: 'Active Bids', value: '6', delta: '+3 this week', icon: '📋', color: 'bg-blue-50', textColor: 'text-blue-600' },
  { label: 'Due in 14 days', value: '4', delta: '⚑ Next: May 2', icon: '⏰', color: 'bg-red-50', textColor: 'text-red-500' },
  { label: 'Proposals Drafted', value: '7', delta: '2 in review', icon: '✍️', color: 'bg-green-50', textColor: 'text-green-600' },
  { label: 'Win Rate (YTD)', value: '38%', delta: '+5% vs last yr', icon: '🏆', color: 'bg-yellow-50', textColor: 'text-yellow-600' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { filteredBids, filterCategory, setFilterCategory, filterStatus, setFilterStatus } = useBids()

  return (
    <Layout title="Dashboard" subtitle={`Welcome back, ${user?.name}`}>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-start justify-between mb-2">
              <span className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-lg`}>{s.icon}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`font-heading font-bold text-2xl text-dark mb-1`}>{s.value}</p>
            <p className={`text-xs font-medium ${s.textColor}`}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {BID_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-primary text-dark shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {['All', 'open', 'urgent'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filterStatus === s
                  ? 'bg-primary text-dark shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 ml-auto">{filteredBids.length} bid{filteredBids.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Bid grid */}
      {filteredBids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📭</div>
          <h3 className="font-heading font-semibold text-dark text-lg mb-1">No bids found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBids.map(bid => (
            <BidCard key={bid.id} bid={bid} />
          ))}
        </div>
      )}
    </Layout>
  )
}
