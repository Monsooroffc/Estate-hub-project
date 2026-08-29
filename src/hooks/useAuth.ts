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
    // --- Supabase Auth version (uncomment when ready) ---
    // const supabase = createClient()
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) return { error: error.message }
    // router.refresh(); return {}

    // --- Mock version: credentials are validated SERVER-SIDE via
    // /api/auth/login, so .env.local values never need to be inlined
    // into (or read from) the browser bundle. ---
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data: { ok?: boolean; email?: string; error?: string } = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        return { error: data?.error || 'Invalid email or password' }
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: data.email }))
      setUser({ id: 'mock-admin-1', email: data.email!, role: 'admin' })
      // Use a hard navigation here. /admin/login and /admin share the same
      // layout, which does NOT remount on soft client-side navigation — so a
      // soft router.push() can leave the layout with stale (logged-out) state
      // and bounce us straight back to the login page. A full page load
      // re-boots the app with the session already saved in localStorage.
      window.location.assign('/admin')
      return {}
    } catch {
      return { error: 'Could not sign in. Please try again.' }
    }
  }, [])

  const logout = useCallback(async () => {
    // const supabase = createClient(); await supabase.auth.signOut()
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    router.push('/admin/login')
  }, [router])

  return { user, loading, login, logout, isAuthenticated: !!user }
}

