'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTACT_PHONE } from '@/lib/constants'

export default function CTASection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-lg p-8 md:p-16 space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Content */}
          <motion.div className="text-center space-y-6" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of satisfied customers. Our expert team is ready to guide you through every step.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="/properties" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-full gap-2 bg-white text-emerald-600 hover:bg-slate-100 text-base h-12 px-8 font-semibold"
                >
                  Browse Properties <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/enquiry" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-white text-white hover:bg-white/10 text-base h-12 px-8 font-semibold"
                >
                  <MessageSquare className="h-5 w-5" /> Send Enquiry
                </Button>
              </motion.div>
            </Link>
            <a href={`tel:${CONTACT_PHONE}`} className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-white text-white hover:bg-white/10 text-base h-12 px-8 font-semibold"
                >
                  <Phone className="h-5 w-5" /> Call Us
                </Button>
              </motion.div>
            </a>
          </motion.div>

          {/* Support info */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/20"
            variants={itemVariants}
          >
            {[
              { label: 'Available Now', value: '24/7 Support' },
              { label: 'Free Consultation', value: 'Expert Guidance' },
              { label: 'Best Prices', value: 'Guaranteed' },
            ].map((info, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <p className="text-white/70 text-sm">{info.label}</p>
                <p className="text-white font-semibold text-lg">{info.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
