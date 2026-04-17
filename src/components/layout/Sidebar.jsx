import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const USER_NAV = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: 'Browse Bids',
    to: '/bids',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    badge: 6,
  },
  {
    label: 'My Applications',
    to: '/applications',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 7h6M7 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Deadlines',
    to: '/deadlines',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    badge: 4,
    badgeColor: 'bg-red-500',
  },
]

const ADMIN_NAV = [
  {
    label: 'Admin Overview',
    to: '/admin',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: 'Post New Bid',
    to: '/admin/create',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Manage Bids',
    to: '/admin/bids',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    to: '/admin/analytics',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
        <path d="M4 14l4-5 3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const nav = isAdmin ? ADMIN_NAV : USER_NAV

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen overflow-hidden sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
              <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </div>
          <span className="font-heading font-bold text-dark text-lg">CivicBid</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 font-medium">MN Government Procurement</p>
      </div>

      {/* Role indicator */}
      {isAdmin && (
        <div className="mx-3 mt-3 px-3 py-2 bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-xs font-semibold text-primary-dark flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14c0-2.8 2.2-5 5-5s5 2.2 5 5H3z" />
            </svg>
            Admin Portal
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
          {isAdmin ? 'Administration' : 'Main Menu'}
        </p>
        <div className="flex flex-col gap-0.5">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/dashboard'}
              className={({ isActive }) =>
                clsx('sidebar-link', isActive ? 'active' : '')
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full',
                    item.badgeColor || 'bg-primary-dark'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {!isAdmin && (
          <>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mt-5 mb-2">Tools</p>
            <NavLink
              to="/bids"
              className={({ isActive }) => clsx('sidebar-link', isActive ? 'active' : '')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Search Bids
            </NavLink>
          </>
        )}
      </nav>

      {/* User card */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-dark flex-shrink-0">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role} account</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
              <path d="M13 3h4v14h-4M9 14l4-4-4-4M13 10H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
