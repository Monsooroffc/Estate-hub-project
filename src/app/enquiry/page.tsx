import { Metadata } from 'next'
import { getProperties, getPropertyById } from '@/lib/data/properties'
import EnquiryForm from '@/components/enquiry/EnquiryForm'
import { Clock3, CalendarCheck, FileCheck2, Phone, Mail } from 'lucide-react'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Enquire Now — RRR Housing',
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Trust / info panel */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enquire Now</h1>
            <p className="mt-2 text-muted-foreground">
              Tell us what you&apos;re looking for and our team will get back to you within 24 hours.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              { icon: Clock3, title: '24-Hour Response', desc: 'Every enquiry is answered by our team within one working day.' },
              { icon: CalendarCheck, title: 'Free Site Visit', desc: 'We arrange guided site visits at your convenience — no obligation.' },
              { icon: FileCheck2, title: 'Clear-Title Documentation', desc: 'DTCP & CMDA approved properties with full paperwork support.' },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-slate-900 p-6 text-slate-300">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Prefer to talk?</p>
            <div className="mt-4 space-y-3 text-sm">
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-3 transition-colors hover:text-violet-400">
                <Phone className="h-4 w-4 shrink-0 text-violet-400" /> {CONTACT_PHONE}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 transition-colors hover:text-violet-400">
                <Mail className="h-4 w-4 shrink-0 text-violet-400" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <EnquiryForm preselectedProperty={preselectedProperty} properties={properties} />
          </div>
        </div>
      </div>
    </div>
  )
}
