import { Property } from '@/types'
import PropertyCard from './PropertyCard'

interface PropertyGridProps { properties: Property[] }

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-muted-foreground">No properties found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
    </div>
  )
}
