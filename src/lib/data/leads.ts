import { Lead, LeadFilters, LeadPriority, LeadStatus } from '@/types'
import { getDb, isSupabaseConfigured } from '@/lib/supabase/db'
import { mapPropertyRow, PropertyRow } from '@/lib/data/properties'
import { mapEnquiryRow, EnquiryRow } from '@/lib/data/enquiries'

// ------------------------------------------------------------------
// DATA LAYER — Supabase (PostgreSQL) with automatic mock fallback.
// ------------------------------------------------------------------

export type LeadRow = {
  id: string; enquiry_id: string | null; property_id: string | null
  name: string; phone: string; email: string; budget: number | null
  priority: LeadPriority; status: LeadStatus; notes: string
  next_followup: string | null; created_at: string; updated_at: string
  properties?: PropertyRow | null
  enquiries?: EnquiryRow | null
}

export function mapLeadRow(row: LeadRow): Lead {
  const { properties, enquiries, ...rest } = row
  return {
    ...rest,
    budget: rest.budget == null ? null : Number(rest.budget),
    next_followup: rest.next_followup ?? null,
    property: properties ? mapPropertyRow(properties) : null,
    enquiry: enquiries ? mapEnquiryRow(enquiries) : null,
  } as unknown as Lead
}

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

function filterMockLeads(filters?: LeadFilters): Lead[] {
  let result = [...mockLeads]
  if (filters?.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(l => l.name.toLowerCase().includes(term) || l.phone.includes(term) || l.email.toLowerCase().includes(term))
  }
  if (filters?.status && filters.status !== 'all') result = result.filter(l => l.status === filters.status)
  if (filters?.priority && filters.priority !== 'all') result = result.filter(l => l.priority === filters.priority)
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getLeads(filters?: LeadFilters): Promise<Lead[]> {
  if (!isSupabaseConfigured) return filterMockLeads(filters)
  try {
    let query = getDb().from('leads').select('*, properties(*), enquiries(*)')
    if (filters?.search) {
      const term = filters.search.replace(/[%,()]/g, '')
      query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
    }
    if (filters?.status && filters.status !== 'all') query = query.eq('status', filters.status)
    if (filters?.priority && filters.priority !== 'all') query = query.eq('priority', filters.priority)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((row) => mapLeadRow(row as LeadRow))
  } catch (err) {
    console.warn('[leads] Supabase query failed — falling back to mock data:', err)
    return filterMockLeads(filters)
  }
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (!isSupabaseConfigured) return mockLeads.find(l => l.id === id) || null
  try {
    const { data, error } = await getDb()
      .from('leads')
      .select('*, properties(*), enquiries(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? mapLeadRow(data as LeadRow) : null
  } catch (err) {
    console.warn('[leads] Supabase query failed — falling back to mock data:', err)
    return mockLeads.find(l => l.id === id) || null
  }
}

export async function createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString()
    const newLead: Lead = { ...data, id: `lead-${Date.now()}`, created_at: now, updated_at: now }
    mockLeads.push(newLead)
    return newLead
  }
  try {
    const { data: row, error } = await getDb()
      .from('leads')
      .insert({
        enquiry_id: data.enquiry_id || null,
        property_id: data.property_id || null,
        name: data.name,
        phone: data.phone,
        email: data.email,
        budget: data.budget ?? null,
        priority: data.priority,
        status: data.status,
        notes: data.notes,
        next_followup: data.next_followup || null,
      })
      .select('*, properties(*), enquiries(*)')
      .single()
    if (error) throw error
    return mapLeadRow(row as LeadRow)
  } catch (err) {
    console.warn('[leads] Supabase write failed — falling back to mock data:', err)
    const now = new Date().toISOString()
    const newLead: Lead = { ...data, id: `lead-${Date.now()}`, created_at: now, updated_at: now }
    mockLeads.push(newLead)
    return newLead
  }
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
  if (!isSupabaseConfigured) {
    const index = mockLeads.findIndex(l => l.id === id)
    if (index === -1) return null
    mockLeads[index] = { ...mockLeads[index], ...data, updated_at: new Date().toISOString() }
    return mockLeads[index]
  }
  try {
    const patch: Record<string, unknown> = {}
    if (data.enquiry_id !== undefined) patch.enquiry_id = data.enquiry_id || null
    if (data.property_id !== undefined) patch.property_id = data.property_id || null
    if (data.name !== undefined) patch.name = data.name
    if (data.phone !== undefined) patch.phone = data.phone
    if (data.email !== undefined) patch.email = data.email
    if (data.budget !== undefined) patch.budget = data.budget
    if (data.priority !== undefined) patch.priority = data.priority
    if (data.status !== undefined) patch.status = data.status
    if (data.notes !== undefined) patch.notes = data.notes
    if (data.next_followup !== undefined) patch.next_followup = data.next_followup || null

    const { data: row, error } = await getDb()
      .from('leads')
      .update(patch)
      .eq('id', id)
      .select('*, properties(*), enquiries(*)')
      .maybeSingle()
    if (error) throw error
    return row ? mapLeadRow(row as LeadRow) : null
  } catch (err) {
    console.warn('[leads] Supabase write failed — falling back to mock data:', err)
    const index = mockLeads.findIndex(l => l.id === id)
    if (index === -1) return null
    mockLeads[index] = { ...mockLeads[index], ...data, updated_at: new Date().toISOString() }
    return mockLeads[index]
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const initial = mockLeads.length
    mockLeads = mockLeads.filter(l => l.id !== id)
    return mockLeads.length < initial
  }
  try {
    const { data, error } = await getDb().from('leads').delete().eq('id', id).select('id')
    if (error) throw error
    return (data ?? []).length > 0
  } catch (err) {
    console.warn('[leads] Supabase delete failed — falling back to mock data:', err)
    const initial = mockLeads.length
    mockLeads = mockLeads.filter(l => l.id !== id)
    return mockLeads.length < initial
  }
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
