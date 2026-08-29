'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Building2, CheckCircle, XCircle, Clock3, MessageSquare, Users, Flame,
  CalendarClock, Plus, ArrowRight, Wallet,
} from 'lucide-react'
import { Enquiry, Lead, Property } from '@/types'
import { getProperties } from '@/lib/data/properties'
import { getEnquiries } from '@/lib/data/enquiries'
import { getLeads, getFollowUpsDueCount, getHotLeadsCount } from '@/lib/data/leads'
import { formatPrice, formatDate, timeAgo, cn } from '@/lib/utils/format'
import DashboardCard from '@/components/admin/DashboardCard'
import StatusBadge from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const initials = (name: string) =>
  name.split(' ').map((part) => part[0] || '').join('').slice(0, 2).toUpperCase()

const AVATAR_STYLES = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]
const avatarClass = (name: string) => AVATAR_STYLES[name.length % AVATAR_STYLES.length]

interface DashboardData {
  properties: Property[]
  enquiries: Enquiry[]
  leads: Lead[]
  hotLeads: number
  followUpsDue: number
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [properties, enquiries, leads, hotLeads, followUpsDue] = await Promise.all([
        getProperties(), getEnquiries(), getLeads(), getHotLeadsCount(), getFollowUpsDueCount(),
      ])
      setData({ properties, enquiries, leads, hotLeads, followUpsDue })
      setLoading(false)
    }
    load()
  }, [])

  if (loading || !data) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  const { properties, enquiries, leads, hotLeads, followUpsDue } = data
  const available = properties.filter((p) => p.status === 'available').length
  const reserved = properties.filter((p) => p.status === 'reserved').length
  const sold = properties.filter((p) => p.status === 'sold').length
  const newEnquiries = enquiries.filter((e) => e.status === 'NEW').length
  const portfolioValue = properties
    .filter((p) => p.status === 'available')
    .reduce((sum, p) => sum + p.price, 0)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const propertyTitle = (id: string | null) =>
    properties.find((p) => p.id === id)?.title ?? 'General enquiry'

  const recentEnquiries = enquiries.slice(0, 5)
  const recentLeads = leads.slice(0, 5)

  const distTotal = properties.length || 1
  const dist = [
    { label: 'Available', count: available, bar: 'bg-green-500', dot: 'bg-green-500' },
    { label: 'Reserved', count: reserved, bar: 'bg-amber-400', dot: 'bg-amber-400' },
    { label: 'Sold', count: sold, bar: 'bg-rose-500', dot: 'bg-rose-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-white/80">{today}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{greeting}, Welcome back</h1>
            <p className="mt-1.5 text-sm text-white/80">Here&apos;s what&apos;s happening at RRR Housing today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/properties">
              <Button className="gap-2 bg-white text-violet-700 hover:bg-white/90"><Plus className="h-4 w-4" /> Add Property</Button>
            </Link>
            <Link href="/admin/enquiries">
              <Button variant="outline" className="gap-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">Enquiries <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Properties" value={properties.length} description="All listings" icon={Building2} accent="violet" href="/admin/properties" />
        <DashboardCard title="Available" value={available} description="Ready to sell" icon={CheckCircle} accent="green" href="/admin/properties" />
        <DashboardCard title="Reserved" value={reserved} description="On hold" icon={Clock3} accent="amber" href="/admin/properties" />
        <DashboardCard title="Sold" value={sold} description="Closed deals" icon={XCircle} accent="rose" href="/admin/properties" />
        <DashboardCard title="New Enquiries" value={newEnquiries} description="Awaiting response" icon={MessageSquare} accent="blue" href="/admin/enquiries" />
        <DashboardCard title="Total Leads" value={leads.length} description="In CRM pipeline" icon={Users} accent="indigo" href="/admin/leads" />
        <DashboardCard title="Hot Leads" value={hotLeads} description="High priority" icon={Flame} accent="orange" href="/admin/leads" />
        <DashboardCard title="Follow-ups Due" value={followUpsDue} description="Action needed" icon={CalendarClock} accent="sky" href="/admin/leads" />
      </div>
      {/* Inventory snapshot + recent enquiries */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Inventory Snapshot</CardTitle>
            <CardDescription>Portfolio status at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Portfolio value (available)</p>
                <p className="mt-0.5 text-xl font-bold tracking-tight text-primary">{formatPrice(portfolioValue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                {dist.map((d) => (
                  <div key={d.label} className={d.bar} style={{ width: `${(d.count / distTotal) * 100}%` }} />
                ))}
              </div>
              <div className="mt-4 space-y-2.5">
                {dist.map((d) => (
                  <div key={d.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className={cn('h-2 w-2 rounded-full', d.dot)} /> {d.label}
                    </span>
                    <span className="font-semibold">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base">Recent Enquiries</CardTitle>
              <CardDescription>Latest customers reaching out</CardDescription>
            </div>
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {recentEnquiries.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No enquiries yet.</p>
            ) : (
              <ul className="divide-y">
                {recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', avatarClass(enquiry.name))}>
                      {initials(enquiry.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{enquiry.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{propertyTitle(enquiry.property_id)}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold">{formatPrice(enquiry.budget ?? 0)}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(enquiry.created_at)}</p>
                    </div>
                    <StatusBadge status={enquiry.status} type="enquiry" />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leads pipeline */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">Leads Pipeline</CardTitle>
            <CardDescription>Recent leads and their next follow-ups</CardDescription>
          </div>
          <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          {recentLeads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No leads yet. Convert an enquiry to get started.</p>
          ) : (
            <ul className="divide-y">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold', avatarClass(lead.name))}>
                    {initials(lead.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{propertyTitle(lead.property_id)}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold">{formatPrice(lead.budget ?? 0)}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.next_followup ? `Follow-up ${formatDate(lead.next_followup)}` : 'No follow-up set'}
                    </p>
                  </div>
                  <StatusBadge status={lead.priority} type="lead" />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
