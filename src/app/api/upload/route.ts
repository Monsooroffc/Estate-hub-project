import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// ------------------------------------------------------------------
// Local file upload endpoint (demo / trial mode).
// Saves images & videos into public/uploads and returns the public URL.
// NOTE: For production hosting (e.g. Vercel), prefer Supabase Storage —
// the data layer is already shaped for it (PropertyImage / PropertyVideo).
// ------------------------------------------------------------------

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/avif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
const MAX_IMAGE_SIZE = 15 * 1024 * 1024 // 15 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200 MB

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.avif',
  '.mp4', '.webm', '.mov', '.avi', '.mkv',
])

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload an image or a video file.' },
        { status: 400 }
      )
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum ${isImage ? '15 MB' : '200 MB'} for ${isImage ? 'images' : 'videos'}.` },
        { status: 400 }
      )
    }

    let ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) ext = isImage ? '.jpg' : '.mp4'

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, fileName), bytes)

    return NextResponse.json({ url: `/uploads/${fileName}`, size: file.size, type: isVideo ? 'video' : 'image' })
  } catch (err) {
    console.error('Upload failed:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

// Only allow upload requests (GET not needed).
export const dynamic = 'force-dynamic'