import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msgOrObj, typeArg = 'info', duration = 3500) => {
    const message = typeof msgOrObj === 'string' ? msgOrObj : msgOrObj.message
    const type = typeof msgOrObj === 'string' ? typeArg : (msgOrObj.type || 'info')
    duration = typeof msgOrObj === 'object' && msgOrObj.duration ? msgOrObj.duration : duration
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

const ICONS = {
  success: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
      <path d="M6 6l8 8M14 6l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="#2563eb" strokeWidth="1.8" />
      <path d="M10 9v5M10 7v.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
      <path d="M10 3L2 17h16L10 3z" stroke="#d97706" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 11V8M10 14v.5" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

const COLORS = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
  warning: 'border-yellow-200 bg-yellow-50',
}

function Toast({ toast, onRemove }) {
  return (
    <div
      className={`animate-slide-up flex items-start gap-3 px-4 py-3 rounded-xl border shadow-float min-w-[280px] max-w-xs bg-white ${COLORS[toast.type]}`}
    >
      <span className="mt-0.5 flex-shrink-0">{ICONS[toast.type]}</span>
      <p className="text-sm text-dark flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
