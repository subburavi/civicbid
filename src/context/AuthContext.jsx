import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
  { id: 1, email: 'admin@civicbid.com', password: 'admin123', role: 'admin', name: 'Admin User', avatar: 'AU' },
  { id: 2, email: 'user@civicbid.com', password: 'user123', role: 'user', name: 'Moha Abdullahi', avatar: 'MA' },
  { id: 3, email: 'demo@civicbid.com', password: 'demo123', role: 'user', name: 'Demo User', avatar: 'DU' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')

  function login(email, password) {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      setLoginError('')
      return true
    }
    setLoginError('Invalid email or password')
    return false
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
