import { getFeaturedProperties, getLocations, getProperties } from '@/lib/data/properties'
import HeroSection from '@/components/homepage/HeroSection'
import StatsSection from '@/components/homepage/StatsSection'
import AboutCompanySection from '@/components/homepage/AboutCompanySection'
import CompanyShowcase from '@/components/homepage/CompanyShowcase'
import TestimonialSection from '@/components/homepage/TestimonialSection'
import CTASection from '@/components/homepage/CTASection'
import FeaturedPropertiesClient from '@/components/homepage/FeaturedPropertiesClient'
import PropertyCategoriesClient from '@/components/homepage/PropertyCategoriesClient'
import LocationsClient from '@/components/homepage/LocationsClient'
import WhyChooseUsClient from '@/components/homepage/WhyChooseUsClient'

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
      <FeaturedPropertiesClient featured={featured} allProperties={allProperties} />

      {/* Property Categories */}
      <PropertyCategoriesClient />

      {/* Locations */}
      <LocationsClient locations={locations} />

      {/* Why Choose Us */}
      <WhyChooseUsClient />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
