import { createContext, useContext, useState, useEffect } from 'react'

const UserProfileContext = createContext(null)
const STORAGE_KEY = 'civicbid_profile'

const DEFAULT_PROFILES = {
  'user@civicbid.com': {
    companyName: 'Abdullahi Engineering LLC',
    phone: '(612) 555-0199',
    licenseNumber: 'BC-204871',
    address: '1200 Nicollet Mall, Minneapolis, MN 55403',
    website: 'abdullahieng.com',
    founded: '2018',
    bio: 'Minority-owned civil engineering firm specialising in public infrastructure, landscaping, and transportation projects across the Twin Cities metro.',
    interestedCategories: ['Landscaping', 'Transportation', 'Environmental'],
    teamMembers: [
      { id: '1', name: 'Amina Abdullahi', designation: 'Principal Engineer', role: 'Admin' },
      { id: '2', name: 'Marcus Lee',      designation: 'Project Manager',    role: 'Member' },
    ],
    recentProjects: [
      { id: 'p1', name: 'Lake Street Median Planting', client: 'City of Minneapolis', year: '2024', value: '$38,000', category: 'Landscaping', description: 'Installed native plantings and irrigation along Lake Street median from Hiawatha to Cedar Ave.' },
      { id: 'p2', name: 'I-35W Slope Stabilisation', client: 'MnDOT', year: '2023', value: '$125,000', category: 'Transportation', description: 'Erosion control and slope stabilisation work along I-35W corridor near downtown Minneapolis.' },
    ],
  },
  'demo@civicbid.com': {
    companyName: 'Demo Construction Co.',
    phone: '(651) 555-0100',
    licenseNumber: '',
    address: '',
    website: '',
    founded: '',
    bio: '',
    interestedCategories: ['Construction', 'Accessibility'],
    teamMembers: [],
    recentProjects: [],
  },
}

function loadProfile(email) {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${email}`)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_PROFILES[email] || {
    companyName: '', phone: '', licenseNumber: '',
    address: '', website: '', founded: '', bio: '',
    interestedCategories: [], teamMembers: [], recentProjects: [],
  }
}

export function UserProfileProvider({ children, userEmail }) {
  const [profile, setProfile] = useState(() => loadProfile(userEmail))

  useEffect(() => {
    if (userEmail) setProfile(loadProfile(userEmail))
  }, [userEmail])

  useEffect(() => {
    if (userEmail) localStorage.setItem(`${STORAGE_KEY}_${userEmail}`, JSON.stringify(profile))
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

  function addTeamMember(member) {
    setProfile(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), { ...member, id: Date.now().toString() }],
    }))
  }

  function removeTeamMember(id) {
    setProfile(prev => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter(m => m.id !== id),
    }))
  }

  function addProject(project) {
    setProfile(prev => ({
      ...prev,
      recentProjects: [...(prev.recentProjects || []), { ...project, id: Date.now().toString() }],
    }))
  }

  function removeProject(id) {
    setProfile(prev => ({
      ...prev,
      recentProjects: (prev.recentProjects || []).filter(p => p.id !== id),
    }))
  }

  function updateProject(id, updates) {
    setProfile(prev => ({
      ...prev,
      recentProjects: (prev.recentProjects || []).map(p => p.id === id ? { ...p, ...updates } : p),
    }))
  }

  return (
    <UserProfileContext.Provider value={{
      profile, updateProfile, toggleCategory,
      addTeamMember, removeTeamMember,
      addProject, removeProject, updateProject,
    }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  return useContext(UserProfileContext)
}
