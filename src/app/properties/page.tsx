import { Metadata } from 'next'
import { getProperties } from '@/lib/data/properties'
import PropertyGrid from '@/components/property/PropertyGrid'
import PropertyFiltersClient from '@/components/property/PropertyFiltersClient'

export const metadata: Metadata = {
  title: 'Properties — EstateHub',
  description: 'Browse our curated collection of residential, commercial, and land properties.',
}

interface PropertiesPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const filters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    propertyType: typeof searchParams.type === 'string' ? (searchParams.type as any) : undefined,
    availability: typeof searchParams.status === 'string' ? (searchParams.status as any) : undefined,
    minBudget: typeof searchParams.minBudget === 'string' ? Number(searchParams.minBudget) : undefined,
    maxBudget: typeof searchParams.maxBudget === 'string' ? Number(searchParams.maxBudget) : undefined,
    minSize: typeof searchParams.minSize === 'string' ? Number(searchParams.minSize) : undefined,
    maxSize: typeof searchParams.maxSize === 'string' ? Number(searchParams.maxSize) : undefined,
  }
  const properties = await getProperties(filters)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="mt-1 text-muted-foreground">{properties.length} listing{properties.length !== 1 ? 's' : ''} available</p>
      </div>
      <PropertyFiltersClient initialFilters={filters} />
      <div className="mt-8">
        <PropertyGrid properties={properties} />
      </div>
    </div>
  )
}
