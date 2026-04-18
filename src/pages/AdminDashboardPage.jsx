import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { useBids } from '../context/BidContext'
import clsx from 'clsx'

const MONTHLY_REVENUE = [
  { month: 'Nov', mrr: 8400 },
  { month: 'Dec', mrr: 11200 },
  { month: 'Jan', mrr: 14800 },
  { month: 'Feb', mrr: 17300 },
  { month: 'Mar', mrr: 22100 },
  { month: 'Apr', mrr: 27450 },
]

const RECENT_USERS = [
  { name: 'Abdullahi Engineering LLC', email: 'user@civicbid.com', plan: 'Professional', joined: '2026-04-10', status: 'active' },
  { name: 'Metro Construction Inc.', email: 'metro@example.com', plan: 'Starter', joined: '2026-04-12', status: 'active' },
  { name: 'GreenPath Solutions', email: 'green@example.com', plan: 'Professional', joined: '2026-04-13', status: 'active' },
  { name: 'Dakota Transit Partners', email: 'dakota@example.com', plan: 'Enterprise', joined: '2026-04-14', status: 'active' },
  { name: 'NorthStar ADA Consultants', email: 'northstar@example.com', plan: 'Starter', joined: '2026-04-15', status: 'trial' },
  { name: 'River Valley Engineering', email: 'rveng@example.com', plan: 'Professional', joined: '2026-04-16', status: 'active' },
]

const RECENT_ACTIVITY = [
  { action: 'New user registered', detail: 'River Valley Engineering signed up for Professional', time: '2h ago', icon: '👤' },
  { action: 'Bid submitted', detail: 'Abdullahi Engineering submitted for event-4126', time: '4h ago', icon: '📤' },
  { action: 'Plan upgraded', detail: 'Dakota Transit Partners upgraded to Enterprise', time: '6h ago', icon: '⬆️' },
  { action: 'New bid posted', detail: 'Bicycle Network Planning bid posted by admin', time: '1d ago', icon: '📋' },
  { action: 'Application approved', detail: 'Freight Rail Environmental Review — approved', time: '2d ago', icon: '✅' },
  { action: 'Support ticket', detail: 'NorthStar ADA Consultants — PDF upload issue', time: '2d ago', icon: '🎫' },
]

const PLAN_COLORS = {
  Starter: 'bg-gray-50 text-gray-600 border-gray-200',
  Professional: 'bg-blue-50 text-blue-700 border-blue-200',
  Enterprise: 'bg-purple-50 text-purple-700 border-purple-200',
}

function MiniBar({ data }) {
  const max = Math.max(...data.map(d => d.mrr))
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={clsx('w-full rounded-t-sm', i === data.length - 1 ? 'bg-primary' : 'bg-gray-100')}
            style={{ height: `${(d.mrr / max) * 100}%` }}
          />
          <span className="text-[9px] text-gray-400">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { bids } = useBids()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const openBids = bids.filter(b => b.status === 'open' || b.status === 'urgent').length
  const totalMRR = 27450
  const prevMRR = 22100
  const mrrGrowth = Math.round(((totalMRR - prevMRR) / prevMRR) * 100)

  const SAAS_METRICS = [
    {
      label: 'Monthly Revenue',
      value: `$${(totalMRR / 1000).toFixed(1)}k`,
      sub: `+${mrrGrowth}% vs last month`,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    { label: 'Active Users', value: '47', sub: '+5 this week', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Bids', value: String(openBids), sub: `${bids.length} total posted`, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Conversion Rate', value: '34%', sub: '+3pts this month', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <Layout title="Admin Overview" subtitle="CivicBid platform metrics">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {['overview', 'users', 'bids'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={clsx('px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all',
              activeTab === tab ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {SAAS_METRICS.map(m => (
              <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className={clsx('w-9 h-9 rounded-xl mb-3', m.bg)} />
                <p className="text-2xl font-bold font-heading text-dark">{m.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.label}</p>
                <p className={clsx('text-xs font-semibold mt-1', m.color)}>{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-dark">Revenue Growth (MRR)</h3>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  +{mrrGrowth}% MoM
                </span>
              </div>
              <p className="text-3xl font-bold font-heading text-dark mb-4">
                ${(totalMRR / 1000).toFixed(2)}k
              </p>
              <MiniBar data={MONTHLY_REVENUE} />
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: 'Starter (14)', pct: 30 },
                  { label: 'Pro (27)', pct: 57 },
                  { label: 'Enterprise (6)', pct: 13 },
                ].map(p => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{p.label}</span>
                      <span className="font-semibold text-dark">{p.pct}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-dark mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-dark">{a.action}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{a.detail}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-dark">Registered Users ({RECENT_USERS.length})</h3>
            <button className="btn-secondary text-xs py-1.5">Export CSV</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Company', 'Email', 'Plan', 'Joined', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map((u, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm font-semibold text-dark">{u.name}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', PLAN_COLORS[u.plan])}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{u.joined}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border',
                      u.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-amber-50 text-amber-700 border-amber-200')}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bids' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-dark">All Bids ({bids.length})</h3>
            <button onClick={() => navigate('/admin/create')} className="btn-primary text-xs py-1.5">Post New Bid</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Title', 'Agency', 'Category', 'Deadline', 'Budget', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bids.map(bid => (
                <tr key={bid.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm font-semibold text-dark">{bid.title}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{bid.agency}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{bid.category}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{bid.deadline}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-dark">{bid.budget}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border capitalize',
                      bid.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' :
                      bid.status === 'urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-50 text-gray-500 border-gray-200')}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => navigate(`/admin/edit/${bid.id}`)}
                      className="text-xs text-primary-dark hover:underline font-semibold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
