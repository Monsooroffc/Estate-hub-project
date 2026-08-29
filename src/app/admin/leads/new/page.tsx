'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createLead } from '@/lib/data/leads'
import { Button } from '@/components/ui/button'

export default function NewLeadPage() {
  const router = useRouter()

  const handleSubmit = async (data: LeadFormData) => {
    await createLead({
      enquiry_id: null,
      property_id: data.property_id || null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      budget: data.budget,
      priority: data.priority,
      status: data.status,
      notes: data.notes || '',
      next_followup: data.next_followup || null,
    })
    router.push('/admin/leads')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Add New Lead</h1>
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <LeadForm onSubmit={handleSubmit} onCancel={() => router.push('/admin/leads')} />
      </div>
    </div>
  )
}

// Inline lead form component

import { useState } from 'react'
import { leadSchema, LeadFormData } from '@/lib/utils/validation'
import { LEAD_PRIORITIES, LEAD_STATUSES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useProperties } from '@/hooks/useProperties'

function LeadForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: LeadFormData) => void
  onCancel: () => void
}) {
  const { properties } = useProperties()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    budget: 0,
    priority: 'WARM',
    status: 'NEW',
    notes: '',
    next_followup: '',
    property_id: '',
  })

  const handleChange = (field: keyof LeadFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = leadSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="budget">Budget (₹)</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget || ''}
            onChange={(e) => handleChange('budget', Number(e.target.value))}
          />
          {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            {LEAD_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="property_id">Interested Property</Label>
          <Select
            id="property_id"
            value={formData.property_id}
            onChange={(e) => handleChange('property_id', e.target.value)}
          >
            <option value="">None</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="next_followup">Next Follow-up</Label>
          <Input
            id="next_followup"
            type="datetime-local"
            value={formData.next_followup}
            onChange={(e) => handleChange('next_followup', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit">Create Lead</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
