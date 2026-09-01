'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Copyright,
} from 'lucide-react'
import { APP_NAME, CONTACT_PHONE, CONTACT_EMAIL, CONTACT_ADDRESS } from '@/lib/constants'

const footerSections = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Enquire', href: '/enquiry' },
      { label: 'Admin', href: '/admin/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Why Choose Us', href: '#why' },
      { label: 'Press', href: '#press' },
      { label: 'Careers', href: '#careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '#contact' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms & Conditions', href: '#terms' },
    ],
  },
]

export default function Footer() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 text-sm font-black tracking-tight text-slate-900">
                {APP_NAME.slice(0, 2)}
              </span>
              <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium real estate solutions for families and investors in Chennai.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {footerSections.map((section, idx) => (
            <motion.div key={idx} className="space-y-4" variants={itemVariants}>
              <h3 className="text-sm font-bold uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li key={link.href} whileHover={{ x: 4 }}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-sm font-bold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 group"
                >
                  <Phone className="h-4 w-4" />
                  <span>{CONTACT_PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 group"
                >
                  <Mail className="h-4 w-4" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li>
                <div className="inline-flex items-start gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{CONTACT_ADDRESS}</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="mb-16 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Subscribe to our newsletter</h3>
              <p className="text-sm text-slate-400">Get latest property updates and exclusive offers.</p>
            </div>
            <div className="sm:max-w-xs">
            <motion.form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </motion.form>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-1">
            <Copyright className="h-4 w-4" />
            <span>&copy; 2026 {APP_NAME}. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
