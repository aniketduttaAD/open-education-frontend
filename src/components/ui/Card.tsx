import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CardProps } from '@/lib/types'
import { animations } from '@/lib/animations'

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden',
        hover && 'cursor-pointer',
        className
      )}
      {...(hover ? animations.cardHover : {})}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-neutral-200', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50', className)}>
      {children}
    </div>
  )
}
