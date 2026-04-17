import { useAuth } from '../../context/AuthContext'
import { useBids } from '../../context/BidContext'

export function Topbar({ title, subtitle }) {
  const { user } = useAuth()
  const { searchQuery, setSearchQuery } = useBids()

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 px-6 h-14 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-heading font-semibold text-dark text-base leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 20 20"
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search bids..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-52 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 0 0-6 6v2l-1.5 3h15L16 10V8a6 6 0 0 0-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-dark">
          {user?.avatar}
        </div>
      </div>
    </header>
  )
}
