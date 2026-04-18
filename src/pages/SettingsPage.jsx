import { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useToast } from '../context/ToastContext'

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-dark' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { addToast } = useToast()
  const [notifs, setNotifs] = useState({
    deadlineAlerts: true,
    newBids: true,
    statusUpdates: true,
    weeklyDigest: false,
    marketing: false,
  })
  const [prefs, setPrefs] = useState({
    autoSave: true,
    pdfOverlay: true,
    darkMode: false,
  })

  function toggleNotif(key) { setNotifs(p => ({ ...p, [key]: !p[key] })) }
  function togglePref(key) { setPrefs(p => ({ ...p, [key]: !p[key] })) }

  function handleSave() {
    addToast('Settings saved', 'success')
  }

  const notifItems = [
    { key: 'deadlineAlerts', label: 'Deadline alerts', description: 'Get notified 7 days, 3 days, and 1 day before bid deadlines' },
    { key: 'newBids', label: 'New bid notifications', description: 'Email when new bids matching your interests are posted' },
    { key: 'statusUpdates', label: 'Application status updates', description: 'Updates when your application status changes' },
    { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of new bids and deadlines every Monday' },
    { key: 'marketing', label: 'Product updates', description: 'News about new features and improvements' },
  ]

  const prefItems = [
    { key: 'autoSave', label: 'Auto-save answers', description: 'Automatically save form answers as you type' },
    { key: 'pdfOverlay', label: 'PDF overlay highlights', description: 'Show answer overlays on the PDF while filling' },
    { key: 'darkMode', label: 'Dark mode', description: 'Coming soon' },
  ]

  return (
    <Layout title="Settings" subtitle="Notifications and preferences">
      <div className="max-w-2xl space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Notifications</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {notifItems.map(item => (
              <div key={item.key} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 mr-8">
                  <p className="text-sm font-semibold text-dark">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>
                <Toggle enabled={notifs[item.key]} onChange={() => toggleNotif(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Preferences</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {prefItems.map(item => (
              <div key={item.key} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 mr-8">
                  <p className="text-sm font-semibold text-dark">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>
                <Toggle enabled={prefs[item.key]} onChange={() => togglePref(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100">
            <h3 className="font-semibold text-red-600">Danger Zone</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-dark">Clear all saved data</p>
                <p className="text-xs text-gray-400">Removes all saved application answers from this browser</p>
              </div>
              <button
                onClick={() => { localStorage.removeItem('civicbid_applications'); addToast('Data cleared', 'info') }}
                className="text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors">
                Clear data
              </button>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary text-sm">Save settings</button>
      </div>
    </Layout>
  )
}
