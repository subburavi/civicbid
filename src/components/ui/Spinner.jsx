import clsx from 'clsx'

export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-[3px]' }
  return (
    <span
      className={clsx(
        'inline-block rounded-full border-gray-200 border-t-primary',
        sizes[size],
        className
      )}
      style={{ animation: 'spin 0.7s linear infinite' }}
    />
  )
}
