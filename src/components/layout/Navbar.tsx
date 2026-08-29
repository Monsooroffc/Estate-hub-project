'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Building2, Phone, Shield } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/enquiry', label: 'Enquire', icon: Phone },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-black tracking-tight text-primary-foreground">RRR</span>
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn('text-sm font-medium transition-colors hover:text-primary', pathname === link.href ? 'text-primary' : 'text-muted-foreground')}>
              {link.label}
            </Link>
          ))}
          <Link href="/admin/login" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <Shield className="h-4 w-4" /> Admin
          </Link>
          <Link href="/enquiry">
            <Button size="sm" className="ml-1">Enquire Now</Button>
          </Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={cn('flex items-center gap-2 text-sm font-medium', pathname === link.href ? 'text-primary' : 'text-muted-foreground')}>
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}
          <Link href="/admin/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Shield className="h-4 w-4" /> Admin
          </Link>
        </div>
      )}
    </header>
  )
}
