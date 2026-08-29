import Link from 'next/link'
import { Building2, Mail, Phone, MapPin } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-black tracking-tight text-primary-foreground">RRR</span>
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="text-sm font-semibold tracking-wide text-violet-400">{APP_TAGLINE}</p>
            <p className="text-sm leading-relaxed text-slate-400">RERA approved · DTCP &amp; CMDA approved plots, flats &amp; villas · ISO 27001:2013 certified developer based in Porur, Chennai.</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['RERA', 'DTCP', 'CMDA', 'ISO 27001'].map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">{chip}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/" className="transition-colors hover:text-violet-400">Home</Link></li>
              <li><Link href="/properties" className="transition-colors hover:text-violet-400">Properties</Link></li>
              <li><Link href="/enquiry" className="transition-colors hover:text-violet-400">Enquire Now</Link></li>
              <li><Link href="/admin/login" className="transition-colors hover:text-violet-400">Admin Portal</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-violet-400" /> {CONTACT_PHONE}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-violet-400" /> {CONTACT_EMAIL}</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-violet-400" /> {CONTACT_ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} {APP_NAME} (Real Rise Resource). All rights reserved.
        </div>
      </div>
    </footer>
  )
}
