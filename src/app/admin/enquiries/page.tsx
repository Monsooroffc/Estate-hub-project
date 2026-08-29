'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Eye, ArrowRight } from 'lucide-react'
import { Enquiry, EnquiryStatus } from '@/types'
import { getEnquiries, updateEnquiryStatus } from '@/lib/data/enquiries'
import { formatDate } from '@/lib/utils/format'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/admin/StatusBadge'
import DataTable from '@/components/admin/DataTable'

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all')

  const fetchEnquiries = async () => {
    setLoading(true)
    const data = await getEnquiries({ search: search || undefined, status: statusFilter })
    setEnquiries(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEnquiries()
  }, [statusFilter])

  useEffect(() => {
    const timeout = setTimeout(fetchEnquiries, 300)
    return () => clearTimeout(timeout)
  }, [search])

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    await updateEnquiryStatus(id, status)
    fetchEnquiries()
  }

  const columns = [
    { key: 'name', header: 'Name', cell: (e: Enquiry) => e.name },
    { key: 'phone', header: 'Phone', cell: (e: Enquiry) => e.phone },
    { key: 'email', header: 'Email', cell: (e: Enquiry) => e.email },
    {
      key: 'property',
      header: 'Property',
      cell: (e: Enquiry) => e.property?.title || 'General Enquiry',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (e: Enquiry) => (
        <Select
          value={e.status}
          onChange={(ev) => handleStatusChange(e.id, ev.target.value as EnquiryStatus)}
          className="h-8 text-xs"
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="SITE_VISIT">Site Visit</option>
          <option value="CLOSED">Closed</option>
        </Select>
      ),
    },
    { key: 'created', header: 'Created', cell: (e: Enquiry) => formatDate(e.created_at) },
    {
      key: 'actions',
      header: 'Actions',
      cell: (e: Enquiry) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/enquiries/${e.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
        <p className="text-sm text-muted-foreground">Manage customer enquiries</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EnquiryStatus | 'all')}
          className="max-w-[180px]"
        >
          <option value="all">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="SITE_VISIT">Site Visit</option>
          <option value="CLOSED">Closed</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={enquiries} keyExtractor={(e) => e.id} />
      )}
    </div>
  )
}
