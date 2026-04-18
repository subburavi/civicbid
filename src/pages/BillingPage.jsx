import { Layout } from '../components/layout/Layout'

const PLANS = [
  {
    name: 'Starter',
    price: 49,
    features: ['Up to 5 active bids', 'PDF extraction', 'Basic AI assist', 'Email alerts'],
    current: false,
  },
  {
    name: 'Professional',
    price: 149,
    features: ['Unlimited active bids', 'AI form auto-fill', 'Deadline tracking', 'Priority support', 'Win-rate analytics'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: 499,
    features: ['Everything in Pro', 'Team collaboration', 'Custom integrations', 'Dedicated CSM', 'White-label reports'],
    current: false,
  },
]

export default function BillingPage() {
  return (
    <Layout title="Billing" subtitle="Manage your subscription and usage">
      <div className="max-w-3xl space-y-6">
        {/* Current plan summary */}
        <div className="bg-dark rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current plan</p>
              <p className="font-heading text-2xl font-bold">Professional</p>
              <p className="text-gray-300 text-sm mt-1">$149 / month · Renews May 17, 2026</p>
            </div>
            <span className="bg-primary text-dark text-xs font-bold px-3 py-1.5 rounded-full">Active</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {[
              { label: 'Bids tracked', value: '6', max: '∞' },
              { label: 'AI extractions', value: '14', max: '100' },
              { label: 'Documents filed', value: '23', max: '∞' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                <p className="text-gray-500 text-[10px]">of {s.max}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="font-semibold text-dark mb-4">Available Plans</h3>
          <div className="grid grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  plan.current ? 'border-dark ring-2 ring-dark/10' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-bold text-dark">{plan.name}</p>
                  {plan.current && (
                    <span className="text-[10px] font-bold bg-dark text-white px-2 py-0.5 rounded-full">Current</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-dark mb-0.5">${plan.price}</p>
                <p className="text-xs text-gray-400 mb-4">per month</p>
                <ul className="space-y-2 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
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
                  }`}>
                  {plan.current ? 'Current plan' : plan.price > 149 ? 'Upgrade' : 'Downgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice history */}
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
                { date: 'Apr 17, 2026', plan: 'Professional', amount: '$149.00', status: 'Paid' },
                { date: 'Mar 17, 2026', plan: 'Professional', amount: '$149.00', status: 'Paid' },
                { date: 'Feb 17, 2026', plan: 'Professional', amount: '$149.00', status: 'Paid' },
              ].map((inv, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm text-dark">{inv.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.plan}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-dark">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      {inv.status}
                    </span>
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
