import { useNavigate } from 'react-router-dom'
import { AriaLog } from '../components/AriaLog'

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path d="M12 3l2 4.5 4.5.7-3.25 3.2.77 4.5L12 13.5l-4.02 2.4.77-4.5L5.5 8.2l4.5-.7L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M19 15l1.5 1.5L23 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI Form Auto-Fill',
    desc: 'Aria reads your bid documents and automatically fills up to 90% of form fields — saving hours of manual data entry on every application.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path d="M6 3h9.5L20 7.5V21H6V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M15 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12h6M9 15.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Proposal Generation',
    desc: 'Generate complete, structured proposals in seconds. Aria writes every section — introduction, scope, experience, pricing, and team — tailored to each bid.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 17h8M17 13v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Bid Tracking & Activity',
    desc: 'Track every application in one place. See exactly what Aria did, how many tokens were used, and the status of each bid — draft, submitted, or approved.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path d="M15 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-5-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M15 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 13h3M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Upload Your Own Bids',
    desc: 'Not just platform bids — upload any external RFP or bid document and Aria will read, analyze, and generate a custom proposal from your own files.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Team & Company Profile',
    desc: 'Store your company details, team members, past projects, and certifications once. Aria references them automatically in every proposal it writes.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Export & Submit',
    desc: 'Export polished proposals as PDF or Word in one click. Track submission status and get notified when your bid status changes.',
    color: 'bg-orange-50 text-orange-600',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Browse or upload a bid',
    desc: 'Find open government bids on the platform or upload your own RFP document from any source.',
  },
  {
    num: '02',
    title: 'Aria fills your forms',
    desc: 'Our AI reads the bid documents and auto-fills up to 90% of required form fields in seconds.',
  },
  {
    num: '03',
    title: 'Generate your proposal',
    desc: 'Aria writes a complete structured proposal tailored to the specific bid requirements and your company profile.',
  },
  {
    num: '04',
    title: 'Review, export & win',
    desc: 'Edit any section with Aria\'s help, export as PDF or Word, and submit your polished proposal with confidence.',
  },
]

const STATS = [
  { value: '500+', label: 'Bids processed' },
  { value: '89%',  label: 'Auto-fill accuracy' },
  { value: '3×',   label: 'Faster proposals' },
  { value: '$2.1M', label: 'Contracts won' },
]

const CATEGORIES = [
  { name: 'Landscaping',    color: 'bg-green-100 text-green-700' },
  { name: 'Construction',   color: 'bg-orange-100 text-orange-700' },
  { name: 'Transportation', color: 'bg-blue-100 text-blue-700' },
  { name: 'Accessibility',  color: 'bg-purple-100 text-purple-700' },
  { name: 'Environmental',  color: 'bg-teal-100 text-teal-700' },
  { name: 'Engineering',    color: 'bg-gray-100 text-gray-700' },
]

// ── Main landing page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <span className="font-heading font-bold text-dark text-lg">CivicBid</span>
            <span className="hidden sm:block text-xs text-gray-400 font-medium border-l border-gray-200 pl-2.5 ml-0.5">MN Government Procurement</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How it Works', 'Pricing'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm font-medium text-gray-500 hover:text-dark transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-gray-600 hover:text-dark transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-sm"
            >
              Get started free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 bg-dark relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Gold glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[80px] rounded-full" />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-primary">Now available · Minnesota contractors</span>
              </div>

              <h1 className="font-heading font-bold text-white text-5xl leading-tight mb-5">
                Win Government
                <br />
                <span className="text-primary">Contracts</span> with AI
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                CivicBid uses Aria AI to read bid documents, auto-fill your forms, and generate complete winning proposals — in minutes, not days.
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-primary text-dark font-bold px-6 py-3 rounded-xl hover:bg-primary-light transition-all shadow-glow hover:shadow-lg hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2.5 text-sm"
                >
                  Start for free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
                  <span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                      <path d="M7 3v8M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  See how it works
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex -space-x-2">
                  {['MA', 'SJ', 'DK', 'RT'].map(init => (
                    <div key={init} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-dark flex items-center justify-center text-[9px] font-bold text-primary">
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  <span className="text-white font-semibold">50+ contractors</span> already winning bids with CivicBid
                </p>
              </div>
            </div>

            {/* Right — Aria live log */}
            <div className="relative">
              <AriaLog />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-primary py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-heading font-bold text-dark text-3xl">{s.value}</p>
              <p className="text-sm text-dark/70 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="font-heading font-bold text-dark text-4xl mb-4">Built for contractors who want to win</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              From form auto-fill to proposal generation, CivicBid handles the paperwork so you can focus on the work.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-card transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-heading font-semibold text-dark text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="font-heading font-bold text-dark text-4xl mb-4">From bid to proposal in minutes</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">Four simple steps — most of the work is done by Aria.</p>
          </div>

          <div className="grid grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gray-100 hidden md:block" />

            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {/* Step number */}
                <div className="w-16 h-16 rounded-2xl bg-dark flex items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="font-heading font-bold text-primary text-lg">{step.num}</span>
                </div>
                <h3 className="font-heading font-semibold text-dark text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-3">Bid categories</p>
          <h2 className="font-heading font-bold text-dark text-3xl mb-4">Covering all Minnesota procurement areas</h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">CivicBid covers every category of government procurement across Minnesota cities, counties, and state agencies.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(c => (
              <span key={c.name} className={`px-5 py-2.5 rounded-xl text-sm font-semibold border border-transparent ${c.color}`}>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-3">Simple pricing</p>
            <h2 className="font-heading font-bold text-dark text-4xl mb-4">Pay for what you use</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">No seat fees. No hidden costs. Just straightforward proposal pricing.</p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              {
                name: 'Starter',
                price: '$99',
                period: '/month',
                proposals: '10 proposals',
                tokens: '50K tokens',
                desc: 'Perfect for contractors just getting started with government bids.',
                highlight: false,
              },
              {
                name: 'Professional',
                price: '$240',
                period: '/month',
                proposals: '50 proposals',
                tokens: '250K tokens',
                desc: 'Most popular for active contractors winning multiple contracts per month.',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: '$599',
                period: '/month',
                proposals: 'Unlimited',
                tokens: '1M tokens',
                desc: 'For large firms and teams managing dozens of bids simultaneously.',
                highlight: false,
              },
            ].map(plan => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border transition-all ${
                  plan.highlight
                    ? 'bg-dark border-dark shadow-float'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block bg-primary text-dark text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 uppercase tracking-wide">Most popular</span>
                )}
                <h3 className={`font-heading font-semibold text-base mb-1 ${plan.highlight ? 'text-white' : 'text-dark'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-heading font-bold text-4xl ${plan.highlight ? 'text-primary' : 'text-dark'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-gray-400' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-xs mb-5 leading-relaxed ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className={`space-y-2 mb-6 pb-6 border-b ${plan.highlight ? 'border-white/10' : 'border-gray-100'}`}>
                  {[plan.proposals, plan.tokens, 'Aria AI included', 'PDF & Word export', 'Activity log'].map(feat => (
                    <div key={feat} className="flex items-center gap-2">
                      <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-primary' : 'text-green-500'}`} fill="none" viewBox="0 0 16 16">
                        <path d="M2.5 8l3 3 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={`text-xs font-medium ${plan.highlight ? 'text-gray-300' : 'text-gray-600'}`}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-primary text-dark hover:bg-primary-light'
                      : 'bg-gray-50 text-dark border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-6 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-primary/15 blur-[60px] rounded-full" />

        <div className="max-w-2xl mx-auto text-center relative">
          <div className="w-14 h-14 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 28 28">
              <path d="M14 3l2.5 5.5 5.5.8-4 3.9.9 5.5L14 15.5 9.1 18.2l.9-5.5-4-3.9 5.5-.8L14 3z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-heading font-bold text-white text-4xl mb-4">Start winning contracts today</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Join Minnesota contractors already using CivicBid to submit better proposals, faster.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-dark font-bold px-8 py-3.5 rounded-xl hover:bg-primary-light transition-all shadow-glow hover:shadow-lg hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2.5 text-sm"
          >
            Get started for free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="text-xs text-gray-500 mt-4">No credit card required · Free to explore</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-dark border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-dark" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <span className="font-heading font-bold text-white text-base">CivicBid</span>
          </div>

          <div className="flex items-center gap-6">
            {['Features', 'How it Works', 'Pricing', 'Sign In'].map(link => (
              <button
                key={link}
                onClick={() => link === 'Sign In' ? navigate('/login') : undefined}
                className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-600">© 2026 CivicBid · Minnesota Government Procurement</p>
        </div>
      </footer>
    </div>
  )
}
