'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { APP_NAME, APP_TAGLINE, CONTACT_PHONE } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8 } 
    },
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 md:py-48">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
          alt="Hero background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
        
        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 -left-20 w-96 h-96 bg-gradient-to-tr from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur"
            variants={itemVariants}
          >
            <motion.span
              className="inline-block h-2 w-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Premium Real Estate Platform
          </motion.span>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              <span className="block">Own Your Dream</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
                Property Today
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            className="max-w-xl text-lg md:text-xl text-slate-300 leading-relaxed"
            variants={itemVariants}
          >
            {APP_NAME} — {APP_TAGLINE}. Discover RERA & CMDA approved premium properties, flats, villas & plots across Chennai's most desirable locations with complete transparency.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
            <Link href="/properties" className="w-fit">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="gap-2 shadow-xl shadow-emerald-500/30 text-base h-12 px-8">
                  Explore Properties <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/enquiry" className="w-fit">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white text-base h-12 px-8"
                >
                  <Play className="h-4 w-4" /> Book Site Visit
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4 border-t border-white/10"
            variants={itemVariants}
          >
            {[
              { icon: '✓', text: 'RERA Approved' },
              { icon: '✓', text: 'CMDA Verified' },
              { icon: '✓', text: 'Clear Title' },
              { icon: '✓', text: '24/7 Support' },
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-2 text-sm text-slate-300"
                whileHover={{ x: 5 }}
              >
                <span className="text-green-400 text-lg">{badge.icon}</span>
                <span>{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
