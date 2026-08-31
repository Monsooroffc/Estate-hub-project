import { Property, PropertyFilters, PropertyImage, PropertyVideo } from '@/types'
import { getDb, isSupabaseConfigured } from '@/lib/supabase/db'

// ------------------------------------------------------------------
// DATA LAYER — Supabase (PostgreSQL) with automatic mock fallback.
// When Supabase env vars are missing (or a query fails), the app
// keeps working against in-memory mock data (demo mode).
// ------------------------------------------------------------------

export type PropertyRow = {
  id: string; title: string; description: string; location: string
  property_type: Property['property_type']; price: number; area: number
  features: string[] | null; status: Property['status']
  created_at: string; updated_at: string
  property_images?: PropertyImage[] | null
  property_videos?: PropertyVideo[] | null
}

export function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id, title: row.title, description: row.description, location: row.location,
    property_type: row.property_type, price: Number(row.price), area: Number(row.area),
    features: row.features ?? [], status: row.status,
    created_at: row.created_at, updated_at: row.updated_at,
    images: row.property_images ?? undefined,
    videos: row.property_videos ?? undefined,
  }
}

const mockImages: PropertyImage[] = [
  { id: 'img-1', property_id: 'prop-1', image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-2', property_id: 'prop-2', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-3', property_id: 'prop-3', image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-4', property_id: 'prop-4', image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-5', property_id: 'prop-5', image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
  { id: 'img-6', property_id: 'prop-6', image_url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
]

const defaultMockProperties: Property[] = [
  {
    id: 'prop-1', title: 'Porur Gated Community Villa',
    description: 'A premium 4-bedroom villa in a serene gated community off Mount Poonamallee Road. Features a private garden, modular kitchen, and covered parking.',
    location: 'Porur', property_type: 'villa', price: 8500000, area: 3200,
    features: ['4 BHK', 'Private Garden', 'Covered Parking', 'Gated Community', 'Modular Kitchen'],
    status: 'available', created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z', images: [mockImages[0]],
  },
  {
    id: 'prop-2', title: 'Anna Nagar Commercial Plaza',
    description: 'Prime commercial space in Chennai\'s most sought-after business hub. High footfall, ample parking, and modern amenities.',
    location: 'Anna Nagar', property_type: 'commercial', price: 12000000, area: 2500,
    features: ['Prime Location', 'High Footfall', 'Ample Parking', 'Power Backup', 'Lift Access'],
    status: 'available', created_at: '2024-02-10T10:00:00Z', updated_at: '2024-02-10T10:00:00Z', images: [mockImages[1]],
  },
  {
    id: 'prop-3', title: 'Poonamallee DTCP Approved Plot',
    description: 'Clear-title residential plot in a fast-developing corridor between Porur and Poonamallee. Corner plot with road access on two sides.',
    location: 'Poonamallee', property_type: 'plot', price: 2400000, area: 1800,
    features: ['Corner Plot', 'Two-Side Road Access', 'Clear Title', 'DTCP Approved', 'Developing Area'],
    status: 'available', created_at: '2024-03-05T10:00:00Z', updated_at: '2024-03-05T10:00:00Z', images: [mockImages[2]],
    videos: [{ id: 'vid-1', property_id: 'prop-3', video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', created_at: '2024-03-05T10:00:00Z' }],
  },
  {
    id: 'prop-4', title: 'Ramapuram Garden Home',
    description: 'Charming 3-bedroom walkout home with a private garden, close to Ramapuram\'s schools and hospitals. Ready to move in.',
    location: 'Ramapuram', property_type: 'residential', price: 5600000, area: 2100,
    features: ['3 BHK', 'Private Garden', 'Covered Parking', 'Modular Kitchen', 'Ready to Move'],
    status: 'sold', created_at: '2024-04-20T10:00:00Z', updated_at: '2024-05-12T10:00:00Z', images: [mockImages[3]],
  },
  {
    id: 'prop-5', title: 'Maduravoyal 2BHK Apartment',
    description: 'Modern 2 BHK apartment in a well-maintained complex off the Chennai Bypass. Close to schools, hospitals, and the West Tower.',
    location: 'Maduravoyal', property_type: 'apartment', price: 4200000, area: 1150,
    features: ['2 BHK', 'Clubhouse', '24/7 Security', 'Children Play Area', 'Gym'],
    status: 'available', created_at: '2024-05-18T10:00:00Z', updated_at: '2024-05-18T10:00:00Z', images: [mockImages[4]],
  },
  {
    id: 'prop-6', title: 'Siruseri Land Parcel',
    description: 'Spacious CNT residential land parcel on the OMR growth belt with water access and road frontage.',
    location: 'Siruseri', property_type: 'land', price: 6800000, area: 15000,
    features: ['Water Access', 'Clear Title', 'Road Frontage', 'OMR Growth Belt', 'Flexible Usage'],
    status: 'reserved', created_at: '2024-06-01T10:00:00Z', updated_at: '2024-06-01T10:00:00Z', images: [mockImages[5]],
  },
]

const PERSISTED_PROPERTIES_KEY = 'rrr-housing-properties-v1'

function loadPersistedProperties(): Property[] {
  if (typeof window === 'undefined') return [...defaultMockProperties]

  try {
    const saved = window.localStorage.getItem(PERSISTED_PROPERTIES_KEY)
    if (!saved) {
      window.localStorage.setItem(PERSISTED_PROPERTIES_KEY, JSON.stringify(defaultMockProperties))
      return [...defaultMockProperties]
    }

    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Property[]
  } catch (error) {
    console.warn('[properties] Failed to load persisted mock properties, resetting to defaults:', error)
  }

  window.localStorage.setItem(PERSISTED_PROPERTIES_KEY, JSON.stringify(defaultMockProperties))
  return [...defaultMockProperties]
}

function persistProperties(properties: Property[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PERSISTED_PROPERTIES_KEY, JSON.stringify(properties))
}

let mockProperties: Property[] = loadPersistedProperties()

function filterMockProperties(filters?: PropertyFilters): Property[] {
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

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  if (!isSupabaseConfigured) return filterMockProperties(filters)
  try {
    let query = getDb().from('properties').select('*, property_images(*), property_videos(*)')
    if (filters?.search) {
      const term = filters.search.replace(/[%,()]/g, '')
      query = query.or(`title.ilike.%${term}%,location.ilike.%${term}%,property_type.ilike.%${term}%`)
    }
    if (filters?.location && filters.location !== 'All Locations') query = query.eq('location', filters.location)
    if (filters?.propertyType && filters.propertyType !== 'all') query = query.eq('property_type', filters.propertyType)
    if (filters?.minBudget) query = query.gte('price', filters.minBudget)
    if (filters?.maxBudget) query = query.lte('price', filters.maxBudget)
    if (filters?.minSize) query = query.gte('area', filters.minSize)
    if (filters?.maxSize) query = query.lte('area', filters.maxSize)
    if (filters?.availability && filters.availability !== 'all') query = query.eq('status', filters.availability)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((row) => mapPropertyRow(row as PropertyRow))
  } catch (err) {
    console.warn('[properties] Supabase query failed — falling back to mock data:', err)
    return filterMockProperties(filters)
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    const found = mockProperties.find(p => p.id === id)
    return found ? { ...found } : null
  }
  try {
    const { data, error } = await getDb()
      .from('properties')
      .select('*, property_images(*), property_videos(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? mapPropertyRow(data as PropertyRow) : null
  } catch (err) {
    console.warn('[properties] Supabase query failed — falling back to mock data:', err)
    const found = mockProperties.find(p => p.id === id)
    return found ? { ...found } : null
  }
}

async function insertMedia(
  propertyId: string,
  items: { image_url?: string; video_url?: string; url?: string }[] | undefined,
  table: 'property_images' | 'property_videos',
  urlKey: 'image_url' | 'video_url'
): Promise<PropertyImage[] | PropertyVideo[]> {
  if (!items || items.length === 0) return []
  const rows = items.map((item) => ({
    property_id: propertyId,
    [urlKey]: item[urlKey] ?? item.url ?? '',
  }))
  const { data, error } = await getDb().from(table).insert(rows).select()
  if (error) throw error
  return (data ?? []) as PropertyImage[] | PropertyVideo[]
}

export async function createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString()
    const newProperty: Property = { ...data, id: `prop-${Date.now()}`, created_at: now, updated_at: now }
    mockProperties = [...mockProperties, newProperty]
    persistProperties(mockProperties)
    return newProperty
  }
  try {
    const { images, videos, ...base } = data
    const { data: row, error } = await getDb()
      .from('properties')
      .insert({
        title: base.title,
        description: base.description,
        location: base.location,
        property_type: base.property_type,
        price: base.price,
        area: base.area,
        features: base.features ?? [],
        status: base.status,
      })
      .select()
      .single()
    if (error) throw error
    const propertyId = (row as PropertyRow).id
    const savedImages = (await insertMedia(propertyId, images, 'property_images', 'image_url')) as PropertyImage[]
    const savedVideos = (await insertMedia(propertyId, videos, 'property_videos', 'video_url')) as PropertyVideo[]
    return { ...mapPropertyRow(row as PropertyRow), images: savedImages, videos: savedVideos }
  } catch (err) {
    console.warn('[properties] Supabase write failed — falling back to mock data:', err)
    const now = new Date().toISOString()
    const newProperty: Property = { ...data, id: `prop-${Date.now()}`, created_at: now, updated_at: now }
    mockProperties = [...mockProperties, newProperty]
    persistProperties(mockProperties)
    return newProperty
  }
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    const index = mockProperties.findIndex(p => p.id === id)
    if (index === -1) return null
    const updated = { ...mockProperties[index], ...data, updated_at: new Date().toISOString() }
    mockProperties = mockProperties.map((p) => p.id === id ? updated : p)
    persistProperties(mockProperties)
    return updated
  }
  try {
    const { images, videos, ...rest } = data
    const patch: Record<string, unknown> = {}
    if (rest.title !== undefined) patch.title = rest.title
    if (rest.description !== undefined) patch.description = rest.description
    if (rest.location !== undefined) patch.location = rest.location
    if (rest.property_type !== undefined) patch.property_type = rest.property_type
    if (rest.price !== undefined) patch.price = rest.price
    if (rest.area !== undefined) patch.area = rest.area
    if (rest.features !== undefined) patch.features = rest.features
    if (rest.status !== undefined) patch.status = rest.status

    let updated: Property | null = null
    if (Object.keys(patch).length > 0) {
      const { data: row, error } = await getDb()
        .from('properties')
        .update(patch)
        .eq('id', id)
        .select('*, property_images(*), property_videos(*)')
        .maybeSingle()
      if (error) throw error
      updated = row ? mapPropertyRow(row as PropertyRow) : null
    } else {
      updated = await getPropertyById(id)
    }
    if (!updated) return null

    if (images) {
      const { error: delErr } = await getDb().from('property_images').delete().eq('property_id', id)
      if (delErr) throw delErr
      updated.images = (await insertMedia(id, images, 'property_images', 'image_url')) as PropertyImage[]
    }
    if (videos) {
      const { error: delErr } = await getDb().from('property_videos').delete().eq('property_id', id)
      if (delErr) throw delErr
      updated.videos = (await insertMedia(id, videos, 'property_videos', 'video_url')) as PropertyVideo[]
    }
    return updated
  } catch (err) {
    console.warn('[properties] Supabase write failed — falling back to mock data:', err)
    const index = mockProperties.findIndex(p => p.id === id)
    if (index === -1) return null
    const updated = { ...mockProperties[index], ...data, updated_at: new Date().toISOString() }
    mockProperties = mockProperties.map((p) => p.id === id ? updated : p)
    persistProperties(mockProperties)
    return updated
  }
}

export async function deleteProperty(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const initial = mockProperties.length
    mockProperties = mockProperties.filter(p => p.id !== id)
    persistProperties(mockProperties)
    return mockProperties.length < initial
  }
  try {
    const { data, error } = await getDb().from('properties').delete().eq('id', id).select('id')
    if (error) throw error
    return (data ?? []).length > 0
  } catch (err) {
    console.warn('[properties] Supabase delete failed — falling back to mock data:', err)
    const initial = mockProperties.length
    mockProperties = mockProperties.filter(p => p.id !== id)
    persistProperties(mockProperties)
    return mockProperties.length < initial
  }
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
