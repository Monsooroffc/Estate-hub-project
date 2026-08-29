import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Protect admin routes (except login)
  // const pathname = request.nextUrl.pathname
  // if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
  //   const supabase = createServerClient(...)
  //   const { data: { user } } = await supabase.auth.getUser()
  //   if (!user) return NextResponse.redirect(new URL('/admin/login', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
