'use client'

import { useState } from 'react'
import { Property } from '@/types'
import { PropertyFormData, propertySchema } from '@/lib/utils/validation'
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => void
  onCancel: () => void
}

export default function PropertyForm({ property, onSubmit, onCancel }: PropertyFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    location: property?.location || '',
    property_type: property?.property_type || 'residential',
    price: property?.price || 0,
    area: property?.area || 0,
    features: property?.features?.join(', ') || '',
    status: property?.status || 'available',
    images: property?.images?.map((img) => img.image_url).join(', ') || '',
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = propertySchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
          {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="property_type">Property Type</Label>
          <Select id="property_type" value={formData.property_type} onChange={(e) => handleChange('property_type', e.target.value)}>
            {PROPERTY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
            {PROPERTY_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={formData.price || ''} onChange={(e) => handleChange('price', Number(e.target.value))} />
          {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="area">Area (sq.ft)</Label>
          <Input id="area" type="number" value={formData.area || ''} onChange={(e) => handleChange('area', Number(e.target.value))} />
          {errors.area && <p className="text-xs text-red-500">{errors.area}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="features">Features (comma separated)</Label>
        <Input id="features" value={formData.features} onChange={(e) => handleChange('features', e.target.value)} placeholder="e.g. 3 BHK, Garden, Parking" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="images">Image URLs (comma separated)</Label>
        <Textarea
          id="images"
          rows={2}
          value={formData.images}
          onChange={(e) => handleChange('images', e.target.value)}
          placeholder="https://images.unsplash.com/photo-..., https://images.unsplash.com/photo-..."
        />
        <p className="text-xs text-muted-foreground">Paste image URLs here. Once Supabase Storage is connected, these will be uploaded files.</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit">{property ? 'Update Property' : 'Add Property'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
