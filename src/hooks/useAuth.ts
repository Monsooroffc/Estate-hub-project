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
    // Validate credentials via the SERVER-SIDE API route. The API route reads
    // env vars fresh on every request (force-dynamic), so it always uses the
    // current values from .env.local — no stale build cache issues.
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()
        const adminEmail = data.email || email
        localStorage.setItem(SESSION_KEY, JSON.stringify({ email: adminEmail }))
        setUser({ id: 'mock-admin-1', email: adminEmail, role: 'admin' })
        // Hard navigation: re-boots the app fresh so the admin layout picks up
        // the new session instead of keeping stale (logged-out) state.
        window.location.assign('/admin')
        return {}
      }

      const err = await res.json().catch(() => ({}))
      return { error: err.error || 'Invalid email or password' }
    } catch {
      return { error: 'Network error. Please try again.' }
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

