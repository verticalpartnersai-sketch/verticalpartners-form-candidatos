import { createContext, useState, useEffect, useCallback, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import type { AdminUser } from "@/types"

interface AuthContextValue {
  readonly user: AdminUser | null
  readonly loading: boolean
  readonly signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  readonly signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: "Supabase nao configurado." }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao fazer login."
      return { success: false, error: message }
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao sair."
      throw new Error(message)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
