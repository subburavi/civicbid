import { createContext, useContext, useState } from 'react'
import { BIDS } from '../data/mockBids'

const BidContext = createContext(null)

export function BidProvider({ children }) {
  const [bids, setBids] = useState(BIDS)
  const [selectedBid, setSelectedBid] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(['event-4128', 'event-4130'])

  function toggleBookmark(bidId) {
    setBookmarkedIds(prev =>
      prev.includes(bidId) ? prev.filter(id => id !== bidId) : [...prev, bidId]
    )
  }

  function addBid(bid) {
    const newBid = {
      ...bid,
      id: `event-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'open',
    }
    setBids(prev => [newBid, ...prev])
    return newBid
  }

  function updateBid(id, updates) {
    setBids(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)))
  }

  function deleteBid(id) {
    setBids(prev => prev.filter(b => b.id !== id))
  }

  const filteredBids = bids.filter(bid => {
    const matchCat = filterCategory === 'All' || bid.category === filterCategory
    const matchStatus = filterStatus === 'All' || bid.status === filterStatus
    const matchSearch =
      !searchQuery ||
      bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.agency.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchStatus && matchSearch
  })

  return (
    <BidContext.Provider
      value={{
        bids,
        filteredBids,
        selectedBid,
        setSelectedBid,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        addBid,
        updateBid,
        deleteBid,
        bookmarkedIds,
        toggleBookmark,
      }}
    >
      {children}
    </BidContext.Provider>
  )
}

export function useBids() {
  return useContext(BidContext)
}
