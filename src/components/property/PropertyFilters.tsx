'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PropertyFilters as PropertyFiltersType } from '@/types'
import { LOCATIONS, PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface PropertyFiltersProps {
  filters: PropertyFiltersType
  onChange: (filters: PropertyFiltersType) => void
}

export default function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key: keyof PropertyFiltersType, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value === 'all' || value === '' ? undefined : value })
  }

  const clearFilters = () => onChange({})
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, location, or type..." value={filters.search || ''} onChange={(e) => updateFilter('search', e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="shrink-0">
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="shrink-0">
            <X className="mr-2 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
      {showAdvanced && (
        <div className="grid grid-cols-1 gap-3 rounded-lg border bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Select value={filters.location || 'all'} onChange={(e) => updateFilter('location', e.target.value)}>
              {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Property Type</label>
            <Select value={filters.propertyType || 'all'} onChange={(e) => updateFilter('propertyType', e.target.value)}>
              <option value="all">All Types</option>
              {PROPERTY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Availability</label>
            <Select value={filters.availability || 'all'} onChange={(e) => updateFilter('availability', e.target.value)}>
              <option value="all">All Statuses</option>
              {PROPERTY_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Min Budget</label>
            <Input type="number" placeholder="e.g. 1000000" value={filters.minBudget || ''} onChange={(e) => updateFilter('minBudget', Number(e.target.value) || undefined)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Max Budget</label>
            <Input type="number" placeholder="e.g. 10000000" value={filters.maxBudget || ''} onChange={(e) => updateFilter('maxBudget', Number(e.target.value) || undefined)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Min Size (sq.ft)</label>
            <Input type="number" placeholder="e.g. 1000" value={filters.minSize || ''} onChange={(e) => updateFilter('minSize', Number(e.target.value) || undefined)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Max Size (sq.ft)</label>
            <Input type="number" placeholder="e.g. 5000" value={filters.maxSize || ''} onChange={(e) => updateFilter('maxSize', Number(e.target.value) || undefined)} />
          </div>
        </div>
      )}
    </div>
  )
}
