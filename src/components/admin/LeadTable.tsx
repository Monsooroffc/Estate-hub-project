import { Lead } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils/format'
import StatusBadge from './StatusBadge'
import DataTable from './DataTable'

interface LeadTableProps {
  leads: Lead[]
  onRowClick?: (lead: Lead) => void
}

export default function LeadTable({ leads, onRowClick }: LeadTableProps) {
  const columns = [
    { key: 'name', header: 'Customer', cell: (lead: Lead) => lead.name },
    { key: 'phone', header: 'Phone', cell: (lead: Lead) => lead.phone },
    { key: 'property', header: 'Property', cell: (lead: Lead) => lead.property?.title || 'N/A' },
    { key: 'budget', header: 'Budget', cell: (lead: Lead) => lead.budget ? formatPrice(lead.budget) : 'N/A' },
    { key: 'priority', header: 'Priority', cell: (lead: Lead) => <StatusBadge status={lead.priority} type="lead" /> },
    { key: 'status', header: 'Status', cell: (lead: Lead) => <StatusBadge status={lead.status} type="lead" /> },
    { key: 'next_followup', header: 'Next Follow-up', cell: (lead: Lead) => lead.next_followup ? formatDate(lead.next_followup) : '—' },
    { key: 'created', header: 'Created', cell: (lead: Lead) => formatDate(lead.created_at) },
  ]
  return <DataTable columns={columns} data={leads} keyExtractor={(lead) => lead.id} onRowClick={onRowClick} />
}
