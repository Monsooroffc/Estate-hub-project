'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PropertyImage } from '@/types'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) {
    return <div className="relative aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center"><span className="text-muted-foreground">No images available</span></div>
  }

  const next = () => setCurrent((prev) => (prev + 1) % images.length)
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
        <Image src={images[current].image_url} alt={`${title} - ${current + 1}`} fill className="object-cover" priority />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors" aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors" aria-label="Next image"><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 w-2 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to image ${idx + 1}`} />)}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button key={img.id} onClick={() => setCurrent(idx)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${idx === current ? 'border-primary' : 'border-transparent'}`}>
              <Image src={img.image_url} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
