'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'

const MOCK_ADMIN: User = { id: 'mock-admin-1', email: 'admin@example.com', role: 'admin' }

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      // --- Supabase Auth version (uncomment when ready) ---
      // const supabase = createClient()
      // const { data: { user } } = await supabase.auth.getUser()
      // if (user) setUser({ id: user.id, email: user.email!, role: 'admin' })

      // --- Mock version ---
      const stored = localStorage.getItem('estatehub_admin_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed?.email === MOCK_ADMIN.email) setUser(MOCK_ADMIN)
        } catch { localStorage.removeItem('estatehub_admin_session') }
      }
      setLoading(false)
    }
    checkSession()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    // --- Supabase Auth version (uncomment when ready) ---
    // const supabase = createClient()
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) return { error: error.message }
    // router.refresh(); return {}

    // --- Mock version ---
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('estatehub_admin_session', JSON.stringify({ email }))
      setUser(MOCK_ADMIN)
      router.push('/admin')
      return {}
    }
    return { error: 'Invalid email or password' }
  }, [router])

  const logout = useCallback(async () => {
    // const supabase = createClient(); await supabase.auth.signOut()
    localStorage.removeItem('estatehub_admin_session')
    setUser(null)
    router.push('/admin/login')
  }, [router])

  return { user, loading, login, logout, isAuthenticated: !!user }
}
