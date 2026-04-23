import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useUserProfile } from '../context/UserProfileContext'
import { useToast } from '../context/ToastContext'

const CATEGORIES = ['Landscaping', 'Construction', 'Transportation', 'Accessibility', 'Environmental']
const ROLES = ['Admin', 'Member', 'Viewer']

function Card({ title, subtitle, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-dark text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, updateProfile, toggleCategory, addTeamMember, removeTeamMember } = useUserProfile()
  const { addToast } = useToast()

  const [name,    setName]    = useState(user?.name || '')
  const [company, setCompany] = useState(profile?.companyName || '')
  const [phone,   setPhone]   = useState(profile?.phone || '')
  const [license, setLicense] = useState(profile?.licenseNumber || '')
  const [address, setAddress] = useState(profile?.address || '')
  const [website, setWebsite] = useState(profile?.website || '')
  const [founded, setFounded] = useState(profile?.founded || '')
  const [bio,     setBio]     = useState(profile?.bio || '')

  const [newMember,    setNewMember]    = useState({ name: '', designation: '', role: 'Member' })
  const [addingMember, setAddingMember] = useState(false)

  function handleSave(e) {
    e?.preventDefault()
    updateProfile({ companyName: company, phone, licenseNumber: license, address, website, founded, bio })
    addToast('Profile saved', 'success')
  }

  function handleAddMember() {
    if (!newMember.name.trim() || !newMember.designation.trim()) return
    addTeamMember(newMember)
    setNewMember({ name: '', designation: '', role: 'Member' })
    setAddingMember(false)
  }

  const initials = nm => nm.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Layout title="My Profile" subtitle="Manage your account, company and team information">
      {/* Full-width two-column grid */}
      <div className="grid grid-cols-2 gap-5 items-start">

        {/* ── LEFT column ── */}
        <div className="space-y-5">

          {/* Account */}
          <Card title="Account Information">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary-dark flex-shrink-0">
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
                  <label className="label">Phone number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="(612) 555-0000" />
                </div>
                <div>
                  <label className="label">MN Contractor License</label>
                  <input value={license} onChange={e => setLicense(e.target.value)} className="input-field" placeholder="BC-XXXXXX" />
                </div>
              </div>
              <button type="submit" className="btn-primary text-sm">Save changes</button>
            </form>
          </Card>

          {/* Company details */}
          <Card title="Company Details" subtitle="Used when generating proposals and filling bid forms">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Company / Firm name</label>
                  <input value={company} onChange={e => setCompany(e.target.value)} className="input-field" placeholder="Your company name" />
                </div>
                <div>
                  <label className="label">Website</label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} className="input-field" placeholder="yourfirm.com" />
                </div>
                <div className="col-span-2">
                  <label className="label">Company address</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} className="input-field" placeholder="123 Main St, Minneapolis, MN 55401" />
                </div>
                <div>
                  <label className="label">Year founded</label>
                  <input value={founded} onChange={e => setFounded(e.target.value)} className="input-field" placeholder="2015" maxLength={4} />
                </div>
              </div>
              <div>
                <label className="label">Company description</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="input-field resize-none text-sm"
                  placeholder="Brief description of your firm, specialisations, and experience…"
                />
              </div>
              <button type="submit" className="btn-primary text-sm">Save changes</button>
            </form>
          </Card>

        </div>

        {/* ── RIGHT column ── */}
        <div className="space-y-5">

          {/* Team members */}
          <Card
            title="Team Members"
            subtitle="Included in AI-generated proposal team sections"
            action={
              !addingMember && (
                <button
                  onClick={() => setAddingMember(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-dark hover:text-dark transition-colors"
                >
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center leading-none text-sm">+</span>
                  Add
                </button>
              )
            }
          >
            <div className="space-y-2">
              {(profile?.teamMembers || []).length === 0 && !addingMember && (
                <p className="text-sm text-gray-400 py-1">No team members added yet.</p>
              )}
              {(profile?.teamMembers || []).map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary-dark flex-shrink-0">
                    {initials(m.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark leading-tight">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.designation}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    m.role === 'Admin' ? 'bg-dark text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{m.role}</span>
                  <button
                    onClick={() => removeTeamMember(m.id)}
                    className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 14 14">
                      <path d="M2.5 3.5h9M4 3.5V2.5a1 1 0 011-1h4a1 1 0 011 1v1M5 6v4M9 6v4M3 3.5l.5 8a1 1 0 001 .9h5a1 1 0 001-.9l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}

              {addingMember && (
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Full name</label>
                      <input
                        value={newMember.name}
                        onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                        className="input-field"
                        placeholder="Jane Smith"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="label">Designation / Title</label>
                      <input
                        value={newMember.designation}
                        onChange={e => setNewMember(p => ({ ...p, designation: e.target.value }))}
                        className="input-field"
                        placeholder="Senior Engineer"
                      />
                    </div>
                    <div>
                      <label className="label">Role</label>
                      <select value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))} className="input-field">
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddMember} className="btn-primary text-xs py-1.5 px-4">Add member</button>
                    <button onClick={() => setAddingMember(false)} className="btn-secondary text-xs py-1.5 px-4">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Recent projects shortcut */}
          <Card
            title="Recent Projects"
            subtitle="Past work Aria references when writing Experience sections"
            action={
              <Link to="/projects" className="btn-primary text-xs py-1.5 px-3">Manage</Link>
            }
          >
            {(profile?.recentProjects || []).length === 0 ? (
              <p className="text-sm text-gray-400">No projects added. <Link to="/projects" className="text-primary-dark hover:underline">Add one →</Link></p>
            ) : (
              <div className="space-y-2">
                {(profile?.recentProjects || []).slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" fill="none" viewBox="0 0 14 14">
                        <rect x="1" y="1" width="12" height="12" rx="2" stroke="#D4A000" strokeWidth="1.3"/>
                        <path d="M3.5 5h7M3.5 7.5h5" stroke="#D4A000" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.client} · {p.year} {p.value && `· ${p.value}`}</p>
                    </div>
                  </div>
                ))}
                {(profile?.recentProjects || []).length > 3 && (
                  <p className="text-xs text-gray-400 text-center pt-1">
                    +{(profile.recentProjects.length - 3)} more · <Link to="/projects" className="text-primary-dark hover:underline">View all</Link>
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Bid interests */}
          <Card title="Bid Category Interests" subtitle="Used to surface recommended bids on the Browse page">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const active = profile?.interestedCategories?.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      active ? 'bg-dark text-white border-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
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
              {profile?.interestedCategories?.length || 0} categories selected · changes save automatically
            </p>
          </Card>

        </div>
      </div>
    </Layout>
  )
}
