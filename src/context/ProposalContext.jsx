import { createContext, useContext, useState } from 'react'
import { generateMockData, mockEditSection, mockEditSelection } from '../data/mockProposalData'

const ProposalContext = createContext(null)

function setByPath(obj, pathStr, value) {
  const parts = pathStr.split('.')
  const next = { ...obj }
  let cur = next
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = Array.isArray(cur[parts[i]]) ? [...cur[parts[i]]] : { ...cur[parts[i]] }
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
  return next
}

// Replace a highlight <span> with plain text and remove it from DOM
function unwrapHighlight(el, withText) {
  if (!el || !el.parentNode) return
  const replacement = document.createTextNode(withText)
  el.parentNode.replaceChild(replacement, el)
}

export function ProposalProvider({ children }) {
  const [proposalData, setProposalData] = useState(null)
  const [templateId, setTemplateId] = useState('clean')
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [sectionVersions, setSectionVersions] = useState({})

  // Text selected in canvas, highlight span injected into DOM
  // Shape: { text: string, highlightEl: HTMLSpanElement } | null
  const [pendingSelection, setPendingSelection] = useState(null)

  // After AI rewrites selection — waiting for user accept/reject
  // Shape: { highlightEl, originalText, proposedText } | null
  const [pendingEdit, setPendingEdit] = useState(null)

  function pushMessage(role, text, extra = {}) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role, text, ...extra }])
  }

  function updateField(path, value) {
    setProposalData(prev => (prev ? setByPath(prev, path, value) : prev))
  }

  function updateSectionContent(sectionId, content) {
    setProposalData(prev =>
      prev
        ? { ...prev, sections: prev.sections.map(s => (s.id === sectionId ? { ...s, content } : s)) }
        : prev
    )
  }

  async function generateProposal(bid, profile) {
    if (isGenerating) return
    setIsGenerating(true)
    pushMessage('user', 'Analyze this bid and generate a full proposal.')
    await new Promise(r => setTimeout(r, 2000))
    const data = generateMockData(bid, profile)
    setProposalData(data)
    setSectionVersions({})
    pushMessage(
      'ai',
      `Generated a complete 5-section proposal for "${bid?.title}". Click any text to edit directly, or select a passage and send an instruction to rewrite it with AI.`
    )
    setIsGenerating(false)
  }

  async function editSection(sectionId, instruction) {
    if (isEditing || !proposalData) return
    setIsEditing(true)
    const section = proposalData.sections.find(s => s.id === sectionId)
    pushMessage('user', `Edit "${section?.title}": ${instruction}`)
    await new Promise(r => setTimeout(r, 1600))
    const newContent = mockEditSection(section, instruction)
    setProposalData(prev => ({
      ...prev,
      sections: prev.sections.map(s => (s.id === sectionId ? { ...s, content: newContent } : s)),
    }))
    setSectionVersions(prev => ({ ...prev, [sectionId]: (prev[sectionId] || 0) + 1 }))
    pushMessage('ai', `"${section?.title}" has been updated.`)
    setIsEditing(false)
  }

  // Called with the highlight span element (already injected into the doc DOM)
  async function editSelection(selectedText, instruction, highlightEl) {
    if (isEditing) return
    setIsEditing(true)
    setPendingSelection(null)
    pushMessage('user', `Rewrite: "${selectedText.substring(0, 55)}${selectedText.length > 55 ? '…' : ''}"`)
    await new Promise(r => setTimeout(r, 1400))
    const proposed = mockEditSelection(selectedText, instruction)
    setPendingEdit({ highlightEl, originalText: selectedText, proposedText: proposed })
    pushMessage('ai', `Here's my rewrite:\n\n"${proposed}"\n\nAccept to apply it to the document.`)
    setIsEditing(false)
  }

  function acceptEdit() {
    if (!pendingEdit) return
    const { highlightEl, proposedText } = pendingEdit
    unwrapHighlight(highlightEl, proposedText)
    setPendingEdit(null)
    pushMessage('ai', 'Done! The selected passage has been updated.')
  }

  function rejectEdit() {
    if (!pendingEdit) return
    const { highlightEl, originalText } = pendingEdit
    unwrapHighlight(highlightEl, originalText)
    setPendingEdit(null)
  }

  // Dismiss pending selection: remove highlight, restore original text
  function dismissSelection() {
    if (!pendingSelection) return
    const { text, highlightEl } = pendingSelection
    unwrapHighlight(highlightEl, text)
    setPendingSelection(null)
  }

  function clearProposal() {
    setProposalData(null)
    setMessages([])
    setSectionVersions({})
    setPendingSelection(null)
    setPendingEdit(null)
  }

  return (
    <ProposalContext.Provider
      value={{
        proposalData,
        templateId,
        setTemplateId,
        messages,
        isGenerating,
        isEditing,
        sectionVersions,
        updateField,
        updateSectionContent,
        generateProposal,
        editSection,
        editSelection,
        clearProposal,
        pendingSelection,
        setPendingSelection,
        dismissSelection,
        pendingEdit,
        acceptEdit,
        rejectEdit,
      }}
    >
      {children}
    </ProposalContext.Provider>
  )
}

export function useProposal() {
  return useContext(ProposalContext)
}
