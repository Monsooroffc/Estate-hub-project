import { Metadata } from 'next'
import { getProperties } from '@/lib/data/properties'
import PropertyGrid from '@/components/property/PropertyGrid'
import PropertyFiltersClient from '@/components/property/PropertyFiltersClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Properties — RRR Housing',
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
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-10 text-white sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 right-32 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-sm text-white/80">Home / Properties</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Find Your Perfect Property</h1>
          <p className="mt-2 max-w-2xl text-white/80">
            {properties.length} live listing{properties.length !== 1 ? 's' : ''} across Chennai — DTCP &amp; CMDA approved plots, villas, flats &amp; commercial spaces with clear titles.
          </p>
        </div>
      </div>
      <PropertyFiltersClient initialFilters={filters} />
      <div className="mt-8">
        <PropertyGrid properties={properties} />
      </div>
    </div>
  )
}
