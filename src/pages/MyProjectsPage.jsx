import { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useUserProfile } from '../context/UserProfileContext'

const CATEGORIES = ['Landscaping', 'Construction', 'Transportation', 'Accessibility', 'Environmental', 'Other']

const CAT_COLORS = {
  Landscaping:    'bg-green-50 text-green-700 border-green-200',
  Construction:   'bg-orange-50 text-orange-700 border-orange-200',
  Transportation: 'bg-blue-50 text-blue-700 border-blue-200',
  Accessibility:  'bg-purple-50 text-purple-700 border-purple-200',
  Environmental:  'bg-teal-50 text-teal-700 border-teal-200',
  Other:          'bg-gray-100 text-gray-600 border-gray-200',
}

const EMPTY = { name: '', client: '', year: '', value: '', category: 'Construction', description: '' }

function ProjectForm({ initial = EMPTY, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const canSave = form.name.trim().length > 0

  return (
    <div className="bg-white rounded-2xl border border-primary/25 p-5 space-y-4">
      <p className="font-semibold text-dark text-sm">{title}</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <label className="label">Project name</label>
          <input value={form.name} onChange={set('name')} className="input-field" placeholder="Nicollet Ave Streetscape Phase 2" autoFocus />
        </div>
        <div>
          <label className="label">Client / Agency</label>
          <input value={form.client} onChange={set('client')} className="input-field" placeholder="City of Minneapolis" />
        </div>
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={set('category')} className="input-field">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Year</label>
            <input value={form.year} onChange={set('year')} className="input-field" placeholder="2024" maxLength={4} />
          </div>
          <div>
            <label className="label">Value</label>
            <input value={form.value} onChange={set('value')} className="input-field" placeholder="$45,000" />
          </div>
        </div>
        <div className="col-span-3">
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            className="input-field resize-none text-sm"
            placeholder="Brief description of the scope, deliverables, and outcomes…"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => canSave && onSave(form)}
          disabled={!canSave}
          className="btn-primary text-xs py-1.5 px-4 disabled:opacity-40"
        >
          {initial.id ? 'Save changes' : 'Add project'}
        </button>
        <button onClick={onCancel} className="btn-secondary text-xs py-1.5 px-4">Cancel</button>
      </div>
    </div>
  )
}

function ProjectCard({ project, onRemove, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all group flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-dark text-sm leading-snug flex-1">{project.name}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(project)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-dark hover:bg-gray-100 transition-colors"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 14 14">
              <path d="M9.5 2.5l2 2L4 13H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => onRemove(project.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 14 14">
              <path d="M2.5 3.5h9M4 3.5V2.5a1 1 0 011-1h4a1 1 0 011 1v1M5 6v4M9 6v4M3 3.5l.5 8a1 1 0 001 .9h5a1 1 0 001-.9l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {project.client && (
        <p className="text-xs text-gray-400 mb-2">{project.client}</p>
      )}

      {project.description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-3">{project.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mt-auto pt-3 border-t border-gray-50">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CAT_COLORS[project.category] || CAT_COLORS.Other}`}>
          {project.category}
        </span>
        {project.year && (
          <span className="text-[10px] text-gray-400 font-medium">{project.year}</span>
        )}
        {project.value && (
          <span className="ml-auto text-[11px] font-bold text-dark">{project.value}</span>
        )}
      </div>
    </div>
  )
}

export default function MyProjectsPage() {
  const { profile, addProject, removeProject, updateProject } = useUserProfile()
  const [showAdd,  setShowAdd]  = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [filter,   setFilter]   = useState('All')

  const allProjects = profile?.recentProjects || []
  const projects = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter)
  const usedCats  = ['All', ...CATEGORIES.filter(c => allProjects.some(p => p.category === c))]

  return (
    <Layout title="My Projects" subtitle="Past work Aria uses when writing Experience sections in proposals">
      <div className="space-y-5">

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category filter pills */}
          <div className="flex items-center gap-1 flex-wrap flex-1">
            {usedCats.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === c ? 'bg-dark text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-dark hover:border-gray-300'
                }`}
              >
                {c}
                {c !== 'All' && (
                  <span className="ml-1 opacity-60">{allProjects.filter(p => p.category === c).length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400">{allProjects.length} project{allProjects.length !== 1 ? 's' : ''} total</span>
            {!showAdd && !editing && (
              <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">
                <svg width="13" height="13" fill="none" viewBox="0 0 14 14">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Add project
              </button>
            )}
          </div>
        </div>

        {/* ── Add form ── */}
        {showAdd && (
          <ProjectForm
            title="New project"
            onSave={p => { addProject(p); setShowAdd(false) }}
            onCancel={() => setShowAdd(false)}
          />
        )}

        {/* ── Empty state ── */}
        {allProjects.length === 0 && !showAdd && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" fill="none" viewBox="0 0 28 28">
                <rect x="3" y="3" width="22" height="22" rx="3" stroke="#D4A000" strokeWidth="1.6"/>
                <path d="M8 14h12M8 9h7M8 19h9" stroke="#D4A000" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-dark mb-1">No projects yet</p>
            <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">
              Add past projects so Aria can reference your experience when writing proposal sections.
            </p>
            <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">Add your first project</button>
          </div>
        )}

        {/* ── No filter results ── */}
        {allProjects.length > 0 && projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-400">No projects in the <strong>{filter}</strong> category.</p>
          </div>
        )}

        {/* ── Project grid ── */}
        {projects.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {projects.map(p =>
              editing?.id === p.id ? (
                <div key={p.id} className="col-span-3">
                  <ProjectForm
                    title="Edit project"
                    initial={editing}
                    onSave={updated => { updateProject(p.id, updated); setEditing(null) }}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              ) : (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onRemove={removeProject}
                  onEdit={proj => { setShowAdd(false); setEditing(proj) }}
                />
              )
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
