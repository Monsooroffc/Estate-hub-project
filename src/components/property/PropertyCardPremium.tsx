'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Maximize, IndianRupee, PlayCircle, ArrowRight, Heart, Share2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Property } from '@/types'
import { formatPrice, formatArea } from '@/lib/utils/format'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface PropertyCardPremiumProps {
  property: Property
}

export default function PropertyCardPremium({ property }: PropertyCardPremiumProps) {
  const imageUrl = property.images?.[0]?.image_url || ''
  const firstVideoUrl = property.videos?.[0]?.video_url || ''
  const statusVariant = property.status === 'available' ? 'success' : property.status === 'sold' ? 'destructive' : 'warning'
  const [isFavorite, setIsFavorite] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/properties/${property.id}`}>
        <div className="group relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : firstVideoUrl ? (
              <>
                <video
                  src={firstVideoUrl}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full bg-slate-900 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No Image
              </div>
            )}

            {/* Video indicator */}
            {!imageUrl && firstVideoUrl && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <motion.button
                  className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-900 hover:bg-white transition-all"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowVideo(!showVideo)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayCircle className="h-4 w-4 text-emerald-600" /> Watch Video
                </motion.button>
              </motion.div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-2">
              <Badge variant={statusVariant} className="capitalize shadow-md">
                {property.status}
              </Badge>
              <Badge variant="secondary" className="capitalize shadow-md">
                {property.property_type}
              </Badge>
            </div>

            {/* Action buttons on hover */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-slate-900 hover:bg-white text-xs font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  setIsFavorite(!isFavorite)
                }}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                Save
              </motion.button>
              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-slate-900 hover:bg-white text-xs font-semibold transition-all ml-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.preventDefault()}
              >
                <Share2 className="h-4 w-4" />
                Share
              </motion.button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <motion.h3
                className="text-lg font-semibold line-clamp-1 text-slate-900 group-hover:text-emerald-600 transition-colors"
                whileHover={{ x: 4 }}
              >
                {property.title}
              </motion.h3>
            </div>

            {/* Location */}
            <motion.div
              className="flex items-center gap-1.5 text-sm text-slate-600"
              whileHover={{ x: 4 }}
            >
              <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="line-clamp-1">{property.location}, Chennai</span>
            </motion.div>

            {/* Price and area */}
            <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-200">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</p>
                <p className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {formatPrice(property.price)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Size</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                  <Maximize className="h-4 w-4" />
                  {formatArea(property.area)}
                </p>
              </div>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {property.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {feature}
                    </span>
                  ))}
                  {property.features.length > 2 && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      +{property.features.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <motion.button
              className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
