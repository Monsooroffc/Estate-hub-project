'use client'

import { motion } from 'framer-motion'
import { Building2, Users, Trophy, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Stat {
  icon: React.ReactNode
  value: string
  label: string
  description: string
}

interface StatsSectionProps {
  stats?: Stat[]
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats: Stat[] = [
    {
      icon: <Building2 className="h-8 w-8" />,
      value: '500+',
      label: 'Properties',
      description: 'Premium listings across Chennai',
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: '5K+',
      label: 'Happy Customers',
      description: 'Satisfied clients & investors',
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      value: '₹500Cr+',
      label: 'Deals Closed',
      description: 'Successful transactions',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      value: '25+',
      label: 'Locations',
      description: 'Across Greater Chennai',
    },
  ]

  const displayStats = stats || defaultStats
  const [counters, setCounters] = useState<number[]>(displayStats.map(() => 0))

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounters(displayStats.map(() => 1))
    }, 100)

    return () => clearTimeout(timer)
  }, [displayStats])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="bg-gradient-to-r from-slate-900 via-emerald-900/20 to-slate-900 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {displayStats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="relative group"
              variants={itemVariants}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl" />

              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 space-y-4 hover:border-emerald-500/30 transition-colors duration-300">
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {stat.icon}
                </motion.div>

                {/* Value */}
                <div>
                  <motion.h3
                    className="text-3xl md:text-4xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.h3>
                </div>

                {/* Label */}
                <div>
                  <p className="text-lg font-semibold text-slate-100">{stat.label}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.description}</p>
                </div>

                {/* Accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
