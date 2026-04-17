import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BidProvider } from './context/BidContext'
import { ToastProvider } from './context/ToastContext'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BidsPage from './pages/BidsPage'
import BidDetailPage from './pages/BidDetailPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CreateBidPage from './pages/CreateBidPage'
import ManageBidsPage from './pages/ManageBidsPage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage />} />

      {/* User routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/bids" element={<ProtectedRoute><BidsPage /></ProtectedRoute>} />
      <Route path="/bids/:id" element={<ProtectedRoute><BidDetailPage /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/deadlines" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/create" element={<ProtectedRoute adminOnly><CreateBidPage /></ProtectedRoute>} />
      <Route path="/admin/bids" element={<ProtectedRoute adminOnly><ManageBidsPage /></ProtectedRoute>} />
      <Route path="/admin/edit/:id" element={<ProtectedRoute adminOnly><CreateBidPage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BidProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </BidProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
