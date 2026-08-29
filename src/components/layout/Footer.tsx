import Link from 'next/link'
import { Building2, Mail, Phone, MapPin } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
            <p className="text-sm text-muted-foreground">Building trust through transparency since 1995.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/properties" className="hover:text-primary transition-colors">Properties</Link></li>
              <li><Link href="/enquiry" className="hover:text-primary transition-colors">Enquire Now</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@estatehub.in</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> 123 Main Road, Downtown, City - 560001</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
