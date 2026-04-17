import { Layout } from '../components/layout/Layout'
import { BidCard } from '../components/dashboard/BidCard'
import { useBids } from '../context/BidContext'
import { BID_CATEGORIES } from '../data/mockBids'

export default function BidsPage() {
  const { filteredBids, filterCategory, setFilterCategory } = useBids()

  return (
    <Layout title="Browse Bids" subtitle="All active government bid opportunities">
      <div className="flex items-center gap-2 mb-5 flex-wrap">
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
        <span className="text-xs text-gray-400 ml-auto">{filteredBids.length} results</span>
      </div>

      {filteredBids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📭</div>
          <h3 className="font-heading font-semibold text-dark text-lg mb-1">No bids found</h3>
          <p className="text-gray-500 text-sm">Try a different category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBids.map(bid => <BidCard key={bid.id} bid={bid} />)}
        </div>
      )}
    </Layout>
  )
}
