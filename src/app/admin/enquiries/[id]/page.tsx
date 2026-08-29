'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, MessageSquare, User } from 'lucide-react'
import { Enquiry, EnquiryStatus, LeadPriority, LeadStatus } from '@/types'
import { getEnquiryById, updateEnquiry } from '@/lib/data/enquiries'
import { createLead } from '@/lib/data/leads'
import { formatDate, formatPrice } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import StatusBadge from '@/components/admin/StatusBadge'

export default function AdminEnquiryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const load = async () => {
      const data = await getEnquiryById(id as string)
      setEnquiry(data)
      setNotes(data?.notes || '')
      setLoading(false)
    }
    load()
  }, [id])

  const handleStatusChange = async (status: EnquiryStatus) => {
    if (!enquiry) return
    await updateEnquiry(enquiry.id, { status })
    const updated = await getEnquiryById(enquiry.id)
    setEnquiry(updated)
  }

  const handleSaveNotes = async () => {
    if (!enquiry) return
    await updateEnquiry(enquiry.id, { notes })
    const updated = await getEnquiryById(enquiry.id)
    setEnquiry(updated)
  }

  const handleConvertToLead = async () => {
    if (!enquiry) return
    await createLead({
      enquiry_id: enquiry.id,
      property_id: enquiry.property_id,
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      budget: enquiry.budget,
      priority: 'WARM',
      status: 'NEW',
      notes: enquiry.notes || '',
      next_followup: null,
    })
    router.push('/admin/leads')
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!enquiry) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium">Enquiry not found</p>
        <Link href="/admin/enquiries">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Enquiries
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/enquiries">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Enquiry Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{enquiry.name}</h2>
              </div>
              <StatusBadge status={enquiry.status} />
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {enquiry.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {enquiry.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted on {formatDate(enquiry.created_at)}
              </div>
              {enquiry.budget && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Budget:</span>
                  {formatPrice(enquiry.budget)}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Message
              </h3>
              <p className="rounded-md bg-slate-50 p-4 text-sm leading-relaxed text-muted-foreground">
                {enquiry.message}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold">Notes</h3>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this enquiry..."
            />
            <Button onClick={handleSaveNotes} className="mt-3">
              Save Notes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold">Actions</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Update Status
                </label>
                <Select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="SITE_VISIT">Site Visit</option>
                  <option value="CLOSED">Closed</option>
                </Select>
              </div>
              <Button onClick={handleConvertToLead} className="w-full">
                Convert to Lead
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold">Interested Property</h3>
            {enquiry.property ? (
              <div className="space-y-2">
                <p className="font-medium">{enquiry.property.title}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {enquiry.property.location}
                </div>
                <p className="text-sm font-medium text-primary">{formatPrice(enquiry.property.price)}</p>
                <Link href={`/admin/properties/${enquiry.property.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Property
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No property selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
