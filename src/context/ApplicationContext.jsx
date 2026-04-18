import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DOCUMENT_FIELDS, AUTO_FILL_ANSWERS } from '../data/mockFormFields'
import { BIDS } from '../data/mockBids'

const ApplicationContext = createContext(null)
const STORAGE_KEY = 'civicbid_applications'

// Seed with auto-filled prototype data
const SEED_DATA = {
  'event-4125': {
    status: 'draft',
    startedAt: '2026-04-10T09:00:00Z',
    lastUpdated: '2026-04-17T14:30:00Z',
    documents: {
      doc1: { answers: AUTO_FILL_ANSWERS['event-4125'].doc1, totalFields: 8, answeredCount: 6 },
      doc2: { answers: AUTO_FILL_ANSWERS['event-4125'].doc2, totalFields: 5, answeredCount: 5 },
    },
  },
  'event-4126': {
    status: 'applied',
    startedAt: '2026-04-13T10:00:00Z',
    lastUpdated: '2026-04-16T11:00:00Z',
    submittedAt: '2026-04-16T11:00:00Z',
    documents: {
      doc1: { answers: AUTO_FILL_ANSWERS['event-4126'].doc1, totalFields: 5, answeredCount: 5 },
      doc2: { answers: AUTO_FILL_ANSWERS['event-4126'].doc2, totalFields: 4, answeredCount: 4 },
    },
  },
  'event-4129': {
    status: 'approved',
    startedAt: '2026-04-05T08:00:00Z',
    lastUpdated: '2026-04-14T15:00:00Z',
    submittedAt: '2026-04-14T15:00:00Z',
    documents: {
      doc1: { answers: { f1: 'Abdullahi Engineering LLC', f2: '148000', f3: true, f4: true }, totalFields: 4, answeredCount: 4 },
      doc2: { answers: { g1: 'Abdullahi Engineering LLC', g2: 'Moha Abdullahi', g3: '04/14/2026', g4: 'BC-204871' }, totalFields: 4, answeredCount: 4 },
    },
  },
  'event-4127': {
    status: 'rejected',
    startedAt: '2026-04-09T09:00:00Z',
    lastUpdated: '2026-04-15T10:00:00Z',
    submittedAt: '2026-04-15T10:00:00Z',
    documents: {
      doc1: { answers: { f1: 'Abdullahi Engineering LLC', f2: '275000', f3: true }, totalFields: 5, answeredCount: 3 },
      doc2: { answers: { g1: 'Abdullahi Engineering LLC' }, totalFields: 4, answeredCount: 1 },
    },
  },
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return SEED_DATA
}

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const startApplication = useCallback((bidId) => {
    setApplications(prev => {
      if (prev[bidId]) return prev
      return {
        ...prev,
        [bidId]: {
          status: 'draft',
          startedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          documents: {},
        },
      }
    })
  }, [])

  const saveDocAnswers = useCallback((bidId, docId, answers, totalFields) => {
    const answeredCount = Object.entries(answers).filter(([, v]) =>
      v !== undefined && v !== '' && v !== null
    ).length
    setApplications(prev => ({
      ...prev,
      [bidId]: {
        ...prev[bidId],
        status: prev[bidId]?.status === 'applied' ? 'applied' : 'draft',
        lastUpdated: new Date().toISOString(),
        documents: {
          ...prev[bidId]?.documents,
          [docId]: { answers, totalFields, answeredCount },
        },
      },
    }))
  }, [])

  const completeApplication = useCallback((bidId) => {
    setApplications(prev => ({
      ...prev,
      [bidId]: { ...prev[bidId], status: 'completed', lastUpdated: new Date().toISOString() },
    }))
  }, [])

  const submitApplication = useCallback((bidId) => {
    setApplications(prev => ({
      ...prev,
      [bidId]: {
        ...prev[bidId],
        status: 'applied',
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    }))
  }, [])

  const updateStatus = useCallback((bidId, status) => {
    setApplications(prev => ({
      ...prev,
      [bidId]: { ...prev[bidId], status, lastUpdated: new Date().toISOString() },
    }))
  }, [])

  // Overall % for a bid across all docs
  const getBidProgress = useCallback((bidId) => {
    const app = applications[bidId]
    if (!app?.documents) return 0
    const docs = Object.values(app.documents)
    if (!docs.length) return 0
    const answered = docs.reduce((s, d) => s + (d.answeredCount || 0), 0)
    const total = docs.reduce((s, d) => s + (d.totalFields || 0), 0)
    return total ? Math.round((answered / total) * 100) : 0
  }, [applications])

  const getDocProgress = useCallback((bidId, docId) => {
    const doc = applications[bidId]?.documents?.[docId]
    if (!doc || !doc.totalFields) return 0
    return Math.round(((doc.answeredCount || 0) / doc.totalFields) * 100)
  }, [applications])

  const getDocAnswers = useCallback((bidId, docId) => {
    return applications[bidId]?.documents?.[docId]?.answers || {}
  }, [applications])

  const appliedBidIds = Object.keys(applications)

  return (
    <ApplicationContext.Provider value={{
      applications,
      appliedBidIds,
      startApplication,
      saveDocAnswers,
      completeApplication,
      submitApplication,
      updateStatus,
      getBidProgress,
      getDocProgress,
      getDocAnswers,
    }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplications() {
  return useContext(ApplicationContext)
}
