import { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useUserProfile } from '../context/UserProfileContext'
import { useToast } from '../context/ToastContext'

const CATEGORIES = ['Landscaping', 'Construction', 'Transportation', 'Accessibility', 'Environmental']

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, updateProfile, toggleCategory } = useUserProfile()
  const { addToast } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [company, setCompany] = useState(profile?.companyName || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [license, setLicense] = useState(profile?.licenseNumber || '')

  function handleSave(e) {
    e.preventDefault()
    updateProfile({ companyName: company, phone, licenseNumber: license })
    addToast('Profile saved successfully', 'success')
  }

  return (
    <Layout title="My Profile" subtitle="Manage your account and company information">
      <div className="max-w-2xl space-y-6">
        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Account Information</h3>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary-dark">
                {user?.avatar}
              </div>
              <div>
                <p className="font-semibold text-dark">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <span className="text-xs font-semibold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                  {user?.role} account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Email address</label>
                <input value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="label">Company / Firm name</label>
                <input value={company} onChange={e => setCompany(e.target.value)}
                  className="input-field" placeholder="Your company name" />
              </div>
              <div>
                <label className="label">Phone number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="input-field" placeholder="(612) 555-0000" />
              </div>
              <div className="col-span-2">
                <label className="label">MN Contractor License Number</label>
                <input value={license} onChange={e => setLicense(e.target.value)}
                  className="input-field" placeholder="BC-XXXXXX" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary text-sm">Save changes</button>
            </div>
          </form>
        </div>

        {/* Bid interests */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Bid Category Interests</h3>
            <p className="text-xs text-gray-400 mt-0.5">Used to show recommended bids on the Browse page</p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const active = profile?.interestedCategories?.includes(cat)
                return (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      active ? 'bg-dark text-white border-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>
                    {cat}
                    {active && (
                      <svg className="w-3.5 h-3.5 ml-1.5 inline" fill="none" viewBox="0 0 14 14">
                        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {profile?.interestedCategories?.length || 0} categories selected — changes save automatically
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
