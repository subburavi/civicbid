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
  const [registeredUsers, setRegisteredUsers] = useState([])

  function login(email, password) {
    const allUsers = [...MOCK_USERS, ...registeredUsers]
    const found = allUsers.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      setLoginError('')
      return true
    }
    setLoginError('Invalid email or password')
    return false
  }

  function register({ name, email, password, company, phone, categories }) {
    const newUser = {
      id: Date.now(),
      email,
      password,
      role: 'user',
      name,
      avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      company,
      phone,
      categories,
    }
    setRegisteredUsers(prev => [...prev, newUser])
    setUser(newUser)
    return true
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
