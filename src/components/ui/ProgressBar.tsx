import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({ 
  progress, 
  className, 
  showLabel = false,
  color = 'primary',
  size = 'md'
}: ProgressBarProps) {
  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  }
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const clampedProgress = Math.max(0, Math.min(100, progress))
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Progress
          </span>
          <span className="text-sm text-neutral-500">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={cn(
        'w-full bg-neutral-200 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
