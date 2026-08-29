import { EnquiryStatus, LeadPriority, LeadStatus, PropertyStatus, PropertyType } from '@/types'

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'land', label: 'Land' },
  { value: 'plot', label: 'Plot' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
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
  'Porur',
  'Ramapuram',
  'Mugalivakkam',
  'Kattupakkam',
  'Poonamallee',
  'Maduravoyal',
  'Anna Nagar',
  'Siruseri',
]

export const APP_NAME = 'RRR Housing'
export const APP_FULL_NAME = 'Real Rise Resource'
export const APP_TAGLINE = 'Faith | Integrity | Truth'
export const CONTACT_PHONE = '+91 99627 82486'
export const CONTACT_EMAIL = 'abithabegum52143@gmail.com'
export const CONTACT_ADDRESS = 'No.100/5, 2nd Floor, Lakshmi Nagar, 1st Main Road, Porur, Chennai - 600116'
