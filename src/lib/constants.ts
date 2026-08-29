import { EnquiryStatus, LeadPriority, LeadStatus, PropertyStatus, PropertyType } from '@/types'

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'plot', label: 'Plot' },
]

export const PROPERTY_STATUS: { value: PropertyStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
]

export const ENQUIRY_STATUSES: { value: EnquiryStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'FOLLOW_UP', label: 'Follow Up' },
  { value: 'SITE_VISIT', label: 'Site Visit' },
  { value: 'CLOSED', label: 'Closed' },
]

export const LEAD_PRIORITIES: { value: LeadPriority; label: string }[] = [
  { value: 'HOT', label: 'Hot' },
  { value: 'WARM', label: 'Warm' },
  { value: 'COLD', label: 'Cold' },
]

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'FOLLOW_UP', label: 'Follow Up' },
  { value: 'SITE_VISIT', label: 'Site Visit' },
  { value: 'NEGOTIATION', label: 'Negotiation' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
]

export const LOCATIONS = [
  'All Locations',
  'Downtown',
  'Suburb East',
  'Suburb West',
  'Lake View',
  'Hill Station',
  'Commercial District',
  'Green Valley',
]

export const APP_NAME = 'EstateHub'
export const APP_TAGLINE = 'Trusted family-owned property & land sales'
