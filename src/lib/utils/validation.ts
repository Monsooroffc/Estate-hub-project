import { z } from 'zod'

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email'),
  budget: z.coerce.number().min(1, 'Budget is required'),
  property_id: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type EnquiryFormData = z.infer<typeof enquirySchema>

export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location is required'),
  property_type: z.enum(['residential', 'commercial', 'land', 'villa', 'apartment', 'plot']),
  price: z.coerce.number().min(1, 'Price is required'),
  area: z.coerce.number().min(1, 'Area is required'),
  features: z.string().transform((val) =>
    val.split(',').map((f) => f.trim()).filter(Boolean)
  ),
  status: z.enum(['available', 'sold', 'reserved']),
  images: z.string().optional(), // comma-separated image URLs (Supabase Storage-ready)
})

export type PropertyFormData = z.infer<typeof propertySchema>

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  budget: z.coerce.number().min(1, 'Budget is required'),
  priority: z.enum(['HOT', 'WARM', 'COLD']),
  status: z.enum(['NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT', 'NEGOTIATION', 'WON', 'LOST']),
  notes: z.string().optional(),
  next_followup: z.string().optional(),
  property_id: z.string().optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
