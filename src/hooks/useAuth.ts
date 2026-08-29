'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@/types'

const SESSION_KEY = 'rrr_housing_admin_session'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Re-check the session whenever the route changes. This is important
  // because /admin/login and /admin share the same layout, which does
  // NOT remount on client-side navigation. Without re-checking here, the
  // layout keeps stale state (user = null) after login and bounces the
  // user back to the login page.
  useEffect(() => {
    const checkSession = () => {
      // --- Supabase Auth version (uncomment when ready) ---
      // const supabase = createClient()
      // const { data: { user } } = await supabase.auth.getUser()
      // if (user) setUser({ id: user.id, email: user.email!, role: 'admin' })

      // --- Mock version ---
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed?.email) {
            setUser({ id: 'mock-admin-1', email: parsed.email, role: 'admin' })
          } else {
            localStorage.removeItem(SESSION_KEY)
            setUser(null)
          }
        } catch {
          localStorage.removeItem(SESSION_KEY)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }
    checkSession()
  }, [pathname])

    const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    // --- Mock version: direct credential check against env values.
    // NEXT_PUBLIC_ vars are inlined at build time from .env.local.
    // Your email is NOT displayed in the login page UI — the placeholder
    // shows "Enter your email". ---
    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').trim().toLowerCase()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''

    console.log('[useAuth] login attempt for:', email.trim().toLowerCase())
    console.log('[useAuth] admin email:', adminEmail)
    console.log('[useAuth] match:', email.trim().toLowerCase() === adminEmail && password === adminPassword)

    if (email.trim().toLowerCase() === adminEmail && password === adminPassword) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: adminEmail }))
      setUser({ id: 'mock-admin-1', email: adminEmail, role: 'admin' })
      // Use a hard navigation here. /admin/login and /admin share the same
      // layout, which does NOT remount on soft client-side navigation — so a
      // soft router.push() can leave the layout with stale (logged-out) state
      // and bounce us straight back to the login page. A full page load
      // re-boots the app with the session already saved in localStorage.
      window.location.assign('/admin')
      return {}
    }
    return { error: 'Invalid email or password' }
  }, [])

  const logout = useCallback(async () => {
    // const supabase = createClient(); await supabase.auth.signOut()
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    router.push('/admin/login')
  }, [router])

  return { user, loading, login, logout, isAuthenticated: !!user }
}

