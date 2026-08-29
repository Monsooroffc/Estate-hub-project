export type PropertyStatus = 'available' | 'sold' | 'reserved'
export type PropertyType = 'residential' | 'commercial' | 'land' | 'villa' | 'apartment' | 'plot'

export interface Property {
  id: string; title: string; description: string; location: string
  property_type: PropertyType; price: number; area: number
  features: string[]; status: PropertyStatus
  created_at: string; updated_at: string; images?: PropertyImage[]; videos?: PropertyVideo[]
}
export interface PropertyImage {
  id: string; property_id: string; image_url: string; created_at: string
}
export interface PropertyVideo {
  id: string; property_id: string; video_url: string; created_at: string
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'SITE_VISIT' | 'CLOSED'
export interface Enquiry {
  id: string; property_id: string | null; name: string; phone: string
  email: string; budget: number | null; message: string; status: EnquiryStatus
  notes?: string; created_at: string; updated_at: string; property?: Property | null
}

export type LeadPriority = 'HOT' | 'WARM' | 'COLD'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'SITE_VISIT' | 'NEGOTIATION' | 'WON' | 'LOST'
export interface Lead {
  id: string; enquiry_id: string | null; property_id: string | null
  name: string; phone: string; email: string; budget: number | null
  priority: LeadPriority; status: LeadStatus; notes: string
  next_followup: string | null; created_at: string; updated_at: string
  property?: Property | null; enquiry?: Enquiry | null
}

export interface User { id: string; email: string; role: 'admin' }

export interface DashboardStats {
  totalProperties: number; availableProperties: number; soldProperties: number
  newEnquiries: number; totalLeads: number; hotLeads: number; followUpsDue: number
}

export interface PropertyFilters {
  location?: string; propertyType?: PropertyType | 'all'
  minBudget?: number; maxBudget?: number; minSize?: number; maxSize?: number
  availability?: PropertyStatus | 'all'; search?: string
}
export interface LeadFilters { search?: string; status?: LeadStatus | 'all'; priority?: LeadPriority | 'all' }
export interface EnquiryFilters { search?: string; status?: EnquiryStatus | 'all' }
