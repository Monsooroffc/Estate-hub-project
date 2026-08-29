'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import { Lead, LeadFilters, LeadPriority, LeadStatus } from '@/types'
import { getLeads, deleteLead } from '@/lib/data/leads'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import LeadTable from '@/components/admin/LeadTable'
import Modal from '@/components/admin/Modal'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LeadFilters>({})

  const fetchLeads = async () => {
    setLoading(true)
    const data = await getLeads(filters)
    setLeads(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [filters])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    await deleteLead(id)
    fetchLeads()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">Manage your sales pipeline</p>
        </div>
        <Link href="/admin/leads/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Lead
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.status || 'all'}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value === 'all' ? undefined : (e.target.value as LeadStatus),
            }))
          }
          className="max-w-[180px]"
        >
          <option value="all">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="SITE_VISIT">Site Visit</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </Select>
        <Select
          value={filters.priority || 'all'}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priority: e.target.value === 'all' ? undefined : (e.target.value as LeadPriority),
            }))
          }
          className="max-w-[160px]"
        >
          <option value="all">All Priorities</option>
          <option value="HOT">Hot</option>
          <option value="WARM">Warm</option>
          <option value="COLD">Cold</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <LeadTable
          leads={leads}
          onRowClick={(lead) => {
            window.location.href = `/admin/leads/${lead.id}`
          }}
        />
      )}
    </div>
  )
}
