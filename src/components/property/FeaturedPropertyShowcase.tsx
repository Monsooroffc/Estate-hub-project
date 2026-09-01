'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Maximize, IndianRupee, ArrowRight, Badge } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatArea } from '@/lib/utils/format'

interface FeaturedPropertyShowcaseProps {
  property: Property
  layout?: 'vertical' | 'horizontal'
}

export default function FeaturedPropertyShowcase({ property, layout = 'vertical' }: FeaturedPropertyShowcaseProps) {
  const imageUrl = property.images?.[0]?.image_url || ''
  const statusVariant = property.status === 'available' ? 'success' : property.status === 'sold' ? 'destructive' : 'warning'

  if (layout === 'horizontal') {
    return (
      <Link href={`/properties/${property.id}`}>
        <motion.div
          className="group rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 grid md:grid-cols-2 gap-0"
          whileHover={{ y: -8 }}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 md:aspect-auto">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>

          {/* Content */}
          <div className="p-8 space-y-4 flex flex-col justify-center">
            <div className="space-y-2">
              <motion.h3
                className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                whileHover={{ x: 4 }}
              >
                {property.title}
              </motion.h3>
              <motion.div className="flex items-center gap-2 text-slate-600" whileHover={{ x: 4 }}>
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span>{property.location}, Chennai</span>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</p>
                <p className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {formatPrice(property.price)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Size</p>
                <p className="text-xl font-bold text-slate-900 flex items-center gap-1">
                  <Maximize className="h-5 w-5" />
                  {formatArea(property.area)}
                </p>
              </div>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {property.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="px-3 py-1 rounded-full bg-emerald-50 text-sm font-medium text-emerald-700">
                    {feature}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <motion.div
              className="pt-4 flex items-center gap-2 text-emerald-600 font-semibold"
              whileHover={{ x: 4 }}
            >
              Explore More
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <motion.div
        className="group rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
        whileHover={{ y: -8 }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <motion.h3
              className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors"
              whileHover={{ x: 4 }}
            >
              {property.title}
            </motion.h3>
            <motion.div className="flex items-center gap-2 text-slate-600" whileHover={{ x: 4 }}>
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="text-sm line-clamp-1">{property.location}, Chennai</span>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</p>
              <p className="font-bold text-emerald-600 text-sm flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                {formatPrice(property.price)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Size</p>
              <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                {formatArea(property.area)}
              </p>
            </div>
          </div>

          {/* Features */}
          {property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.features.slice(0, 2).map((feature) => (
                <span key={feature} className="px-2 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
