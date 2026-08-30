import { Enquiry, EnquiryFilters, EnquiryStatus } from '@/types'
import { getDb, isSupabaseConfigured } from '@/lib/supabase/db'
import { mapPropertyRow, PropertyRow } from '@/lib/data/properties'

// ------------------------------------------------------------------
// DATA LAYER — Supabase (PostgreSQL) with automatic mock fallback.
// ------------------------------------------------------------------

export type EnquiryRow = {
  id: string; property_id: string | null; name: string; phone: string
  email: string; budget: number | null; message: string; status: EnquiryStatus
  notes: string | null; created_at: string; updated_at: string
  properties?: PropertyRow | null
}

export function mapEnquiryRow(row: EnquiryRow): Enquiry {
  const { properties, ...rest } = row
  return {
    ...rest,
    budget: rest.budget == null ? null : Number(rest.budget),
    notes: rest.notes ?? undefined,
    property: properties ? mapPropertyRow(properties) : null,
  } as Enquiry
}

let mockEnquiries: Enquiry[] = [
  {
    id: 'enq-1', property_id: 'prop-1', name: 'Rahul Sharma', phone: '9876543210',
    email: 'rahul@example.com', budget: 9000000,
    message: 'Interested in visiting the villa this weekend. Please share more details.',
    status: 'NEW', created_at: '2024-11-01T09:30:00Z', updated_at: '2024-11-01T09:30:00Z',
  },
  {
    id: 'enq-2', property_id: 'prop-3', name: 'Priya Patel', phone: '9123456789',
    email: 'priya@example.com', budget: 3000000,
    message: 'Looking for a residential plot for investment. Is the title clear?',
    status: 'CONTACTED', created_at: '2024-11-02T11:00:00Z', updated_at: '2024-11-03T14:00:00Z',
  },
  {
    id: 'enq-3', property_id: null, name: 'Amit Kumar', phone: '9988776655',
    email: 'amit@example.com', budget: 5000000,
    message: 'Please suggest properties under 50 lakhs in Porur and nearby areas.',
    status: 'FOLLOW_UP', created_at: '2024-11-04T08:15:00Z', updated_at: '2024-11-05T10:30:00Z',
  },
]

function filterMockEnquiries(filters?: EnquiryFilters): Enquiry[] {
  let result = [...mockEnquiries]
  if (filters?.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(e => e.name.toLowerCase().includes(term) || e.phone.includes(term) || e.email.toLowerCase().includes(term))
  }
  if (filters?.status && filters.status !== 'all') result = result.filter(e => e.status === filters.status)
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getEnquiries(filters?: EnquiryFilters): Promise<Enquiry[]> {
  if (!isSupabaseConfigured) return filterMockEnquiries(filters)
  try {
    let query = getDb().from('enquiries').select('*, properties(*)')
    if (filters?.search) {
      const term = filters.search.replace(/[%,()]/g, '')
      query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
    }
    if (filters?.status && filters.status !== 'all') query = query.eq('status', filters.status)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((row) => mapEnquiryRow(row as EnquiryRow))
  } catch (err) {
    console.warn('[enquiries] Supabase query failed — falling back to mock data:', err)
    return filterMockEnquiries(filters)
  }
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  if (!isSupabaseConfigured) return mockEnquiries.find(e => e.id === id) || null
  try {
    const { data, error } = await getDb()
      .from('enquiries')
      .select('*, properties(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? mapEnquiryRow(data as EnquiryRow) : null
  } catch (err) {
    console.warn('[enquiries] Supabase query failed — falling back to mock data:', err)
    return mockEnquiries.find(e => e.id === id) || null
  }
}

export async function createEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Enquiry> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString()
    const newEnquiry: Enquiry = { ...data, id: `enq-${Date.now()}`, status: 'NEW', created_at: now, updated_at: now }
    mockEnquiries.push(newEnquiry)
    return newEnquiry
  }
  try {
    const { data: row, error } = await getDb()
      .from('enquiries')
      .insert({
        property_id: data.property_id || null,
        name: data.name,
        phone: data.phone,
        email: data.email,
        budget: data.budget ?? null,
        message: data.message,
      })
      .select('*, properties(*)')
      .single()
    if (error) throw error
    return mapEnquiryRow(row as EnquiryRow)
  } catch (err) {
    console.warn('[enquiries] Supabase write failed — falling back to mock data:', err)
    const now = new Date().toISOString()
    const newEnquiry: Enquiry = { ...data, id: `enq-${Date.now()}`, status: 'NEW', created_at: now, updated_at: now }
    mockEnquiries.push(newEnquiry)
    return newEnquiry
  }
}

export async function updateEnquiry(id: string, data: Partial<Enquiry>): Promise<Enquiry | null> {
  if (!isSupabaseConfigured) {
    const index = mockEnquiries.findIndex(e => e.id === id)
    if (index === -1) return null
    mockEnquiries[index] = { ...mockEnquiries[index], ...data, updated_at: new Date().toISOString() }
    return mockEnquiries[index]
  }
  try {
    const patch: Record<string, unknown> = {}
    if (data.property_id !== undefined) patch.property_id = data.property_id || null
    if (data.name !== undefined) patch.name = data.name
    if (data.phone !== undefined) patch.phone = data.phone
    if (data.email !== undefined) patch.email = data.email
    if (data.budget !== undefined) patch.budget = data.budget
    if (data.message !== undefined) patch.message = data.message
    if (data.status !== undefined) patch.status = data.status
    if (data.notes !== undefined) patch.notes = data.notes

    const { data: row, error } = await getDb()
      .from('enquiries')
      .update(patch)
      .eq('id', id)
      .select('*, properties(*)')
      .maybeSingle()
    if (error) throw error
    return row ? mapEnquiryRow(row as EnquiryRow) : null
  } catch (err) {
    console.warn('[enquiries] Supabase write failed — falling back to mock data:', err)
    const index = mockEnquiries.findIndex(e => e.id === id)
    if (index === -1) return null
    mockEnquiries[index] = { ...mockEnquiries[index], ...data, updated_at: new Date().toISOString() }
    return mockEnquiries[index]
  }
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<Enquiry | null> {
  return updateEnquiry(id, { status })
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const initial = mockEnquiries.length
    mockEnquiries = mockEnquiries.filter(e => e.id !== id)
    return mockEnquiries.length < initial
  }
  try {
    const { data, error } = await getDb().from('enquiries').delete().eq('id', id).select('id')
    if (error) throw error
    return (data ?? []).length > 0
  } catch (err) {
    console.warn('[enquiries] Supabase delete failed — falling back to mock data:', err)
    const initial = mockEnquiries.length
    mockEnquiries = mockEnquiries.filter(e => e.id !== id)
    return mockEnquiries.length < initial
  }
}

export async function getNewEnquiriesCount(): Promise<number> {
  const all = await getEnquiries()
  return all.filter(e => e.status === 'NEW').length
}
