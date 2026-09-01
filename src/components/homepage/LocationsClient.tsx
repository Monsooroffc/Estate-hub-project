'use client'

import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

interface LocationsClientProps {
  locations: string[]
}

export default function LocationsClient({ locations }: LocationsClientProps) {
  return (
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
  )
}
