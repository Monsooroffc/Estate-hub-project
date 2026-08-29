'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react'
import { PropertyImage, PropertyVideo } from '@/types'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
  videos?: PropertyVideo[]
}

interface GalleryItem {
  key: string
  kind: 'image' | 'video'
  url: string
}

export default function PropertyGallery({ images, title, videos }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0)

  const items: GalleryItem[] = [
    ...images.map((img) => ({ key: img.id, kind: 'image' as const, url: img.image_url })),
    ...(videos || []).map((v) => ({ key: v.id, kind: 'video' as const, url: v.video_url })),
  ]
  // If the first item is a video and there are images too, start on the first image.
  const effective = items.length > 0 && items[current] ? current : 0

  if (items.length === 0) {
    return <div className="relative aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center"><span className="text-muted-foreground">No images or videos available</span></div>
  }

  const next = () => setCurrent((prev) => (prev + 1) % items.length)
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length)
  const item = items[effective]

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
        {item.kind === 'image' ? (
          <Image src={item.url} alt={`${title} - ${effective + 1}`} fill className="object-cover" priority />
        ) : (
          <video src={item.url} controls playsInline className="h-full w-full bg-black object-contain" />
        )}
        {item.kind === 'video' && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white"><PlayCircle className="h-3.5 w-3.5" /> Video</span>
        )}
        {items.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors" aria-label="Previous media"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors" aria-label="Next media"><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {items.map((it, idx) => (
                <button key={it.key} onClick={() => setCurrent(idx)} className={`h-2 w-2 rounded-full transition-colors ${idx === effective ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to media ${idx + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((it, idx) => (
            <button key={it.key} onClick={() => setCurrent(idx)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${idx === effective ? 'border-primary' : 'border-transparent'}`}>
              {it.kind === 'image' ? (
                <Image src={it.url} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" />
              ) : (
                <div className="relative h-full w-full bg-slate-900">
                  <video src={it.url} className="h-full w-full object-contain" muted playsInline preload="metadata" />
                  <PlayCircle className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white/80" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
