'use client'

import { useState, useEffect, useCallback } from 'react'
import { Property, PropertyFilters } from '@/types'
import { getProperties, getPropertyById } from '@/lib/data/properties'

export function useProperties(initialFilters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {})

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProperties(filters)
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  return { properties, loading, error, filters, setFilters, refetch: fetchProperties }
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPropertyById(id)
        setProperty(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property')
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  return { property, loading, error }
}
