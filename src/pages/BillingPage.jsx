import { Layout } from '../components/layout/Layout'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    proposals: 10,
    tokens: 50_000,
    tokenLabel: '50K',
    features: ['10 proposals / month', '50,000 AI tokens', 'PDF extraction', 'Basic AI assist', 'Email alerts'],
    current: false,
    color: 'border-gray-200',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 240,
    proposals: 50,
    tokens: 250_000,
    tokenLabel: '250K',
    features: ['50 proposals / month', '250,000 AI tokens', 'AI form auto-fill', 'All templates', 'Priority support', 'Win-rate analytics'],
    current: true,
    color: 'border-dark ring-2 ring-dark/10',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599,
    proposals: null,
    tokens: 1_000_000,
    tokenLabel: '1M',
    features: ['Unlimited proposals', '1M AI tokens', 'Everything in Pro', 'Team collaboration', 'Custom integrations', 'Dedicated CSM'],
    current: false,
    color: 'border-primary/40',
  },
]

// Mock usage for the current plan
const USAGE = {
  proposalsUsed: 8,
  proposalsTotal: 50,
  tokensUsed: 45_230,
  tokensTotal: 250_000,
  renewsOn: 'May 17, 2026',
}

function UsageBar({ used, total, color = 'bg-primary' }) {
  const pct = Math.min(100, Math.round((used / total) * 100))
  const warning = pct >= 80
  return (
    <div className="w-full">
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${warning ? 'bg-red-400' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export default function BillingPage() {
  const proposalPct = Math.round((USAGE.proposalsUsed / USAGE.proposalsTotal) * 100)
  const tokenPct    = Math.round((USAGE.tokensUsed    / USAGE.tokensTotal)    * 100)

  return (
    <Layout title="Billing" subtitle="Manage your subscription and usage">
      <div className="max-w-3xl space-y-6">

        {/* ── Current plan hero ── */}
        <div className="bg-dark rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Current plan</p>
              <p className="font-heading text-2xl font-bold">Professional</p>
              <p className="text-gray-300 text-sm mt-0.5">$240 / month · Renews {USAGE.renewsOn}</p>
            </div>
            <span className="bg-primary text-dark text-xs font-bold px-3 py-1.5 rounded-full">Active</span>
          </div>

          {/* Usage stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Proposals */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold">{USAGE.proposalsUsed}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Proposals used</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-300">{USAGE.proposalsTotal}</p>
                  <p className="text-gray-500 text-[10px]">total / month</p>
                </div>
              </div>
              <UsageBar used={USAGE.proposalsUsed} total={USAGE.proposalsTotal} />
              <p className="text-[10px] text-gray-400 mt-1.5">{USAGE.proposalsTotal - USAGE.proposalsUsed} remaining</p>
            </div>

            {/* Tokens */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold">{fmt(USAGE.tokensUsed)}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Tokens used</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-300">{fmt(USAGE.tokensTotal)}</p>
                  <p className="text-gray-500 text-[10px]">total / month</p>
                </div>
              </div>
              <UsageBar used={USAGE.tokensUsed} total={USAGE.tokensTotal} />
              <p className="text-[10px] text-gray-400 mt-1.5">{fmt(USAGE.tokensTotal - USAGE.tokensUsed)} tokens left</p>
            </div>
          </div>

          {/* Token breakdown hint */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
            <p className="text-[11px] text-gray-400">Token breakdown</p>
            <div className="flex gap-4 text-[11px] text-gray-300">
              <span>Generation ~3K / proposal</span>
              <span>·</span>
              <span>Edit ~800 / section</span>
              <span>·</span>
              <span>Rewrite ~400 / selection</span>
            </div>
          </div>
        </div>

        {/* ── Available plans ── */}
        <div>
          <h3 className="font-semibold text-dark mb-4">Plans</h3>
          <div className="grid grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.id} className={`bg-white rounded-2xl border p-5 transition-all relative ${plan.color}`}>
                {plan.current && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-dark text-white px-2 py-0.5 rounded-full">Current</span>
                )}

                <p className="font-heading font-bold text-dark mb-1">{plan.name}</p>
                <p className="text-2xl font-bold text-dark">${plan.price}</p>
                <p className="text-xs text-gray-400 mb-3">per month</p>

                {/* Key numbers */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-dark">{plan.proposals ?? '∞'}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">proposals</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-dark">{plan.tokenLabel}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">tokens</p>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 14 14">
                        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.current}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    plan.current
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-dark text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.current ? 'Current plan' : plan.price > 240 ? 'Upgrade' : 'Downgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Invoice history ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark">Invoice History</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Plan</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Apr 17, 2026', plan: 'Professional', amount: '$240.00' },
                { date: 'Mar 17, 2026', plan: 'Professional', amount: '$240.00' },
                { date: 'Feb 17, 2026', plan: 'Professional', amount: '$240.00' },
              ].map((inv, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm text-dark">{inv.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.plan}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-dark">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Paid</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary-dark hover:underline font-semibold">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}
