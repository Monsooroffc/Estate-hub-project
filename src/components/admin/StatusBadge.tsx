import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
  type?: 'property' | 'enquiry' | 'lead'
}

export default function StatusBadge({ status, type = 'enquiry' }: StatusBadgeProps) {
  const normalized = status.toLowerCase()
  let variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' = 'default'

  if (type === 'property') {
    if (normalized === 'available') variant = 'success'
    else if (normalized === 'sold') variant = 'destructive'
    else if (normalized === 'reserved') variant = 'warning'
  } else if (type === 'lead') {
    if (normalized === 'hot') variant = 'destructive'
    else if (normalized === 'warm') variant = 'warning'
    else if (normalized === 'cold') variant = 'secondary'
    else if (normalized === 'won') variant = 'success'
    else if (normalized === 'lost') variant = 'destructive'
    else variant = 'default'
  } else {
    if (normalized === 'new') variant = 'success'
    else if (normalized === 'closed') variant = 'destructive'
    else if (normalized === 'follow_up') variant = 'warning'
    else variant = 'default'
  }

  return <Badge variant={variant} className="capitalize">{status.replace(/_/g, ' ')}</Badge>
}
