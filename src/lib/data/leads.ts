import { Lead, LeadFilters, LeadPriority, LeadStatus } from '@/types'

let mockLeads: Lead[] = [
  {
    id: 'lead-1', enquiry_id: 'enq-1', property_id: 'prop-1', name: 'Rahul Sharma',
    phone: '9876543210', email: 'rahul@example.com', budget: 9000000,
    priority: 'HOT', status: 'SITE_VISIT',
    notes: 'Visited the property. Liked the layout. Negotiating on price.',
    next_followup: '2024-11-10T10:00:00Z', created_at: '2024-11-01T09:30:00Z', updated_at: '2024-11-06T16:00:00Z',
  },
  {
    id: 'lead-2', enquiry_id: 'enq-2', property_id: 'prop-3', name: 'Priya Patel',
    phone: '9123456789', email: 'priya@example.com', budget: 3000000,
    priority: 'WARM', status: 'FOLLOW_UP',
    notes: 'Waiting for legal documents. Follow up next week.',
    next_followup: '2024-11-12T11:00:00Z', created_at: '2024-11-02T11:00:00Z', updated_at: '2024-11-05T10:30:00Z',
  },
  {
    id: 'lead-3', enquiry_id: null, property_id: 'prop-5', name: 'Vikram Rao',
    phone: '9876512345', email: 'vikram@example.com', budget: 4500000,
    priority: 'COLD', status: 'NEW',
    notes: 'Inquired through website. Budget flexible.',
    next_followup: null, created_at: '2024-11-06T13:00:00Z', updated_at: '2024-11-06T13:00:00Z',
  },
]

export async function getLeads(filters?: LeadFilters): Promise<Lead[]> {
  let result = [...mockLeads]
  if (filters?.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(l => l.name.toLowerCase().includes(term) || l.phone.includes(term) || l.email.toLowerCase().includes(term))
  }
  if (filters?.status && filters.status !== 'all') result = result.filter(l => l.status === filters.status)
  if (filters?.priority && filters.priority !== 'all') result = result.filter(l => l.priority === filters.priority)
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getLeadById(id: string): Promise<Lead | null> {
  return mockLeads.find(l => l.id === id) || null
}

export async function createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  const now = new Date().toISOString()
  const newLead: Lead = { ...data, id: `lead-${Date.now()}`, created_at: now, updated_at: now }
  mockLeads.push(newLead)
  return newLead
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
  const index = mockLeads.findIndex(l => l.id === id)
  if (index === -1) return null
  mockLeads[index] = { ...mockLeads[index], ...data, updated_at: new Date().toISOString() }
  return mockLeads[index]
}

export async function deleteLead(id: string): Promise<boolean> {
  const initial = mockLeads.length
  mockLeads = mockLeads.filter(l => l.id !== id)
  return mockLeads.length < initial
}

export async function getTotalLeadsCount(): Promise<number> {
  const all = await getLeads()
  return all.length
}

export async function getHotLeadsCount(): Promise<number> {
  const all = await getLeads()
  return all.filter(l => l.priority === 'HOT').length
}

export async function getFollowUpsDueCount(): Promise<number> {
  const all = await getLeads()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return all.filter(l => {
    if (!l.next_followup) return false
    const followUpDate = new Date(l.next_followup)
    followUpDate.setHours(0, 0, 0, 0)
    return followUpDate <= today && l.status !== 'WON' && l.status !== 'LOST'
  }).length
}
