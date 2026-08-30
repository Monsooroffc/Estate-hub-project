import { NextResponse } from 'next/server'

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

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? ''

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured. Add NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD to .env.local' },
      { status: 500 }
    )
  }

  const normalizedEmail = String(email ?? '').trim().toLowerCase()
  const submittedPassword = String(password ?? '')

  if (
    normalizedEmail === adminEmail.trim().toLowerCase() &&
    submittedPassword === adminPassword
  ) {
    return NextResponse.json({ email: adminEmail, ok: true })
  }

  return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
}