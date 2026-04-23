import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/ui/Spinner'

const CATEGORIES = ['Landscaping', 'Construction', 'Transportation', 'Accessibility', 'Environmental']

const DEMO_ACCOUNTS = [
  { label: 'User',  email: 'user@civicbid.com',  password: 'user123'  },
  { label: 'Admin', email: 'admin@civicbid.com', password: 'admin123' },
]

function ErrorBox({ message }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M10 7v4M10 13v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      {message}
    </div>
  )
}

export default function LoginPage() {
  const { login, loginError, setLoginError, register } = useAuth()
  const navigate = useNavigate()

  const [mode,         setMode]         = useState('login')
  const [regStep,      setRegStep]      = useState(1)
  const [loading,      setLoading]      = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [regName,     setRegName]     = useState('')
  const [regEmail,    setRegEmail]    = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regCompany,  setRegCompany]  = useState('')
  const [regPhone,    setRegPhone]    = useState('')
  const [regCats,     setRegCats]     = useState([])

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
    if (!regCompany || regCats.length === 0) {
      setLoginError('Select at least one category of interest.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    register({ name: regName, email: regEmail, password: regPassword, company: regCompany, phone: regPhone, categories: regCats })
    setLoading(false)
    navigate('/dashboard')
  }

  function switchMode(m) { setMode(m); setRegStep(1); clearErrors() }
  function toggleCat(c)  { setRegCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]) }
  function fillDemo(acc) { setEmail(acc.email); setPassword(acc.password); clearErrors() }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-dark" fill="currentColor" viewBox="0 0 16 16">
            <rect x="1" y="1" width="6" height="6" rx="1"/>
            <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6"/>
            <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6"/>
            <rect x="9" y="9" width="6" height="6" rx="1"/>
          </svg>
        </div>
        <span className="font-heading font-bold text-dark text-xl">CivicBid</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {mode === 'login' ? (
          <LoginForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword}
            loading={loading} loginError={loginError}
            clearErrors={clearErrors}
            onSubmit={handleLogin}
            onSwitchMode={() => switchMode('register')}
            fillDemo={fillDemo}
          />
        ) : (
          <RegisterForm
            regStep={regStep} setRegStep={setRegStep}
            regName={regName} setRegName={setRegName}
            regEmail={regEmail} setRegEmail={setRegEmail}
            regPassword={regPassword} setRegPassword={setRegPassword}
            regCompany={regCompany} setRegCompany={setRegCompany}
            regPhone={regPhone} setRegPhone={setRegPhone}
            regCats={regCats} toggleCat={toggleCat}
            showPassword={showPassword} setShowPassword={setShowPassword}
            loading={loading} loginError={loginError}
            onStep1={handleRegStep1}
            onSubmit={handleRegSubmit}
            onSwitchMode={() => switchMode('login')}
          />
        )}

        <p className="text-center text-[11px] text-gray-400 mt-6 pt-5 border-t border-gray-100">
          Prototype demo · no real authentication
        </p>
      </div>

      <button onClick={() => navigate('/')}
        className="mt-5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to home
      </button>
    </div>
  )
}

function LoginForm({ email, setEmail, password, setPassword, showPassword, setShowPassword,
  loading, loginError, clearErrors, onSubmit, onSwitchMode, fillDemo }) {
  return (
    <>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-dark text-2xl mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500">
          New here?{' '}
          <button onClick={onSwitchMode} className="text-primary-dark font-semibold hover:underline">
            Create a free account
          </button>
        </p>
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Quick demo login</p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map(acc => (
            <button key={acc.email} onClick={() => fillDemo(acc)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-left hover:border-primary/50 hover:bg-primary/5 transition-all">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary-dark" fill="none" viewBox="0 0 12 12">
                  <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M1.5 11c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark">{acc.label}</p>
                <p className="text-[10px] text-gray-400 truncate">{acc.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] text-gray-400">or email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearErrors() }}
            className="input-field" placeholder="you@company.com" required autoFocus />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => { setPassword(e.target.value); clearErrors() }}
              className="input-field pr-10" placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        {loginError && <ErrorBox message={loginError} />}

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-50">
          {loading ? <><Spinner size="sm" /> Signing in…</> : (
            <>Sign in <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
          )}
        </button>
      </form>
    </>
  )
}

function RegisterForm({ regStep, setRegStep, regName, setRegName, regEmail, setRegEmail, regPassword, setRegPassword,
  regCompany, setRegCompany, regPhone, setRegPhone, regCats, toggleCat,
  showPassword, setShowPassword, loading, loginError, onStep1, onSubmit, onSwitchMode }) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          {regStep === 2 && (
            <button onClick={() => setRegStep(1)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <h1 className="font-heading font-bold text-dark text-2xl">
            {regStep === 1 ? 'Create account' : 'Company details'}
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Already have one?{' '}
          <button onClick={onSwitchMode} className="text-primary-dark font-semibold hover:underline">Sign in</button>
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${s < regStep ? 'bg-primary text-dark' : s === regStep ? 'bg-dark text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s < regStep
                ? <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : s}
            </div>
            <span className={`text-xs font-medium ${s === regStep ? 'text-dark' : 'text-gray-400'}`}>
              {s === 1 ? 'Account' : 'Company'}
            </span>
            {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {regStep === 1 ? (
        <form onSubmit={onStep1} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input value={regName} onChange={e => setRegName(e.target.value)} className="input-field" placeholder="Jane Smith" required autoFocus />
          </div>
          <div>
            <label className="label">Work email</label>
            <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="input-field" placeholder="you@company.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="input-field pr-10" placeholder="Min. 8 characters" minLength={8} required />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          </div>
          {loginError && <ErrorBox message={loginError} />}
          <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Company / Firm name</label>
            <input value={regCompany} onChange={e => setRegCompany(e.target.value)} className="input-field" placeholder="Abdullahi Engineering LLC" required autoFocus />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="input-field" placeholder="(612) 555-0000" />
          </div>
          <div>
            <label className="label">Bid categories <span className="text-red-400 normal-case font-normal">*</span></label>
            <p className="text-xs text-gray-400 mb-2">We'll surface recommended bids for these categories.</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => toggleCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${regCats.includes(cat) ? 'bg-dark text-white border-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {loginError && <ErrorBox message={loginError} />}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-50">
            {loading ? <><Spinner size="sm" /> Creating account…</> : 'Create account & continue'}
          </button>
          <p className="text-center text-xs text-gray-400">By creating an account you agree to our Terms of Service</p>
        </form>
      )}
    </>
  )
}
