'use client'

import Image from 'next/image'
import { CheckCircle, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HomepageSettings, getDefaultHomepageSettings, loadHomepageSettingsRemote } from '@/lib/site-settings'

export default function AboutCompanySection() {
  const [settings, setSettings] = useState<HomepageSettings>(getDefaultHomepageSettings())

  useEffect(() => {
    const update = async () => {
      const nextSettings = await loadHomepageSettingsRemote()
      setSettings(nextSettings)
    }

    void update()

    const handler = () => {
      void update()
    }
    window.addEventListener('rrr-home-settings-updated', handler)
    return () => window.removeEventListener('rrr-home-settings-updated', handler)
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700">About Us</span>
          <h2 className="text-3xl font-bold tracking-tight">{settings.aboutTitle}</h2>
          <p className="text-muted-foreground leading-relaxed">{settings.aboutDescription}</p>
          <ul className="space-y-2">
            {['RERA approved — transparent, regulated transactions', 'DTCP & CMDA approved plots, flats & villas', 'ISO 27001:2013 certified processes', 'End-to-end assistance from enquiry to registration'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm"><CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />{item}</li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
          <Image src={settings.aboutImage} alt="About us" fill className="object-cover" />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur">
            <Shield className="h-4 w-4 text-green-600" /> RERA · DTCP · CMDA Approved
          </span>
        </div>
      </div>
    </section>
  )
}
