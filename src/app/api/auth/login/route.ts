import { NextRequest, NextResponse } from 'next/server'

// ------------------------------------------------------------------
// Demo/mock admin login endpoint.
// Validates credentials against env values SERVER-SIDE, so browser
// bundle env-inlining can never break (or leak) the login.
// Replace with Supabase Auth in production.
// ------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@rrrhousing.in').trim().toLowerCase()
    const adminPassword = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123').trim()

    if (email.trim().toLowerCase() === adminEmail && password.trim() === adminPassword) {
      return NextResponse.json({ ok: true, email: adminEmail })
    }
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'