'use client'

import Link from 'next/link'
import { ArrowRight, Building2, MapPin, Maximize, TrendingUp, Users, Home as HomeIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PropertyCategoriesClient() {
  const categories = [
    { label: 'Land', icon: MapPin, href: '/properties?type=land', accent: 'from-green-500 to-emerald-500' },
    { label: 'Plot', icon: Maximize, href: '/properties?type=plot', accent: 'from-amber-500 to-orange-500' },
    { label: 'Villa', icon: HomeIcon, href: '/properties?type=villa', accent: 'from-violet-500 to-purple-500' },
    { label: 'Apartment', icon: Building2, href: '/properties?type=apartment', accent: 'from-sky-500 to-blue-500' },
    { label: 'Residential', icon: Users, href: '/properties?type=residential', accent: 'from-rose-500 to-red-500' },
    { label: 'Commercial', icon: TrendingUp, href: '/properties?type=commercial', accent: 'from-indigo-500 to-purple-500' },
  ]

  return (
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
          {categories.map((cat, idx) => (
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
  )
}
