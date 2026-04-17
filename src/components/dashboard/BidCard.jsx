import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { format, parseISO, differenceInDays } from 'date-fns'

const STATUS_VARIANT = { open: 'open', urgent: 'urgent', closed: 'closed', awarded: 'awarded' }

const CATEGORY_ICONS = {
  Landscaping: '🌿',
  Construction: '🏗️',
  Transportation: '🚦',
  Accessibility: '♿',
  Environmental: '🌍',
}

export function BidCard({ bid }) {
  const navigate = useNavigate()
  const daysLeft = differenceInDays(parseISO(bid.deadline), new Date())
  const isUrgent = daysLeft <= 10

  return (
    <div
      onClick={() => navigate(`/bids/${bid.id}`)}
      className="glass-card p-5 cursor-pointer hover:shadow-float hover:-translate-y-0.5 transition-all duration-200 group relative"
    >
      {bid.featured && (
        <div className="absolute top-3 right-3">
          <span className="badge bg-primary/10 text-primary-dark font-semibold text-[10px] border border-primary/20">
            ⭐ Featured
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-primary/10 transition-colors">
          {CATEGORY_ICONS[bid.category] || '📋'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading font-semibold text-dark text-sm leading-snug line-clamp-2 group-hover:text-primary-dark transition-colors pr-16">
            {bid.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{bid.agency}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{bid.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {bid.tags.map(t => (
          <span key={t} className="badge bg-gray-100 text-gray-500 text-[10px]">{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Badge variant={STATUS_VARIANT[bid.status] || 'gray'}>
            {bid.status === 'urgent' ? '🔴 ' : ''}{bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
          </Badge>
          <span className={`text-xs font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-500'}`}>
            {daysLeft <= 0 ? 'Closed' : `${daysLeft}d left`}
          </span>
        </div>
        <div className="text-right">
          {bid.budget && (
            <p className="font-heading font-bold text-dark text-sm">{bid.budget}</p>
          )}
          <p className="text-[10px] text-gray-400">{format(parseISO(bid.deadline), 'MMM d, yyyy')}</p>
        </div>
      </div>

      <button className="mt-3 w-full btn-primary justify-center py-2 text-xs">
        View Details →
      </button>
    </div>
  )
}
