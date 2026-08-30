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

  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').trim()
  const adminPassword = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '').trim()

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured. Add NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD to .env.local' },
      { status: 500 }
    )
  }

  const submittedEmail = String(email ?? '').trim().toLowerCase()
  const submittedPassword = String(password ?? '')

  if (submittedEmail === adminEmail.toLowerCase() && submittedPassword === adminPassword) {
    return NextResponse.json({ email: adminEmail, ok: true })
  }

  // Fail loudly and helpfully instead of a generic message, so a credentials
  // mismatch in .env.local vs. what was typed is immediately obvious.
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