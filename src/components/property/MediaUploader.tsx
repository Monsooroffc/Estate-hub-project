'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { UploadCloud, X, Loader2, PlayCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/format'
import { isSupabaseConfigured, uploadPropertyMedia, type MediaKind } from '@/lib/supabase/storage'

interface MediaUploaderProps {
  accept: 'image/*' | 'video/*'
  label: string
  hint?: string
  value: string[] // existing URLs (uploaded or pasted)
  onChange: (urls: string[]) => void
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url)
}

// Legacy fallback used ONLY when Supabase isn't configured (local demo mode).
async function uploadViaApiRoute(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  let data: { url?: string; error?: string } = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok || !data.url) {
    throw new Error(
      data.error ||
      (res.status === 404
        ? 'Upload endpoint not found. Restart the dev server (npm run dev) and try again.'
        : `Upload failed (HTTP ${res.status}). Please try again.`)
    )
  }
  return data.url
}

/**
 * Uploads files DIRECTLY from the browser to Supabase Storage (photos to the
 * `property-images` bucket, videos to `property-videos`) and reports the
 * resulting public URLs back via onChange. Large files never pass through the
 * Next.js server, so big videos no longer fail with HTTP 413.
 * Works for both site photos (images) and site walkthrough / land videos.
 */
export default function MediaUploader({ accept, label, hint, value, onChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const isVideo = accept === 'video/*'
  const kind: MediaKind = isVideo ? 'video' : 'image'

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      try {
        if (isSupabaseConfigured) {
          // Direct browser -> Supabase Storage upload.
          urls.push(await uploadPropertyMedia(file, kind))
        } else {
          // Demo mode: no Supabase env vars — use the local /api/upload route.
          urls.push(await uploadViaApiRoute(file))
        }
      } catch (err) {
        const name = file.name ? ` (${file.name})` : ''
        setError(`${err instanceof Error ? err.message : 'Upload failed. Please try again.'}${name}`)
        break
      }
    }
    setUploading(false)
    if (urls.length > 0) onChange([...value, ...urls])
    if (inputRef.current) inputRef.current.value = ''
  }

  const remove = (url: string) => onChange(value.filter((u) => u !== url))

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="group relative h-20 w-28 shrink-0 overflow-hidden rounded-md border bg-slate-100">
            {isVideo || isVideoUrl(url) ? (
              <div className="relative h-full w-full bg-slate-900">
                <video src={url} className="h-full w-full object-contain" muted playsInline preload="metadata" />
                <PlayCircle className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white/80" />
              </div>
            ) : (
              <Image src={url} alt={label} fill className="object-cover" unoptimized />
            )}
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex h-20 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-xs font-medium text-muted-foreground transition-colors',
            uploading ? 'cursor-wait opacity-60' : 'hover:border-primary hover:text-primary cursor-pointer'
          )}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          {uploading ? 'Uploading...' : `Add ${isVideo ? 'Video' : 'Image'}`}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}