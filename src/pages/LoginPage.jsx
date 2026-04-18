import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/ui/Spinner'

const CATEGORIES = ['Landscaping', 'Construction', 'Transportation', 'Accessibility', 'Environmental']

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@civicbid.com', password: 'admin123', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: 'User', email: 'user@civicbid.com', password: 'user123', color: 'bg-blue-50 border-blue-200 text-blue-700' },
]

const LOGO = (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
      <svg className="w-5 h-5 text-dark" fill="currentColor" viewBox="0 0 16 16">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
        <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    </div>
    <span className="font-heading font-bold text-dark text-xl">CivicBid</span>
  </div>
)

export default function LoginPage() {
  const { login, loginError, setLoginError, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [regStep, setRegStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register step 1
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  // Register step 2
  const [regCompany, setRegCompany] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCategories, setRegCategories] = useState([])

  function clearErrors() { setLoginError('') }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const ok = login(email, password)
    setLoading(false)
    if (ok) navigate(email === 'admin@civicbid.com' ? '/admin' : '/dashboard')
  }

  function handleRegStep1(e) {
    e.preventDefault()
    clearErrors()
    if (!regName || !regEmail || !regPassword) return
    setRegStep(2)
  }

  async function handleRegSubmit(e) {
    e.preventDefault()
    if (!regCompany || regCategories.length === 0) {
      setLoginError('Select at least one category of interest.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    register({ name: regName, email: regEmail, password: regPassword, company: regCompany, phone: regPhone, categories: regCategories })
    setLoading(false)
    navigate('/dashboard')
  }

  function toggleCategory(cat) {
    setRegCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  function fillDemo(acc) {
    setEmail(acc.email)
    setPassword(acc.password)
    clearErrors()
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-[45%] bg-dark flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${(i + 1) * 90}px`, height: `${(i + 1) * 90}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-dark" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <span className="font-heading font-bold text-white text-2xl">CivicBid</span>
          </div>
          <h2 className="font-heading text-4xl font-bold text-white leading-tight mb-4">
            Win More<br />Government Bids
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-xs">
            AI-powered procurement platform for Minnesota contractors. Extract, fill, and submit bids in minutes.
          </p>
        </div>
        <div className="relative space-y-4">
          {[
            { icon: '📄', text: 'PDF form extraction with AI' },
            { icon: '🔔', text: 'Real-time bid deadline alerts' },
            { icon: '📊', text: 'Win-rate analytics dashboard' },
            { icon: '🤖', text: 'Intelligent go/no-go scoring' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <span className="text-base">{f.icon}</span>
              <span className="text-gray-300 text-sm">{f.text}</span>
            </div>
          ))}
          <p className="text-gray-600 text-xs pt-4">Built for Minnesota Transportation & Engineering Firms</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8">{LOGO}</div>

          {mode === 'login' ? (
            <>
              <h2 className="font-heading text-2xl font-bold text-dark mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm mb-6">
                Don't have an account?{' '}
                <button onClick={() => { setMode('register'); clearErrors() }} className="text-primary-dark font-semibold hover:underline">
                  Create one free
                </button>
              </p>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Quick demo login</p>
                <div className="flex gap-2">
                  {DEMO_ACCOUNTS.map(acc => (
                    <button key={acc.email} onClick={() => fillDemo(acc)}
                      className={`flex-1 text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all hover:shadow-sm ${acc.color}`}>
                      <span className="font-bold block">{acc.label}</span>
                      <span className="opacity-70">{acc.email}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearErrors() }}
                    className="input-field" placeholder="you@company.com" required />
                </div>
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => { setPassword(e.target.value); clearErrors() }}
                      className="input-field pr-10" placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/>
                        <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {loginError && <ErrorBox message={loginError} />}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-sm">
                  {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign in'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Register header */}
              <div className="flex items-center gap-3 mb-1">
                {regStep === 2 && (
                  <button onClick={() => setRegStep(1)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <h2 className="font-heading text-2xl font-bold text-dark">
                  {regStep === 1 ? 'Create your account' : 'Your company profile'}
                </h2>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setRegStep(1); clearErrors() }}
                  className="text-primary-dark font-semibold hover:underline">Sign in</button>
              </p>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6 mt-4">
                {[1, 2].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${s < regStep ? 'bg-primary text-dark' : s === regStep ? 'bg-dark text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {s < regStep ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : s}
                    </div>
                    <span className={`text-xs font-medium ${s === regStep ? 'text-dark' : 'text-gray-400'}`}>
                      {s === 1 ? 'Account' : 'Company'}
                    </span>
                    {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                  </div>
                ))}
              </div>

              {regStep === 1 ? (
                <form onSubmit={handleRegStep1} className="space-y-4">
                  <div>
                    <label className="label">Full name</label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                      className="input-field" placeholder="Jane Smith" required />
                  </div>
                  <div>
                    <label className="label">Work email</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      className="input-field" placeholder="you@company.com" required />
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="input-field pr-10" placeholder="Min. 8 characters" minLength={8} required />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/>
                          <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {loginError && <ErrorBox message={loginError} />}
                  <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                      <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegSubmit} className="space-y-4">
                  <div>
                    <label className="label">Company / Firm name</label>
                    <input type="text" value={regCompany} onChange={e => setRegCompany(e.target.value)}
                      className="input-field" placeholder="Abdullahi Engineering LLC" required />
                  </div>
                  <div>
                    <label className="label">Phone number</label>
                    <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      className="input-field" placeholder="(612) 555-0000" />
                  </div>
                  <div>
                    <label className="label">
                      Bid categories of interest
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-2">We'll show you recommended bids based on your selection.</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                            ${regCategories.includes(cat)
                              ? 'bg-dark text-white border-dark'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  {loginError && <ErrorBox message={loginError} />}
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-sm">
                    {loading ? <><Spinner size="sm" /> Creating account...</> : 'Create account & continue'}
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    By creating an account you agree to our Terms of Service
                  </p>
                </form>
              )}
            </>
          )}

          <p className="text-center text-xs text-gray-400 mt-6 border-t border-gray-100 pt-4">
            Prototype demo — no real authentication
          </p>
        </div>
      </div>
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M10 7v4M10 13v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      {message}
    </div>
  )
}
