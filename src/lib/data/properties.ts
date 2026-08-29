import { Property, PropertyFilters, PropertyImage } from '@/types'

// ------------------------------------------------------------------
// MOCK DATA — Replace with Supabase queries once connected.
// ------------------------------------------------------------------

const mockImages: PropertyImage[] = [
  { id: 'img-1', property_id: 'prop-1', image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-2', property_id: 'prop-2', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-3', property_id: 'prop-3', image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-4', property_id: 'prop-4', image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-5', property_id: 'prop-5', image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-6', property_id: 'prop-6', image_url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
]

let mockProperties: Property[] = [
  {
    id: 'prop-1', title: 'Sunset Grove Villa',
    description: 'A premium 4-bedroom villa nestled in a serene gated community. Features a private garden, modular kitchen, and covered parking.',
    location: 'Lake View', property_type: 'villa', price: 8500000, area: 3200,
    features: ['4 BHK', 'Private Garden', 'Covered Parking', 'Gated Community', 'Modular Kitchen'],
    status: 'available', created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z', images: [mockImages[0]],
  },
  {
    id: 'prop-2', title: 'Downtown Commercial Plaza',
    description: 'Prime commercial space in the heart of the business district. High footfall, ample parking, and modern amenities.',
    location: 'Commercial District', property_type: 'commercial', price: 12000000, area: 2500,
    features: ['Prime Location', 'High Footfall', 'Ample Parking', 'Power Backup', 'Lift Access'],
    status: 'available', created_at: '2024-02-10T10:00:00Z', updated_at: '2024-02-10T10:00:00Z', images: [mockImages[1]],
  },
  {
    id: 'prop-3', title: 'Green Valley Residential Plot',
    description: 'Clear-title residential plot in a fast-developing suburb. Corner plot with road access on two sides.',
    location: 'Green Valley', property_type: 'plot', price: 2400000, area: 1800,
    features: ['Corner Plot', 'Two-Side Road Access', 'Clear Title', 'Developing Area'],
    status: 'available', created_at: '2024-03-05T10:00:00Z', updated_at: '2024-03-05T10:00:00Z', images: [mockImages[2]],
  },
  {
    id: 'prop-4', title: 'Hill Station Retreat',
    description: 'Charming 3-bedroom cottage with panoramic valley views. Fully furnished and ready to move in.',
    location: 'Hill Station', property_type: 'residential', price: 5600000, area: 2100,
    features: ['3 BHK', 'Valley View', 'Furnished', 'Fireplace', 'Garden'],
    status: 'sold', created_at: '2024-04-20T10:00:00Z', updated_at: '2024-05-12T10:00:00Z', images: [mockImages[3]],
  },
  {
    id: 'prop-5', title: 'Suburb East Apartment',
    description: 'Modern 2 BHK apartment in a well-maintained complex. Close to schools, hospitals, and public transport.',
    location: 'Suburb East', property_type: 'apartment', price: 4200000, area: 1150,
    features: ['2 BHK', 'Clubhouse', '24/7 Security', 'Children Play Area', 'Gym'],
    status: 'available', created_at: '2024-05-18T10:00:00Z', updated_at: '2024-05-18T10:00:00Z', images: [mockImages[4]],
  },
  {
    id: 'prop-6', title: 'Westside Land Parcel',
    description: 'Spacious agricultural-cum-residential land parcel with fertile soil and water access.',
    location: 'Suburb West', property_type: 'land', price: 6800000, area: 15000,
    features: ['Water Access', 'Fertile Soil', 'Road Frontage', 'Flexible Usage'],
    status: 'reserved', created_at: '2024-06-01T10:00:00Z', updated_at: '2024-06-01T10:00:00Z', images: [mockImages[5]],
  },
]

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  let result = [...mockProperties]
  if (filters?.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term) || p.property_type.toLowerCase().includes(term))
  }
  if (filters?.location && filters.location !== 'All Locations') result = result.filter(p => p.location === filters.location)
  if (filters?.propertyType && filters.propertyType !== 'all') result = result.filter(p => p.property_type === filters.propertyType)
  if (filters?.minBudget) result = result.filter(p => p.price >= filters.minBudget!)
  if (filters?.maxBudget) result = result.filter(p => p.price <= filters.maxBudget!)
  if (filters?.minSize) result = result.filter(p => p.area >= filters.minSize!)
  if (filters?.maxSize) result = result.filter(p => p.area <= filters.maxSize!)
  if (filters?.availability && filters.availability !== 'all') result = result.filter(p => p.status === filters.availability)
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return mockProperties.find(p => p.id === id) ? { ...mockProperties.find(p => p.id === id)! } : null
}

export async function createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
  const now = new Date().toISOString()
  const newProperty: Property = { ...data, id: `prop-${Date.now()}`, created_at: now, updated_at: now }
  mockProperties.push(newProperty)
  return newProperty
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
  const index = mockProperties.findIndex(p => p.id === id)
  if (index === -1) return null
  mockProperties[index] = { ...mockProperties[index], ...data, updated_at: new Date().toISOString() }
  return mockProperties[index]
}

export async function deleteProperty(id: string): Promise<boolean> {
  const initial = mockProperties.length
  mockProperties = mockProperties.filter(p => p.id !== id)
  return mockProperties.length < initial
}

export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  const all = await getProperties()
  return all.filter(p => p.status === 'available').slice(0, limit)
}

export async function getLocations(): Promise<string[]> {
  const all = await getProperties()
  const locations = Array.from(new Set(all.map(p => p.location)))
  return ['All Locations', ...locations]
}
