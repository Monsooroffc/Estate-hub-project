'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, MapPin, Phone } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export default function WhyChooseUsClient() {
  const features = [
    { title: 'RERA Approved', desc: 'Registered under RERA — every transaction is transparent and regulated.', icon: Shield },
    { title: 'DTCP & CMDA Approved', desc: 'Clear-title plots, flats & villas with fully approved layouts.', icon: CheckCircle },
    { title: 'Chennai Expertise', desc: 'Deep local knowledge of Porur and West Chennai neighborhoods.', icon: MapPin },
    { title: 'End-to-End Support', desc: 'From site visits to final registration, we handle everything.', icon: Phone },
  ]

  return (
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
          {features.map((item, idx) => (
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
  )
}
