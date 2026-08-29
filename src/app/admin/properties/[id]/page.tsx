'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Maximize, IndianRupee, Calendar, Check } from 'lucide-react'
import { Property } from '@/types'
import { getPropertyById } from '@/lib/data/properties'
import { formatPrice, formatArea, formatDate } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PropertyGallery from '@/components/property/PropertyGallery'

export default function AdminPropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await getPropertyById(id as string)
      setProperty(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium">Property not found</p>
        <Link href="/admin/properties"><Button variant="outline" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties</Button></Link>
      </div>
    )
  }

  const statusVariant = property.status === 'available' ? 'success' : property.status === 'sold' ? 'destructive' : 'warning'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties"><Button variant="outline" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button></Link>
        <h1 className="text-2xl font-bold tracking-tight">Property Details</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <PropertyGallery images={property.images || []} title={property.title} />
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant} className="capitalize">{property.status}</Badge>
            <Badge variant="secondary" className="capitalize">{property.property_type}</Badge>
          </div>
          <h2 className="text-2xl font-bold">{property.title}</h2>
          <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}</div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 font-semibold text-primary"><IndianRupee className="h-5 w-5" />{formatPrice(property.price)}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Maximize className="h-5 w-5" />{formatArea(property.area)}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-5 w-5" />{formatDate(property.created_at)}</div>
          </div>
          <p className="leading-relaxed text-muted-foreground">{property.description}</p>
          <div>
            <h3 className="mb-2 font-semibold">Features</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => <span key={feature} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium"><Check className="h-3 w-3 text-green-600" />{feature}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
