import { createContext, useContext, useState, useEffect } from 'react'

const UserProfileContext = createContext(null)
const STORAGE_KEY = 'civicbid_profile'

const DEFAULT_PROFILES = {
  'user@civicbid.com': {
    companyName: 'Abdullahi Engineering LLC',
    phone: '(612) 555-0199',
    licenseNumber: 'BC-204871',
    interestedCategories: ['Landscaping', 'Transportation', 'Environmental'],
  },
  'demo@civicbid.com': {
    companyName: 'Demo Construction Co.',
    phone: '(651) 555-0100',
    licenseNumber: '',
    interestedCategories: ['Construction', 'Accessibility'],
  },
}

function loadProfile(email) {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${email}`)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_PROFILES[email] || { companyName: '', phone: '', licenseNumber: '', interestedCategories: [] }
}

export function UserProfileProvider({ children, userEmail }) {
  const [profile, setProfile] = useState(() => loadProfile(userEmail))

  useEffect(() => {
    if (userEmail) {
      setProfile(loadProfile(userEmail))
    }
  }, [userEmail])

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`${STORAGE_KEY}_${userEmail}`, JSON.stringify(profile))
    }
  }, [profile, userEmail])

  function updateProfile(updates) {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  function toggleCategory(cat) {
    setProfile(prev => ({
      ...prev,
      interestedCategories: prev.interestedCategories.includes(cat)
        ? prev.interestedCategories.filter(c => c !== cat)
        : [...prev.interestedCategories, cat],
    }))
  }

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, toggleCategory }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  return useContext(UserProfileContext)
}
