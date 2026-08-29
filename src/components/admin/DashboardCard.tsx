import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/format'

export type DashboardCardAccent = 'violet' | 'green' | 'amber' | 'rose' | 'blue' | 'indigo' | 'orange' | 'sky'

// Static class map so Tailwind JIT keeps every variant.
const ACCENTS: Record<DashboardCardAccent, string> = {
  violet: 'bg-violet-100 text-violet-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  blue: 'bg-blue-100 text-blue-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  orange: 'bg-orange-100 text-orange-600',
  sky: 'bg-sky-100 text-sky-600',
}

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  accent?: DashboardCardAccent
  href?: string
}

export default function DashboardCard({ title, value, description, icon: Icon, accent = 'violet', href }: DashboardCardProps) {
  const body = (
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight">{value}</p>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', ACCENTS[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  )

  const card = (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {body}
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {card}
      </Link>
    )
  }
  return card
}
