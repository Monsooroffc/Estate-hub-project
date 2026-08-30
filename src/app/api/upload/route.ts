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
const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
  'video/3gpp', 'video/3gpp2', 'video/x-m4v', 'video/mpeg', 'video/ogg',
]
const MAX_IMAGE_SIZE = 15 * 1024 * 1024 // 15 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200 MB

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.avif',
  '.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.3gpp', '.mpeg', '.mpg', '.ogv',
])

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.avif']
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.3gpp', '.mpeg', '.mpg', '.ogv']

// Some devices/browsers report an empty or generic MIME type (e.g. "" or
// application/octet-stream) for video files. Fall back to the file extension
// so those videos still upload instead of being rejected.
function detectFileType(file: File): 'image' | 'video' | null {
  const ext = path.extname(file.name).toLowerCase()
  if (ALLOWED_IMAGE_TYPES.includes(file.type) || IMAGE_EXTENSIONS.includes(ext)) return 'image'
  if (ALLOWED_VIDEO_TYPES.includes(file.type) || VIDEO_EXTENSIONS.includes(ext)) return 'video'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileType = detectFileType(file)
    if (!fileType) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload an image or a video file.' },
        { status: 400 }
      )
    }

    const maxSize = fileType === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum ${fileType === 'image' ? '15 MB' : '200 MB'} for ${fileType === 'image' ? 'images' : 'videos'}.` },
        { status: 400 }
      )
    }

    let ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) ext = fileType === 'image' ? '.jpg' : '.mp4'

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, fileName), bytes)

    return NextResponse.json({ url: `/uploads/${fileName}`, size: file.size, type: fileType })
  } catch (err) {
    console.error('Upload failed:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

// Only allow upload requests (GET not needed).
export const dynamic = 'force-dynamic'