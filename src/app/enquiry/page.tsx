import { Metadata } from 'next'
import { getProperties, getPropertyById } from '@/lib/data/properties'
import EnquiryForm from '@/components/enquiry/EnquiryForm'

export const metadata: Metadata = {
  title: 'Enquire Now — EstateHub',
  description: 'Submit an enquiry and our team will get back to you shortly.',
}

interface EnquiryPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EnquiryPage({ searchParams }: EnquiryPageProps) {
  const properties = await getProperties()
  const propertyId = typeof searchParams.property === 'string' ? searchParams.property : undefined
  const preselectedProperty = propertyId ? await getPropertyById(propertyId) : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Enquire Now</h1>
        <p className="mt-2 text-muted-foreground">Fill in your details and we will get back to you within 24 hours.</p>
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm sm:p-8">
        <EnquiryForm preselectedProperty={preselectedProperty} properties={properties} />
      </div>
    </div>
  )
}
