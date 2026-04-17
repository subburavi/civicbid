import clsx from 'clsx'

const VARIANTS = {
  open: 'bg-green-100 text-green-700',
  urgent: 'bg-red-100 text-red-600',
  closed: 'bg-gray-100 text-gray-500',
  awarded: 'bg-blue-100 text-blue-600',
  yellow: 'bg-primary/10 text-primary-dark',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
}

export function Badge({ variant = 'gray', children, className }) {
  return (
    <span className={clsx('badge font-semibold', VARIANTS[variant] || VARIANTS.gray, className)}>
      {children}
    </span>
  )
}
