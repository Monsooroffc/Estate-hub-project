'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Property } from '@/types'
import { EnquiryFormData } from '@/lib/utils/validation'
import { enquirySchema } from '@/lib/utils/validation'
import { createEnquiry } from '@/lib/data/enquiries'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

interface EnquiryFormProps {
  preselectedProperty?: Property | null
  properties?: Property[]
}

export default function EnquiryForm({ preselectedProperty, properties = [] }: EnquiryFormProps) {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '', phone: '', email: '', budget: 0, property_id: preselectedProperty?.id || '', message: '',
  })

  const handleChange = (field: keyof EnquiryFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = enquirySchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    try {
      await createEnquiry({
        property_id: formData.property_id || null,
        name: formData.name, phone: formData.phone, email: formData.email,
        budget: formData.budget || null, message: formData.message,
      })
      setSubmitted(true)
      setTimeout(() => router.push('/properties'), 2500)
    } catch {
      setErrors({ submit: 'Failed to submit enquiry. Please try again.' })
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-green-50 p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-xl font-semibold text-green-900">Enquiry Submitted!</h3>
        <p className="mt-2 text-green-700">Thank you for your interest. Our team will contact you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="John Doe" />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="9876543210" />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="john@example.com" />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="budget">Budget</Label>
          <Input id="budget" type="number" value={formData.budget || ''} onChange={(e) => handleChange('budget', Number(e.target.value))} placeholder="5000000" />
          {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="property_id">Interested Property</Label>
        <Select id="property_id" value={formData.property_id} onChange={(e) => handleChange('property_id', e.target.value)}>
          <option value="">General Enquiry</option>
          {properties.map((property) => <option key={property.id} value={property.id}>{property.title} — {property.location}</option>)}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={4} value={formData.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Tell us more about what you are looking for..." />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>
      {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
      <Button type="submit" size="lg" className="w-full md:w-auto">Submit Enquiry</Button>
    </form>
  )
}
