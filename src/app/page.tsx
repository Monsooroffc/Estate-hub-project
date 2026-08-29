import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, MapPin, Phone, Shield, TrendingUp, Users } from 'lucide-react'
import { getFeaturedProperties, getLocations } from '@/lib/data/properties'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import PropertyCard from '@/components/property/PropertyCard'

export default async function HomePage() {
  const featured = await getFeaturedProperties(4)
  const locations = await getLocations()

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80" alt="Hero background" fill className="object-cover" priority />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Find Your Perfect Property</h1>
            <p className="text-lg text-slate-300 sm:text-xl">{APP_TAGLINE}. Explore residential, commercial, and land opportunities handpicked for you.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/properties"><Button size="lg" className="gap-2">View Properties <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/enquiry"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">Enquire Now</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">About {APP_NAME}</h2>
            <p className="text-muted-foreground leading-relaxed">For over two decades, we have helped families and investors find properties that match their dreams. Our deep local expertise, transparent dealings, and commitment to customer satisfaction make us the preferred choice in real estate.</p>
            <ul className="space-y-2">
              {['Family-owned business with 25+ years of trust', 'Extensive portfolio across residential & commercial', 'End-to-end assistance from enquiry to registration', 'Legal clarity and transparent pricing'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm"><CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" alt="About us" fill className="object-cover" />
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
            {[{ label: 'Residential', icon: Users, href: '/properties?type=residential' }, { label: 'Commercial', icon: TrendingUp, href: '/properties?type=commercial' }, { label: 'Land', icon: MapPin, href: '/properties?type=land' }, { label: 'Villa', icon: Shield, href: '/properties?type=villa' }, { label: 'Apartment', icon: Users, href: '/properties?type=apartment' }, { label: 'Plot', icon: MapPin, href: '/properties?type=plot' }].map((cat) => (
              <Link key={cat.label} href={cat.href} className="flex flex-col items-center gap-3 rounded-lg border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <cat.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Popular Locations</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {locations.filter((l) => l !== 'All Locations').map((location) => (
            <Link key={location} href={`/properties?location=${encodeURIComponent(location)}`} className="flex items-center justify-between rounded-lg border bg-white px-5 py-4 text-sm font-medium shadow-sm transition-shadow hover:shadow-md">
              {location}<ArrowRight className="h-4 w-4 text-muted-foreground" />
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
            {[{ title: 'Trusted Legacy', desc: 'Over 25 years of family-owned real estate excellence.', icon: Shield }, { title: 'Verified Listings', desc: 'Every property is legally verified and inspected.', icon: CheckCircle }, { title: 'Local Expertise', desc: 'Deep knowledge of neighborhoods and market trends.', icon: MapPin }, { title: 'End-to-End Support', desc: 'From site visits to documentation, we handle it all.', icon: Phone }].map((item) => (
              <div key={item.title} className="rounded-lg border bg-white p-6 text-center">
                <item.icon className="mx-auto h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Find Your Property?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">Browse our listings or reach out for personalized assistance. Our team is here to help.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/properties"><Button size="lg" variant="secondary" className="gap-2">View Properties <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/enquiry"><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Enquire Now</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
