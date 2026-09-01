import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, CheckCircle, Clock3, MapPin, Maximize, Phone, Shield, TrendingUp, Users, Home as HomeIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { getFeaturedProperties, getLocations, getProperties } from '@/lib/data/properties'
import { APP_NAME, APP_TAGLINE, CONTACT_PHONE } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import PropertyCardPremium from '@/components/property/PropertyCardPremium'
import CompanyShowcase from '@/components/homepage/CompanyShowcase'
import AboutCompanySection from '@/components/homepage/AboutCompanySection'
import HeroSection from '@/components/homepage/HeroSection'
import StatsSection from '@/components/homepage/StatsSection'
import TestimonialSection from '@/components/homepage/TestimonialSection'
import CTASection from '@/components/homepage/CTASection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const featured = await getFeaturedProperties(6)
  const allProperties = await getProperties()
  const locations = await getLocations()

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* About Company */}
      <AboutCompanySection />

      {/* Company Showcase */}
      <CompanyShowcase />

      {/* Featured Properties */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span
              className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              🏠 Premium Listings
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Featured <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Properties</span>
            </motion.h2>
            <motion.p
              className="text-lg text-slate-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore our handpicked selection of premium properties across Chennai
            </motion.p>
          </div>
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {featured.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <PropertyCardPremium property={property} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/properties">
              <Button size="lg" className="gap-2">
                View All {allProperties.length} Properties <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Browse by <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Type</span>
            </h2>
            <p className="text-lg text-slate-600">Find exactly what you're looking for</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {[
              { label: 'Land', icon: MapPin, href: '/properties?type=land', accent: 'from-green-500 to-emerald-500' },
              { label: 'Plot', icon: Maximize, href: '/properties?type=plot', accent: 'from-amber-500 to-orange-500' },
              { label: 'Villa', icon: HomeIcon, href: '/properties?type=villa', accent: 'from-violet-500 to-purple-500' },
              { label: 'Apartment', icon: Building2, href: '/properties?type=apartment', accent: 'from-sky-500 to-blue-500' },
              { label: 'Residential', icon: Users, href: '/properties?type=residential', accent: 'from-rose-500 to-red-500' },
              { label: 'Commercial', icon: TrendingUp, href: '/properties?type=commercial', accent: 'from-indigo-500 to-purple-500' },
            ].map((cat, idx) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <Link href={cat.href}>
                  <motion.div
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-lg transition-all"
                    whileHover={{ y: -8, borderColor: '#059669' }}
                  >
                    <motion.span
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${cat.accent} text-white`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <cat.icon className="h-6 w-6" />
                    </motion.span>
                    <span className="text-sm font-semibold text-slate-900">{cat.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Popular <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Locations</span>
            </h2>
            <p className="text-lg text-slate-600">Invest in Chennai's most desirable neighborhoods</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {locations.filter((l) => l !== 'All Locations').map((location, idx) => (
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <Link href={`/properties?location=${encodeURIComponent(location)}`}>
                  <motion.div
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-5 py-4 shadow-sm hover:shadow-md transition-all"
                    whileHover={{ y: -4, borderColor: '#059669' }}
                  >
                    <span className="flex items-center gap-3">
                      <motion.span
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <MapPin className="h-4 w-4" />
                      </motion.span>
                      <span className="text-sm font-semibold text-slate-900">{location}</span>
                    </span>
                    <motion.div whileHover={{ x: 4 }}>
                      <ArrowRight className="h-4 w-4 text-emerald-600 transition-transform" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{APP_NAME}</span>
            </h2>
            <p className="text-lg text-slate-600">What makes us different in the real estate market</p>
          </motion.div>
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {[
              { title: 'RERA Approved', desc: 'Registered under RERA — every transaction is transparent and regulated.', icon: Shield },
              { title: 'DTCP & CMDA Approved', desc: 'Clear-title plots, flats & villas with fully approved layouts.', icon: CheckCircle },
              { title: 'Chennai Expertise', desc: 'Deep local knowledge of Porur and West Chennai neighborhoods.', icon: MapPin },
              { title: 'End-to-End Support', desc: 'From site visits to final registration, we handle everything.', icon: Phone },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <motion.span
                  className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <item.icon className="h-6 w-6" />
                </motion.span>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
