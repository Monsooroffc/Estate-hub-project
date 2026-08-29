import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Maximize, IndianRupee } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatArea } from '@/lib/utils/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface PropertyCardProps { property: Property }

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0]?.image_url || ''
  const statusVariant = property.status === 'available' ? 'success' : property.status === 'sold' ? 'destructive' : 'warning'

  return (
    <div className="group rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={property.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No Image</div>
        )}
        <div className="absolute top-3 left-3"><Badge variant={statusVariant} className="capitalize">{property.status}</Badge></div>
        <div className="absolute top-3 right-3"><Badge variant="secondary" className="capitalize">{property.property_type}</Badge></div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Maximize className="h-4 w-4" />
            <span>{formatArea(property.area)}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary">
            <IndianRupee className="h-4 w-4" />
            <span>{formatPrice(property.price)}</span>
          </div>
        </div>
        <Link href={`/properties/${property.id}`}>
          <Button className="w-full mt-2">View Details</Button>
        </Link>
      </div>
    </div>
  )
}
