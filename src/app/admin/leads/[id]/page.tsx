'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, MapPin, User, Flame } from 'lucide-react'
import { Lead, LeadPriority, LeadStatus } from '@/types'
import { getLeadById, updateLead } from '@/lib/data/leads'
import { formatDate, formatPrice } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import StatusBadge from '@/components/admin/StatusBadge'

export default function AdminLeadDetailPage() {
  const { id } = useParams()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [nextFollowup, setNextFollowup] = useState('')

  useEffect(() => {
    const load = async () => {
      const data = await getLeadById(id as string)
      setLead(data)
      setNotes(data?.notes || '')
      setNextFollowup(data?.next_followup ? data.next_followup.slice(0, 16) : '')
      setLoading(false)
    }
    load()
  }, [id])

  const handleUpdate = async (updates: Partial<Lead>) => {
    if (!lead) return
    await updateLead(lead.id, updates)
    const updated = await getLeadById(lead.id)
    setLead(updated)
  }

  const handleSaveNotes = () => {
    handleUpdate({ notes, next_followup: nextFollowup || null })
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium">Lead not found</p>
        <Link href="/admin/leads">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Lead Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{lead.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={lead.priority} type="lead" />
                <StatusBadge status={lead.status} type="lead" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {lead.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {lead.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created on {formatDate(lead.created_at)}
              </div>
              {lead.budget && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Budget:</span>
                  {formatPrice(lead.budget)}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold">Notes & Follow-up</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Next Follow-up
                </label>
                <Input
                  type="datetime-local"
                  value={nextFollowup}
                  onChange={(e) => setNextFollowup(e.target.value)}
                />
              </div>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about interactions, preferences, next steps..."
              />
              <Button onClick={handleSaveNotes}>Save Updates</Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold">Actions</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Priority
                </label>
                <Select
                  value={lead.priority}
                  onChange={(e) => handleUpdate({ priority: e.target.value as LeadPriority })}
                >
                  <option value="HOT">Hot</option>
                  <option value="WARM">Warm</option>
                  <option value="COLD">Cold</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Status
                </label>
                <Select
                  value={lead.status}
                  onChange={(e) => handleUpdate({ status: e.target.value as LeadStatus })}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="SITE_VISIT">Site Visit</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold">Interested Property</h3>
            {lead.property ? (
              <div className="space-y-2">
                <p className="font-medium">{lead.property.title}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lead.property.location}
                </div>
                <p className="text-sm font-medium text-primary">{formatPrice(lead.property.price)}</p>
                <Link href={`/admin/properties/${lead.property.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Property
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No property linked</p>
            )}
          </div>

          {lead.enquiry && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">Source Enquiry</h3>
              <p className="text-sm text-muted-foreground">
                Converted from enquiry on {formatDate(lead.enquiry.created_at)}
              </p>
              <Link href={`/admin/enquiries/${lead.enquiry.id}`}>
                <Button variant="outline" size="sm" className="mt-2">
                  View Enquiry
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
