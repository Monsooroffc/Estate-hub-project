'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@/types'

const MOCK_ADMIN: User = { id: 'mock-admin-1', email: 'monsoor.official876@gmail.com', role: 'admin' }

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
    const checkSession = async () => {
      // --- Supabase Auth version (uncomment when ready) ---
      // const supabase = createClient()
      // const { data: { user } } = await supabase.auth.getUser()
      // if (user) setUser({ id: user.id, email: user.email!, role: 'admin' })

      // --- Mock version ---
      const stored = localStorage.getItem('rrr_housing_admin_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed?.email === MOCK_ADMIN.email) {
            setUser(MOCK_ADMIN)
          } else {
            localStorage.removeItem('rrr_housing_admin_session')
            setUser(null)
          }
        } catch {
          localStorage.removeItem('rrr_housing_admin_session')
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

    // --- Mock version ---
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'monsoor.official876@gmail.com'
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'M7_Monsoor@123'
    if (email.trim().toLowerCase() === adminEmail.trim().toLowerCase() && password === adminPassword) {
      localStorage.setItem('rrr_housing_admin_session', JSON.stringify({ email: adminEmail }))
      setUser(MOCK_ADMIN)
      // Use a hard navigation here. /admin/login and /admin share the same
      // layout, which does NOT remount on soft client-side navigation — so a
      // soft router.push() can leave the layout with stale (logged-out) state
      // and bounce us straight back to the login page. A full page load
      // re-boots the app with the session already saved in localStorage.
      window.location.assign('/admin')
      return {}
    }
    return { error: 'Invalid email or password' }
  }, [router])

  const logout = useCallback(async () => {
    // const supabase = createClient(); await supabase.auth.signOut()
    localStorage.removeItem('rrr_housing_admin_session')
    setUser(null)
    router.push('/admin/login')
  }, [router])

  return { user, loading, login, logout, isAuthenticated: !!user }
}
