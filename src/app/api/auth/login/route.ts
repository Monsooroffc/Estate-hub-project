import { NextResponse } from 'next/server'

// ------------------------------------------------------------------
// Demo/mock admin login endpoint.
// Reads credentials from env (NEXT_PUBLIC_ADMIN_EMAIL /
// NEXT_PUBLIC_ADMIN_PASSWORD). If those are not configured, falls back
// to the documented demo credentials (admin@rrrhousing.in / admin123)
// so admin login ALWAYS works — even on a deployment where the
// gitignored .env.local was not included.
// ------------------------------------------------------------------

const FALLBACK_EMAIL = 'admin@rrrhousing.in'
const FALLBACK_PASSWORD = 'admin123'

// Always read env vars fresh on every request so .env.local changes apply
// immediately in dev — never baked into a stale build.
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let email: unknown
  let password: unknown

  try {
    const body = await request.json()
    email = body?.email
    password = body?.password
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').trim() || FALLBACK_EMAIL
  const adminPassword = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '').trim() || FALLBACK_PASSWORD

  const submittedEmail = String(email ?? '').trim().toLowerCase()
  const submittedPassword = String(password ?? '')

  if (submittedEmail === adminEmail.toLowerCase() && submittedPassword === adminPassword) {
    return NextResponse.json({ email: adminEmail, ok: true, fallback: !(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').trim() })
  }

  // Fail loudly and helpfully instead of a generic message, so a credentials
  // mismatch is immediately obvious.
  if (submittedEmail !== adminEmail.toLowerCase()) {
    return NextResponse.json(
      { error: `No admin account for "${submittedEmail}". Use the configured admin email: ${adminEmail}` },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { error: 'Incorrect password. Check the password in .env.local and try again.' },
    { status: 401 }
  )
}