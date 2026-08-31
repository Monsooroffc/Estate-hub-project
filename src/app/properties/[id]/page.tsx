import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Maximize, IndianRupee, Calendar, Check, ArrowRight } from 'lucide-react'
import { getPropertyById, getProperties } from '@/lib/data/properties'
import { formatPrice, formatArea, formatDate } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PropertyGallery from '@/components/property/PropertyGallery'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true

interface PropertyDetailPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const properties = await getProperties()
  return properties.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getPropertyById(params.id)
  return { title: property ? `${property.title} — RRR Housing` : 'Property — RRR Housing', description: property?.description || 'View property details on RRR Housing' }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyById(params.id)
  if (!property) notFound()

  const statusVariant = property.status === 'available' ? 'success' : property.status === 'sold' ? 'destructive' : 'warning'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/properties" className="hover:text-primary">Properties</Link><span>/</span><span className="text-foreground">{property.title}</span>
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        <PropertyGallery images={property.images || []} videos={property.videos || []} title={property.title} />
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant} className="capitalize">{property.status}</Badge>
              <Badge variant="secondary" className="capitalize">{property.property_type}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}</div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-lg">
            <div className="flex items-center gap-2 font-semibold text-primary"><IndianRupee className="h-5 w-5" />{formatPrice(property.price)}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Maximize className="h-5 w-5" />{formatArea(property.area)}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-5 w-5" />Listed {formatDate(property.created_at)}</div>
          </div>
          <p className="leading-relaxed text-muted-foreground">{property.description}</p>
          <div>
            <h3 className="mb-3 font-semibold">Features</h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {property.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-600" />{feature}</li>)}
            </ul>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href={`/enquiry?property=${property.id}`}><Button size="lg" className="gap-2">Enquire About This Property <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/properties"><Button size="lg" variant="outline">Back to Listings</Button></Link>
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Location</h2>
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-2 font-medium">{property.location}</p>
              <p className="text-sm text-muted-foreground">Map integration ready — connect Google Maps or Mapbox here.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
