'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Property, PropertyImage, PropertyVideo } from '@/types'
import { PropertyFormData } from '@/lib/utils/validation'
import { getProperties, deleteProperty, createProperty, updateProperty } from '@/lib/data/properties'
import { formatPrice, formatArea, formatDate } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import StatusBadge from '@/components/admin/StatusBadge'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import PropertyForm from '@/components/property/PropertyForm'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | undefined>()

  const fetchProperties = async () => {
    setLoading(true)
    const data = await getProperties()
    setProperties(data)
    setLoading(false)
  }

  useEffect(() => { fetchProperties() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    await deleteProperty(id)
    fetchProperties()
  }

  const handleEdit = (property: Property) => { setEditingProperty(property); setModalOpen(true) }
  const handleAdd = () => { setEditingProperty(undefined); setModalOpen(true) }

  const handleFormSubmit = async (data: PropertyFormData) => {
    // Convert comma-separated URLs into PropertyImage[] / PropertyVideo[] (storage-ready shape).
    const { images, videos, ...propertyData } = data
    const imageUrls = (images || '').split(',').map((url) => url.trim()).filter(Boolean)
    const videoUrls = (videos || '').split(',').map((url) => url.trim()).filter(Boolean)
    const propertyImages: PropertyImage[] = imageUrls.map((url, index) => {
      // Preserve existing image ids when the URL is unchanged (safe for future Supabase rows).
      const existing = editingProperty?.images?.find((img) => img.image_url === url)
      return (
        existing || {
          id: `img-${Date.now()}-${index}`,
          property_id: editingProperty?.id || '',
          image_url: url,
          created_at: new Date().toISOString(),
        }
      )
    })
    const propertyVideos: PropertyVideo[] = videoUrls.map((url, index) => {
      const existing = editingProperty?.videos?.find((v) => v.video_url === url)
      return (
        existing || {
          id: `vid-${Date.now()}-${index}`,
          property_id: editingProperty?.id || '',
          video_url: url,
          created_at: new Date().toISOString(),
        }
      )
    })
    if (editingProperty) await updateProperty(editingProperty.id, { ...propertyData, images: propertyImages, videos: propertyVideos })
    else await createProperty({ ...propertyData, images: propertyImages, videos: propertyVideos })
    setModalOpen(false)
    setEditingProperty(undefined)
    fetchProperties()
  }

  const filtered = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'title', header: 'Title', cell: (p: Property) => p.title },
    { key: 'location', header: 'Location', cell: (p: Property) => p.location },
    { key: 'type', header: 'Type', cell: (p: Property) => <span className="capitalize">{p.property_type}</span> },
    { key: 'price', header: 'Price', cell: (p: Property) => formatPrice(p.price) },
    { key: 'area', header: 'Area', cell: (p: Property) => formatArea(p.area) },
    { key: 'status', header: 'Status', cell: (p: Property) => <StatusBadge status={p.status} type="property" /> },
    { key: 'created', header: 'Created', cell: (p: Property) => formatDate(p.created_at) },
    { key: 'actions', header: 'Actions', cell: (p: Property) => (
      <div className="flex items-center gap-2">
        <Link href={`/admin/properties/${p.id}`}><Button variant="ghost" size="sm">View</Button></Link>
        <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Properties</h1><p className="text-sm text-muted-foreground">Manage your property listings</p></div>
        <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Property</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      {loading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : <DataTable columns={columns} data={filtered} keyExtractor={(p) => p.id} />}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingProperty ? 'Edit Property' : 'Add Property'}>
        <PropertyForm property={editingProperty} onSubmit={handleFormSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
