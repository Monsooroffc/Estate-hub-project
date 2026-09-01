'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loadHomepageSettings, loadHomepageSettingsRemote, HomepageSettings, getDefaultHomepageSettings } from '@/lib/site-settings'
import { useEffect, useState } from 'react'

const fallback: HomepageSettings = getDefaultHomepageSettings()

function getVideoContentType(url: string): string | undefined {
  const value = url.toLowerCase()
  if (value.endsWith('.webm')) return 'video/webm'
  if (value.endsWith('.ogg') || value.endsWith('.ogv')) return 'video/ogg'
  if (value.endsWith('.mov') || value.endsWith('.quicktime')) return 'video/quicktime'
  if (value.endsWith('.m4v')) return 'video/x-m4v'
  return 'video/mp4'
}

export default function CompanyShowcase() {
  const [settings, setSettings] = useState<HomepageSettings>(fallback)

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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">Company Showcase</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Building trust, projects, and long-term value</h2>
        </div>
        <Link href="/properties">
          <Button variant="outline" className="gap-2">Explore Projects <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-800 via-violet-700 to-violet-900 p-2 shadow-xl">
          <div className="relative overflow-hidden rounded-[24px] bg-white/95 p-6 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.08),_transparent_35%)]" />
            <div className="relative grid gap-6 md:grid-cols-[1.1fr_1.4fr_0.8fr] md:items-center">
              <div className="space-y-2 text-violet-900">
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">{settings.companyShortName.split(' ')[0] || 'Real'}</div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">{settings.companyShortName.split(' ')[1] || 'Rise'}</div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">{settings.companyShortName.split(' ')[2] || 'Resource'}</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-violet-500 bg-white text-3xl font-black text-violet-800 shadow-md">
                  {settings.companyName.slice(0, 3).toUpperCase()}
                </div>
                <div className="text-4xl font-black tracking-tight text-violet-900">{settings.logoText}</div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600">{settings.badge}</div>
                <div className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">{settings.tagline}</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-violet-500 bg-orange-50 text-[10px] font-black uppercase text-violet-800 shadow-md">RERA</div>
                <div className="text-center text-xs font-bold uppercase leading-relaxed text-violet-800">
                  DTCP, CMDA Approved
                  <br />
                  Plots, Flats &amp; Villas
                </div>
              </div>
            </div>

            <div className="relative mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="text-3xl font-black text-orange-600">{settings.directorName}</div>
                <div className="mt-1 text-xl font-semibold text-slate-700">{settings.directorRole}</div>
                <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
                  <span className="text-lg text-orange-600">☎</span>
                  <span className="font-semibold">{settings.phone}</span>
                </div>
                <div className="mt-2 text-sm text-slate-700">{settings.email}</div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 p-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white text-[10px] font-black uppercase text-violet-700 shadow-sm">
                  <Image src={settings.brandImage} alt="Brand logo" width={80} height={80} className="h-full w-full object-cover" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700">{settings.companyName}</div>
              </div>
            </div>

            <div className="relative mt-4 border-t border-violet-200 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>{settings.address}</span>
                <span className="font-semibold text-violet-700">{settings.companyName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3 font-semibold text-slate-800">Client highlight & project plan</div>
            <div className="p-4">
              <video
                key={settings.showcaseVideoUrl}
                controls
                preload="metadata"
                poster={settings.showcasePosterUrl}
                className="h-56 w-full rounded-xl object-cover"
              >
                <source src={settings.showcaseVideoUrl} type={getVideoContentType(settings.showcaseVideoUrl)} />
              </video>
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">What we showcase</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                'Client success stories',
                'Project milestones',
                'Interior + exterior showcases',
                'First plan previews and layouts',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
