import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, CheckCircle, Clock3, MapPin, Maximize, Phone, Shield, TrendingUp, Users, Home as HomeIcon } from 'lucide-react'
import { getFeaturedProperties, getLocations, getProperties } from '@/lib/data/properties'
import { APP_NAME, APP_TAGLINE, CONTACT_PHONE } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import PropertyCard from '@/components/property/PropertyCard'

export default async function HomePage() {
  const featured = await getFeaturedProperties(4)
  const allProperties = await getProperties()
  const locations = await getLocations()

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80" alt="Hero background" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Shield className="h-3.5 w-3.5 text-green-400" /> RERA Approved · DTCP &amp; CMDA · ISO 27001:2013
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Own a Piece of <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">Chennai&apos;s Future</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-300 sm:text-xl">
              {APP_NAME} — {APP_TAGLINE}. DTCP &amp; CMDA approved plots, flats &amp; villas across Porur and West Chennai, handpicked for families and investors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/properties"><Button size="lg" className="gap-2 shadow-lg shadow-primary/25">Browse Properties <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/enquiry"><Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-900">Book a Free Site Visit</Button></Link>
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-slate-900/70 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 text-center sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              { value: `${allProperties.length}`, label: 'Live Listings', icon: Building2 },
              { value: `${locations.filter((l) => l !== 'All Locations').length}`, label: 'Prime Chennai Locations', icon: MapPin },
              { value: '100%', label: 'Clear-Title Focus', icon: Shield },
              { value: '24hr', label: 'Enquiry Response', icon: Clock3 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  <stat.icon className="h-5 w-5 text-emerald-400" /> {stat.value}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700">About Us</span>
            <h2 className="text-3xl font-bold tracking-tight">About {APP_NAME}</h2>
            <p className="text-muted-foreground leading-relaxed">RRR Housing (Real Rise Resource) is a RERA-approved, ISO 27001:2013 certified real estate developer based in Porur, Chennai. We specialise in DTCP &amp; CMDA approved plots, flats &amp; villas — helping families and investors own clear-title properties with complete transparency.</p>
            <ul className="space-y-2">
              {['RERA approved — transparent, regulated transactions', 'DTCP & CMDA approved plots, flats & villas', 'ISO 27001:2013 certified processes', 'End-to-end assistance from enquiry to registration'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm"><CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" alt="About us" fill className="object-cover" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur">
              <Shield className="h-4 w-4 text-green-600" /> RERA · DTCP · CMDA Approved
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Properties</h2>
            <p className="mt-1 text-muted-foreground">Handpicked listings for you</p>
          </div>
          <Link href="/properties"><Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Property Categories</h2>
            <p className="mt-2 text-muted-foreground">Browse by type</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Land', icon: MapPin, href: '/properties?type=land', accent: 'bg-green-100 text-green-600' },
              { label: 'Plot', icon: Maximize, href: '/properties?type=plot', accent: 'bg-amber-100 text-amber-600' },
              { label: 'Villa', icon: HomeIcon, href: '/properties?type=villa', accent: 'bg-violet-100 text-violet-600' },
              { label: 'Apartment', icon: Building2, href: '/properties?type=apartment', accent: 'bg-sky-100 text-sky-600' },
              { label: 'Residential', icon: Users, href: '/properties?type=residential', accent: 'bg-rose-100 text-rose-600' },
              { label: 'Commercial', icon: TrendingUp, href: '/properties?type=commercial', accent: 'bg-indigo-100 text-indigo-600' },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href} className="group flex flex-col items-center gap-3 rounded-xl border bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${cat.accent} transition-transform group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Popular Locations</h2>
          <p className="mt-1 text-muted-foreground">Where our customers love to invest</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {locations.filter((l) => l !== 'All Locations').map((location) => (
            <Link key={location} href={`/properties?location=${encodeURIComponent(location)}`} className="group flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition-transform group-hover:scale-110">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold">{location}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Us</h2>
            <p className="mt-2 text-muted-foreground">What makes {APP_NAME} different</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[{ title: 'RERA Approved', desc: 'Registered under RERA — every transaction is transparent and regulated.', icon: Shield }, { title: 'DTCP & CMDA Approved', desc: 'Clear-title plots, flats & villas with fully approved layouts.', icon: CheckCircle }, { title: 'Chennai Expertise', desc: 'Deep local knowledge of Porur and Chennai neighborhoods.', icon: MapPin }, { title: 'End-to-End Support', desc: 'From site visits to documentation, we handle it all.', icon: Phone }].map((item) => (
              <div key={item.title} className="rounded-xl border bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-14 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -left-14 -top-14 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Find Your Property?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">Browse our listings or reach out for personalized assistance. Our team is here to help.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/properties"><Button size="lg" className="gap-2 bg-white text-violet-700 hover:bg-white/90">View Properties <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>
                <Button size="lg" variant="outline" className="gap-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Phone className="h-4 w-4" /> {CONTACT_PHONE}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
