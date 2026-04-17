import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/ui/Spinner'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@civicbid.com', password: 'admin123', role: 'admin', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: 'User', email: 'user@civicbid.com', password: 'user123', role: 'user', color: 'bg-blue-50 border-blue-200 text-blue-700' },
]

export default function LoginPage() {
  const { login, loginError, setLoginError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const ok = login(email, password)
    setLoading(false)
    if (ok) {
      const user = { email }
      navigate(email === 'admin@civicbid.com' ? '/admin' : '/dashboard')
    }
  }

  function fillDemo(acc) {
    setEmail(acc.email)
    setPassword(acc.password)
    setLoginError('')
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 bg-dark flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-dark" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <span className="font-heading font-bold text-white text-2xl">CivicBid</span>
          </div>

          <h2 className="font-heading text-3xl font-bold text-white leading-tight mb-4">
            Government Bid<br />Intelligence Platform
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Track, analyze, and win more government contracts with AI-powered insights and automated form completion.
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
              <span className="text-lg">{f.icon}</span>
              <span className="text-gray-300 text-sm">{f.text}</span>
            </div>
          ))}

          <p className="text-gray-500 text-xs pt-4">
            Built for Minnesota Transportation Engineering Firms
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <span className="font-heading font-bold text-dark text-xl">CivicBid</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-dark mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to access your dashboard</p>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Quick demo login</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className={`flex-1 text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all hover:shadow-sm ${acc.color}`}
                >
                  <span className="font-bold block">{acc.label}</span>
                  <span className="opacity-70">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setLoginError('') }}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError('') }}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.6"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/><path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  )}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M10 7v4M10 13v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 text-sm"
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Prototype demo — no real authentication
          </p>
        </div>
      </div>
    </div>
  )
}
