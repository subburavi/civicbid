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
    proposalGenerated: true,
    documents: {
      doc1: { answers: AUTO_FILL_ANSWERS['event-4125'].doc1, totalFields: 8, answeredCount: 6 },
      doc2: { answers: AUTO_FILL_ANSWERS['event-4125'].doc2, totalFields: 5, answeredCount: 5 },
    },
    activity: [
      { id: 'a1', type: 'start',    label: 'Project opened',                          detail: 'Bid added to your workspace',                         at: '2026-04-10T09:00:00Z', tokens: 0 },
      { id: 'a2', type: 'ai_fill',  label: 'AI auto-fill completed',                  detail: 'Main Bid Form — 6 of 8 fields filled automatically',  at: '2026-04-10T09:03:00Z', tokens: 1240 },
      { id: 'a3', type: 'ai_fill',  label: 'AI auto-fill completed',                  detail: 'Call for Bids — 5 of 5 fields filled automatically',  at: '2026-04-10T09:04:00Z', tokens: 840 },
      { id: 'a4', type: 'proposal', label: 'Proposal generated with Aria',            detail: 'Full 5-section proposal created from bid documents',   at: '2026-04-17T10:15:00Z', tokens: 3240 },
      { id: 'a5', type: 'edit',     label: 'Section edited — Introduction',           detail: 'Instruction: "Make it more formal and concise"',       at: '2026-04-17T10:22:00Z', tokens: 820 },
      { id: 'a6', type: 'edit',     label: 'Section edited — Pricing',                detail: 'Instruction: "Add bullet breakdown of cost items"',    at: '2026-04-17T11:04:00Z', tokens: 810 },
      { id: 'a7', type: 'rewrite',  label: 'Inline rewrite — Scope of Work',         detail: '42-word passage rewritten: "more formal tone"',        at: '2026-04-17T11:18:00Z', tokens: 390 },
      { id: 'a8', type: 'export',   label: 'Proposal exported as PDF',               detail: 'Downloaded via browser print',                         at: '2026-04-17T14:30:00Z', tokens: 0 },
    ],
  },
  'event-4126': {
    status: 'applied',
    startedAt: '2026-04-13T10:00:00Z',
    lastUpdated: '2026-04-16T11:00:00Z',
    submittedAt: '2026-04-16T11:00:00Z',
    proposalGenerated: false,
    documents: {
      doc1: { answers: AUTO_FILL_ANSWERS['event-4126'].doc1, totalFields: 5, answeredCount: 5 },
      doc2: { answers: AUTO_FILL_ANSWERS['event-4126'].doc2, totalFields: 4, answeredCount: 4 },
    },
    activity: [
      { id: 'a1', type: 'start',   label: 'Project opened',           detail: 'Bid added to your workspace',                        at: '2026-04-13T10:00:00Z', tokens: 0 },
      { id: 'a2', type: 'ai_fill', label: 'AI auto-fill completed',   detail: 'Call for Bids — 5 of 5 fields filled automatically', at: '2026-04-13T10:02:00Z', tokens: 980 },
      { id: 'a3', type: 'ai_fill', label: 'AI auto-fill completed',   detail: 'Bid Form — 4 of 4 fields filled automatically',      at: '2026-04-13T10:03:00Z', tokens: 720 },
      { id: 'a4', type: 'submit',  label: 'Application submitted',    detail: 'Submitted directly via portal',                      at: '2026-04-16T11:00:00Z', tokens: 0 },
    ],
  },
  'event-4129': {
    status: 'approved',
    startedAt: '2026-04-05T08:00:00Z',
    lastUpdated: '2026-04-14T15:00:00Z',
    submittedAt: '2026-04-14T15:00:00Z',
    proposalGenerated: true,
    documents: {
      doc1: { answers: { f1: 'Abdullahi Engineering LLC', f2: '148000', f3: true, f4: true }, totalFields: 4, answeredCount: 4 },
      doc2: { answers: { g1: 'Abdullahi Engineering LLC', g2: 'Moha Abdullahi', g3: '04/14/2026', g4: 'BC-204871' }, totalFields: 4, answeredCount: 4 },
    },
    activity: [
      { id: 'a1', type: 'start',    label: 'Project opened',                  detail: 'Bid added to your workspace',                  at: '2026-04-05T08:00:00Z', tokens: 0 },
      { id: 'a2', type: 'ai_fill',  label: 'AI auto-fill completed',          detail: 'All documents filled automatically',           at: '2026-04-05T08:05:00Z', tokens: 1640 },
      { id: 'a3', type: 'proposal', label: 'Proposal generated with Aria',    detail: 'Full 5-section proposal created',              at: '2026-04-12T09:20:00Z', tokens: 3180 },
      { id: 'a4', type: 'edit',     label: 'Section edited — Team',           detail: 'Added project manager details',                at: '2026-04-12T09:35:00Z', tokens: 790 },
      { id: 'a5', type: 'export',   label: 'Proposal exported as Word',       detail: 'Downloaded as .doc file',                      at: '2026-04-14T14:50:00Z', tokens: 0 },
      { id: 'a6', type: 'submit',   label: 'Application submitted',           detail: 'Submitted with proposal attached',             at: '2026-04-14T15:00:00Z', tokens: 0 },
      { id: 'a7', type: 'status',   label: 'Status updated — Approved',       detail: 'Congratulations! Bid awarded.',                at: '2026-04-18T10:00:00Z', tokens: 0 },
    ],
  },
  'event-4127': {
    status: 'rejected',
    startedAt: '2026-04-09T09:00:00Z',
    lastUpdated: '2026-04-15T10:00:00Z',
    submittedAt: '2026-04-15T10:00:00Z',
    proposalGenerated: false,
    documents: {
      doc1: { answers: { f1: 'Abdullahi Engineering LLC', f2: '275000', f3: true }, totalFields: 5, answeredCount: 3 },
      doc2: { answers: { g1: 'Abdullahi Engineering LLC' }, totalFields: 4, answeredCount: 1 },
    },
    activity: [
      { id: 'a1', type: 'start',   label: 'Project opened',         detail: 'Bid added to your workspace', at: '2026-04-09T09:00:00Z', tokens: 0 },
      { id: 'a2', type: 'ai_fill', label: 'Partial AI auto-fill',   detail: '4 of 9 fields filled — 5 fields could not be auto-detected', at: '2026-04-09T09:04:00Z', tokens: 620 },
      { id: 'a3', type: 'submit',  label: 'Application submitted',  detail: 'Submitted without proposal — manual entry completed', at: '2026-04-15T10:00:00Z', tokens: 0 },
      { id: 'a4', type: 'status',  label: 'Status updated — Not selected', detail: 'Better luck next time.', at: '2026-04-20T09:00:00Z', tokens: 0 },
    ],
  },
  'event-4128': {
    status: 'draft',
    startedAt: '2026-04-18T11:00:00Z',
    lastUpdated: '2026-04-19T16:45:00Z',
    proposalGenerated: false,
    documents: {
      doc1: { answers: { f1: 'Abdullahi Engineering LLC', f2: 'Moha Abdullahi', f3: '88000' }, totalFields: 5, answeredCount: 3 },
      doc2: { answers: { g1: 'Abdullahi Engineering LLC', g2: 'BC-204871' }, totalFields: 4, answeredCount: 2 },
    },
    activity: [
      { id: 'a1', type: 'start',   label: 'Project opened',          detail: 'Bid added to your workspace',                          at: '2026-04-18T11:00:00Z', tokens: 0 },
      { id: 'a2', type: 'ai_fill', label: 'AI auto-fill completed',  detail: 'RFP Document — 3 of 5 fields filled automatically',   at: '2026-04-18T11:03:00Z', tokens: 740 },
      { id: 'a3', type: 'ai_fill', label: 'AI auto-fill completed',  detail: 'Bid Form — 2 of 4 fields filled automatically',       at: '2026-04-18T11:04:00Z', tokens: 510 },
      { id: 'a4', type: 'edit',    label: 'Manual field edit',       detail: 'Bid amount field manually updated to $88,000',        at: '2026-04-19T14:20:00Z', tokens: 0 },
    ],
  },
  'event-4130': {
    status: 'draft',
    startedAt: '2026-04-20T08:30:00Z',
    lastUpdated: '2026-04-21T13:10:00Z',
    proposalGenerated: true,
    documents: {
      doc1: { answers: { f1: 'Abdullahi Engineering LLC', f2: 'Moha Abdullahi', f3: 'BC-204871', f4: true, f5: '210000' }, totalFields: 5, answeredCount: 5 },
      doc2: { answers: { g1: 'Abdullahi Engineering LLC', g2: 'Moha Abdullahi', g3: '04/20/2026', g4: 'BC-204871' }, totalFields: 4, answeredCount: 4 },
    },
    activity: [
      { id: 'a1', type: 'start',    label: 'Project opened',                 detail: 'Bid added to your workspace',                             at: '2026-04-20T08:30:00Z', tokens: 0 },
      { id: 'a2', type: 'ai_fill',  label: 'AI auto-fill completed',         detail: 'RFP Document — 5 of 5 fields filled automatically',      at: '2026-04-20T08:33:00Z', tokens: 920 },
      { id: 'a3', type: 'ai_fill',  label: 'AI auto-fill completed',         detail: 'Bid Form — 4 of 4 fields filled automatically',           at: '2026-04-20T08:34:00Z', tokens: 680 },
      { id: 'a4', type: 'proposal', label: 'Proposal generated with Aria',   detail: 'Full 5-section proposal created from bid documents',      at: '2026-04-21T09:00:00Z', tokens: 3120 },
      { id: 'a5', type: 'edit',     label: 'Section edited — Introduction',  detail: 'Instruction: "Emphasize equity-focused approach"',        at: '2026-04-21T09:18:00Z', tokens: 760 },
      { id: 'a6', type: 'edit',     label: 'Section edited — Experience',    detail: 'Added North Minneapolis corridor project reference',       at: '2026-04-21T10:05:00Z', tokens: 830 },
      { id: 'a7', type: 'rewrite',  label: 'Inline rewrite — Scope of Work', detail: '37-word passage rewritten: "clearer deliverables list"', at: '2026-04-21T11:30:00Z', tokens: 370 },
      { id: 'a8', type: 'export',   label: 'Proposal exported as PDF',       detail: 'Downloaded via browser print',                            at: '2026-04-21T13:10:00Z', tokens: 0 },
    ],
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
