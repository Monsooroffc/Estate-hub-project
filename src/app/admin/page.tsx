'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, CheckCircle, XCircle, MessageSquare, Users, Flame, CalendarClock } from 'lucide-react'
import { DashboardStats } from '@/types'
import { getProperties } from '@/lib/data/properties'
import { getEnquiries } from '@/lib/data/enquiries'
import { getLeads, getFollowUpsDueCount, getHotLeadsCount } from '@/lib/data/leads'
import DashboardCard from '@/components/admin/DashboardCard'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const [properties, enquiries, leads, hotLeads, followUpsDue] = await Promise.all([
        getProperties(), getEnquiries(), getLeads(), getHotLeadsCount(), getFollowUpsDueCount(),
      ])
      setStats({
        totalProperties: properties.length,
        availableProperties: properties.filter((p) => p.status === 'available').length,
        soldProperties: properties.filter((p) => p.status === 'sold').length,
        newEnquiries: enquiries.filter((e) => e.status === 'NEW').length,
        totalLeads: leads.length,
        hotLeads,
        followUpsDue,
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading || !stats) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your real estate business</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/properties"><Button variant="outline">Manage Properties</Button></Link>
          <Link href="/admin/leads"><Button>View Leads</Button></Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Properties" value={stats.totalProperties} icon={Building2} description="All listings" />
        <DashboardCard title="Available" value={stats.availableProperties} icon={CheckCircle} description="Active listings" />
        <DashboardCard title="Sold" value={stats.soldProperties} icon={XCircle} description="Closed deals" />
        <DashboardCard title="New Enquiries" value={stats.newEnquiries} icon={MessageSquare} description="Awaiting response" />
        <DashboardCard title="Total Leads" value={stats.totalLeads} icon={Users} description="CRM pipeline" />
        <DashboardCard title="Hot Leads" value={stats.hotLeads} icon={Flame} description="High priority" />
        <DashboardCard title="Follow-ups Due" value={stats.followUpsDue} icon={CalendarClock} description="Action required" />
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="font-semibold">Future AI Features</h2>
        <p className="mt-1 text-sm text-muted-foreground">This dashboard is structured for future AI modules: Lead Scoring, Property Recommendations, Enquiry Summarization, and Follow-up Suggestions. Extension hooks are ready in <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">src/lib/ai/</code>.</p>
      </div>
    </div>
  )
}
