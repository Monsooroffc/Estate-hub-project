'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { defaultHomepageSettings, HomepageSettings, loadHomepageSettings, loadHomepageSettingsRemote, saveHomepageSettings, saveHomepageSettingsRemote } from '@/lib/site-settings'
import { uploadPropertyMedia } from '@/lib/supabase/storage'

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<HomepageSettings>(defaultHomepageSettings)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({ brandImage: false, aboutImage: false, showcaseVideo: false })

  useEffect(() => {
    const loadSettings = async () => {
      const loaded = await loadHomepageSettingsRemote()
      setSettings(loaded)
    }
    loadSettings()
  }, [])

  const updateField = (field: keyof HomepageSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const persistHomepageSettings = async (nextSettings: HomepageSettings) => {
    setSettings(nextSettings)
    saveHomepageSettings(nextSettings)
    await saveHomepageSettingsRemote(nextSettings)
  }

  const handleFileChange = async (field: 'brandImage' | 'aboutImage', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading((prev) => ({ ...prev, [field]: true }))
    try {
      const uploadedUrl = await uploadPropertyMedia(file, 'image')
      const nextSettings = { ...settings, [field]: uploadedUrl }
      await persistHomepageSettings(nextSettings)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }))
      event.target.value = ''
    }
  }

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading((prev) => ({ ...prev, showcaseVideo: true }))
    try {
      const uploadedUrl = await uploadPropertyMedia(file, 'video')
      const nextSettings = { ...settings, showcaseVideoUrl: uploadedUrl }
      await persistHomepageSettings(nextSettings)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Video upload failed.')
    } finally {
      setUploading((prev) => ({ ...prev, showcaseVideo: false }))
      event.target.value = ''
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    await saveHomepageSettingsRemote(settings)
    window.setTimeout(() => setSaving(false), 600)
  }

  const resetDefaults = async () => {
    const reset = defaultHomepageSettings
    setSettings(reset)
    await saveHomepageSettingsRemote(reset)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage Control Center</h1>
          <p className="text-sm text-muted-foreground">Update company branding, about content, and showcase media from here.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetDefaults}>Reset</Button>
          <Button onClick={saveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See the branded homepage layout as you edit it.</CardDescription>
          </CardHeader>
          <CardContent className="rounded-2xl border bg-slate-900 p-4 text-white">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5">
              <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">
                {settings.heroBadge}
              </div>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                {settings.heroTitleLineOne}
                <span className="block bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">{settings.heroTitleLineTwo}</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">{settings.heroSubtitle}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">{settings.heroPrimaryCta}</span>
                <span className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white">{settings.heroSecondaryCta}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Basic company details shown on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={settings.companyName} onChange={(e) => updateField('companyName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Short Name</Label>
              <Input value={settings.companyShortName} onChange={(e) => updateField('companyShortName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={settings.tagline} onChange={(e) => updateField('tagline', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Badge / Highlight</Label>
              <Input value={settings.badge} onChange={(e) => updateField('badge', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo Text</Label>
              <Input value={settings.logoText} onChange={(e) => updateField('logoText', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hero Badge</Label>
              <Input value={settings.heroBadge} onChange={(e) => updateField('heroBadge', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Hero Line 1</Label>
                <Input value={settings.heroTitleLineOne} onChange={(e) => updateField('heroTitleLineOne', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Hero Line 2</Label>
                <Input value={settings.heroTitleLineTwo} onChange={(e) => updateField('heroTitleLineTwo', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Hero Subtitle</Label>
              <Textarea rows={3} value={settings.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Primary CTA</Label>
                <Input value={settings.heroPrimaryCta} onChange={(e) => updateField('heroPrimaryCta', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Secondary CTA</Label>
                <Input value={settings.heroSecondaryCta} onChange={(e) => updateField('heroSecondaryCta', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>Edit the company summary and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>About Title</Label>
              <Input value={settings.aboutTitle} onChange={(e) => updateField('aboutTitle', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>About Description</Label>
              <Textarea rows={5} value={settings.aboutDescription} onChange={(e) => updateField('aboutDescription', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Director Name</Label>
                <Input value={settings.directorName} onChange={(e) => updateField('directorName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Director Role</Label>
                <Input value={settings.directorRole} onChange={(e) => updateField('directorRole', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={settings.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={settings.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={settings.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Media</CardTitle>
            <CardDescription>Upload or replace image files for the homepage showcase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Brand Image URL</Label>
              <Input value={settings.brandImage} onChange={(e) => updateField('brandImage', e.target.value)} />
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange('brandImage', e)} />
              {uploading.brandImage && <p className="text-xs text-amber-600">Uploading brand image...</p>}
            </div>
            <div className="space-y-2">
              <Label>About Page Image URL</Label>
              <Input value={settings.aboutImage} onChange={(e) => updateField('aboutImage', e.target.value)} />
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange('aboutImage', e)} />
              {uploading.aboutImage && <p className="text-xs text-amber-600">Uploading about image...</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Showcase Video</CardTitle>
            <CardDescription>Replace the promo clip or poster displayed in the homepage section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input value={settings.showcaseVideoUrl} onChange={(e) => updateField('showcaseVideoUrl', e.target.value)} />
              <Input type="file" accept="video/*" onChange={handleVideoUpload} />
              {uploading.showcaseVideo && <p className="text-xs text-amber-600">Uploading showcase video...</p>}
            </div>
            <div className="space-y-2">
              <Label>Poster Image URL</Label>
              <Input value={settings.showcasePosterUrl} onChange={(e) => updateField('showcasePosterUrl', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
