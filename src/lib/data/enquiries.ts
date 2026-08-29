import { Enquiry, EnquiryFilters, EnquiryStatus } from '@/types'

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

export async function getEnquiries(filters?: EnquiryFilters): Promise<Enquiry[]> {
  let result = [...mockEnquiries]
  if (filters?.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(e => e.name.toLowerCase().includes(term) || e.phone.includes(term) || e.email.toLowerCase().includes(term))
  }
  if (filters?.status && filters.status !== 'all') result = result.filter(e => e.status === filters.status)
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  return mockEnquiries.find(e => e.id === id) || null
}

export async function createEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Enquiry> {
  const now = new Date().toISOString()
  const newEnquiry: Enquiry = { ...data, id: `enq-${Date.now()}`, status: 'NEW', created_at: now, updated_at: now }
  mockEnquiries.push(newEnquiry)
  return newEnquiry
}

export async function updateEnquiry(id: string, data: Partial<Enquiry>): Promise<Enquiry | null> {
  const index = mockEnquiries.findIndex(e => e.id === id)
  if (index === -1) return null
  mockEnquiries[index] = { ...mockEnquiries[index], ...data, updated_at: new Date().toISOString() }
  return mockEnquiries[index]
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<Enquiry | null> {
  return updateEnquiry(id, { status })
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const initial = mockEnquiries.length
  mockEnquiries = mockEnquiries.filter(e => e.id !== id)
  return mockEnquiries.length < initial
}

export async function getNewEnquiriesCount(): Promise<number> {
  const all = await getEnquiries()
  return all.filter(e => e.status === 'NEW').length
}
