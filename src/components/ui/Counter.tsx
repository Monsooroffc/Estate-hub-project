'use client'

import { motion } from 'framer-motion'

interface CounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export default function Counter({ from, to, duration = 2, suffix = '', prefix = '' }: CounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        // Counter animation logic
      }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {prefix}
        {to}
        {suffix}
      </motion.span>
    </motion.div>
  )
}
