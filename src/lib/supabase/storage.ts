import { getDb, isSupabaseConfigured, missingSupabaseEnvVars } from './db'

// Re-export so client components only need one import.
export { isSupabaseConfigured }

// ---------------------------------------------------------------------------
// Direct browser -> Supabase Storage uploads (property photos & videos).
// Uses ONLY the publishable key — access is governed by the storage policies
// created in supabase/storage-setup.sql. Large files never pass through the
// Next.js server, so the HTTP 413 "Payload Too Large" problem is gone.
// ---------------------------------------------------------------------------

export const PROPERTY_IMAGE_BUCKET = 'property-images'
export const PROPERTY_VIDEO_BUCKET = 'property-videos'

export type MediaKind = 'image' | 'video'

const MAX_IMAGE_SIZE = 15 * 1024 * 1024 // 15 MB (matches bucket limit)
const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500 MB (matches bucket limit)

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.avif']
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.3gpp', '.mpeg', '.mpg', '.ogv']

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/avif']
const VIDEO_MIME_TYPES = [
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
  'video/3gpp', 'video/3gpp2', 'video/x-m4v', 'video/mpeg', 'video/ogg',
]

// Some devices report an empty or generic MIME ("", "application/octet-stream").
// Fall back to the file extension so those files still upload.
export function detectMediaKind(file: File): MediaKind | null {
  const name = file.name || ''
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : ''
  const mime = (file.type || '').toLowerCase()
  if (IMAGE_MIME_TYPES.includes(mime) || IMAGE_EXTENSIONS.includes(ext)) return 'image'
  if (VIDEO_MIME_TYPES.includes(mime) || VIDEO_EXTENSIONS.includes(ext) || mime === 'application/octet-stream') return 'video'
  return null
}

function getFileExtension(file: File, kind: MediaKind): string {
  const name = file.name || ''
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : ''
  if (/^\.[a-z0-9]{1,5}$/.test(ext)) return ext
  return kind === 'image' ? '.jpg' : '.mp4'
}

function sanitizeBaseName(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').toLowerCase()
  const clean = base.replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
  return clean || 'file'
}

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// Turns raw Supabase Storage errors into actionable messages.
function mapStorageError(err: { message?: string; statusCode?: string | number } | null, kind: MediaKind): string {
  const msg = err?.message || ''
  const code = String(err?.statusCode ?? '')
  if (code === '413' || /payload too large|exceeded the maximum allowed|file size limit/i.test(msg)) {
    return `File too large for Supabase Storage (max ${kind === 'image' ? '15 MB' : '500 MB'}). ${msg}`
  }
  if (/bucket/i.test(msg) && /not ?found|does not exist|no such/i.test(msg)) {
    return 'Storage bucket not found. Run supabase/storage-setup.sql in the Supabase SQL Editor, then try again.'
  }
  if (/row-level security|permission|unauthorized|forbidden/i.test(msg) || code === '403') {
    return 'Storage permission denied. Run supabase/storage-setup.sql in the Supabase SQL Editor to create the storage policies, then try again.'
  }
  if (/mime|file type|unsupported/i.test(msg)) {
    return `Unsupported ${kind} format for Supabase Storage. ${msg}`
  }
  return `${msg || 'Upload failed'} — raw Supabase error: ${err?.message || '(no message)'}${code ? ` (HTTP ${code})` : ''} [${kind}]`
}

/**
 * Uploads a file to Supabase Storage and resolves with its URL (which is then
 * saved on the property record).
 *
 * When Supabase credentials ARE configured: uploads directly from the browser
 * to the `property-images` / `property-videos` bucket and returns the public
 * URL (.jpg/.png/.webp images, .mp4/.webm/.mov videos, etc.).
 *
 * When Supabase credentials are NOT configured (local demo mode): returns a
 * short-lived in-memory object URL for the file so local testing works
 * smoothly. Mock URLs are not persisted and vanish on page refresh.
 */
export async function uploadPropertyMedia(file: File, kind: MediaKind): Promise<string> {
  // Sanity-check that the chosen file matches what the uploader expects
  // (images: .jpg/.jpeg/.png/.webp/... — videos: .mp4/.webm/.mov/...).
  const detected = detectMediaKind(file)
  if (!detected) {
    throw new Error(`Unsupported file "${file.name || 'unnamed'}". Please choose an image (.jpg, .png, .webp, …) or a video (.mp4, .webm, .mov, …).`)
  }
  if (detected !== kind) {
    throw new Error(`Wrong file type: "${file.name || 'unnamed'}" is a ${detected}, but this uploader expects a ${kind}.`)
  }

  // ------------------------------------------------------------------
  // LOCAL DEMO FALLBACK — no Supabase credentials in the environment.
  // Keep the form fully usable: hand back an in-memory object URL so
  // previews and submission work locally without any server round-trip.
  // ------------------------------------------------------------------
  if (!isSupabaseConfigured) {
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const missing = missingSupabaseEnvVars().join(' and ')
      console.warn(
        `[demo mode] "${file.name}" was NOT uploaded to Supabase Storage — ${missing} missing in .env.local. ` +
        'Using a temporary local preview URL instead (it will not survive a page refresh).'
      )
      return URL.createObjectURL(file)
    }
    throw new Error(
      `Supabase is not configured — set ${missingSupabaseEnvVars().join(' and ')} in .env.local, then restart the dev server (npm run dev).`
    )
  }

  if (file.size > (kind === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE)) {
    throw new Error(`File too large. Maximum ${kind === 'image' ? '15 MB' : '500 MB'} for ${kind === 'image' ? 'photos' : 'videos'}.`)
  }

  const bucket = kind === 'image' ? PROPERTY_IMAGE_BUCKET : PROPERTY_VIDEO_BUCKET
  const path = `properties/${sanitizeBaseName(file.name)}-${randomId()}${getFileExtension(file, kind)}`
  // Keep the browser's MIME when present; generic octet-stream is allowed for
  // videos by the bucket policy so phone/camera files still upload.
  const contentType = file.type || (kind === 'image' ? 'image/jpeg' : 'video/mp4')

  try {
    const { error } = await getDb().storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      contentType,
      upsert: false,
    })
    if (error) throw error

    const { data } = getDb().storage.from(bucket).getPublicUrl(path)
    if (!data?.publicUrl) throw new Error('Could not resolve the public URL of the uploaded file.')
    return data.publicUrl
  } catch (err) {
    const storageErr = err as { message?: string; statusCode?: string | number }
    throw new Error(mapStorageError(storageErr, kind))
  }
}
