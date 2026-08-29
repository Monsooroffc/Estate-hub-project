'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { PropertyFilters as PropertyFiltersType } from '@/types'
import PropertyFilters from './PropertyFilters'

interface PropertyFiltersClientProps {
  initialFilters: PropertyFiltersType
}

export default function PropertyFiltersClient({ initialFilters }: PropertyFiltersClientProps) {
  const router = useRouter()

  const handleChange = useCallback((filters: PropertyFiltersType) => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.location && filters.location !== 'All Locations') params.set('location', filters.location)
    if (filters.propertyType && filters.propertyType !== 'all') params.set('type', filters.propertyType)
    if (filters.availability && filters.availability !== 'all') params.set('status', filters.availability)
    if (filters.minBudget) params.set('minBudget', String(filters.minBudget))
    if (filters.maxBudget) params.set('maxBudget', String(filters.maxBudget))
    if (filters.minSize) params.set('minSize', String(filters.minSize))
    if (filters.maxSize) params.set('maxSize', String(filters.maxSize))
    const query = params.toString()
    router.push(`/properties${query ? `?${query}` : ''}`)
  }, [router])

  return <PropertyFilters filters={initialFilters} onChange={handleChange} />
}
