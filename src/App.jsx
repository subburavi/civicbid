import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BidProvider } from './context/BidContext'
import { ToastProvider } from './context/ToastContext'
import { ApplicationProvider } from './context/ApplicationContext'
import { UserProfileProvider } from './context/UserProfileContext'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BrowseBidsPage from './pages/BrowseBidsPage'
import BidDetailPage from './pages/BidDetailPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import MyProjectsPage from './pages/MyProjectsPage'
import ProfilePage from './pages/ProfilePage'
import BillingPage from './pages/BillingPage'
import SettingsPage from './pages/SettingsPage'
import BookmarksPage from './pages/BookmarksPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CreateBidPage from './pages/CreateBidPage'
import ManageBidsPage from './pages/ManageBidsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProposalPage from './pages/ProposalPage'
import LandingPage from './pages/LandingPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <UserProfileProvider userEmail={user?.email}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage />} />

        {/* User routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/bids" element={<ProtectedRoute><BrowseBidsPage /></ProtectedRoute>} />
        <Route path="/bids/:id" element={<ProtectedRoute><BidDetailPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
        <Route path="/applications/:bidId" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
        <Route path="/proposals/:bidId" element={<ProtectedRoute><ProposalPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><MyProjectsPage /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/create" element={<ProtectedRoute adminOnly><CreateBidPage /></ProtectedRoute>} />
        <Route path="/admin/bids" element={<ProtectedRoute adminOnly><ManageBidsPage /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute adminOnly><CreateBidPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />

        <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserProfileProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BidProvider>
          <ApplicationProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ApplicationProvider>
        </BidProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
