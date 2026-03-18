import { create } from 'zustand'
import { supabase } from '../services/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, role: null, session: null }),
}))

async function fetchRole(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Failed to fetch role:', error)
      return null
    }
    return data?.role ?? null
  } catch (err) {
    console.error('fetchRole exception:', err)
    return null
  }
}

// Sequence counter to discard stale async results
let authSeq = 0

// Initialize auth state once at module load — outside React lifecycle
async function initAuth() {
  const { setUser, setRole, setSession, setLoading, clear } = useAuthStore.getState()

  // 1. Restore session from localStorage on first load
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      setUser(session.user)
      setSession(session)
      const role = await fetchRole(session.user.id)
      setRole(role)
    }
  } catch (err) {
    console.error('Session init error:', err)
  } finally {
    setLoading(false)
  }

  // 2. Listen for all future auth changes (login, logout, token refresh)
  supabase.auth.onAuthStateChange(async (event, session) => {
    const seq = ++authSeq

    if (event === 'SIGNED_OUT') {
      clear()
      setLoading(false)
      return
    }

    // Skip INITIAL_SESSION — already handled above by getSession()
    if (event === 'INITIAL_SESSION') return

    if (session?.user) {
      setUser(session.user)
      setSession(session)

      // On token refresh, keep existing role — don't re-fetch and risk nulling it
      const current = useAuthStore.getState()
      if (event === 'TOKEN_REFRESHED' && current.role && current.user?.id === session.user.id) {
        setLoading(false)
        return
      }

      const role = await fetchRole(session.user.id)
      // Only apply if this is still the latest auth event
      if (seq === authSeq) {
        setRole(role)
        setLoading(false)
      }
    } else {
      clear()
      setLoading(false)
    }
  })
}

initAuth()
