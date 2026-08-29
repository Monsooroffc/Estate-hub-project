import * as React from 'react'
import { cn } from '@/lib/utils/format'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input hover:bg-accent',
    destructive: 'bg-red-100 text-red-800 hover:bg-red-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  }
  return <div className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variants[variant], className)} {...props} />
}

export { Badge }
