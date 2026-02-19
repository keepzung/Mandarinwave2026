"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  initialized: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const profileCacheRef = useRef<Map<string, { name: string; role: string; timestamp: number }>>(new Map())

  const PROFILE_CACHE_TTL = 5 * 60 * 1000

  const getProfileWithCache = useCallback(async (supabase: ReturnType<typeof createBrowserClient>, userId: string) => {
    if (!userId) {
      return { name: "", role: "student" }
    }
    
    const cached = profileCacheRef.current.get(userId)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < PROFILE_CACHE_TTL) {
      return { name: cached.name, role: cached.role }
    }
    
    // Add timeout to prevent infinite hanging
    const timeoutPromise = new Promise<{ name: string; role: string }>((_, reject) => {
      setTimeout(() => reject(new Error("Profile fetch timeout")), 8000)
    })

    const fetchPromise = async () => {
      try {
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("name, role")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle()

        const result = {
          name: profile?.name || "",
          role: profile?.role || "student",
        }

        if (!error && profile) {
          profileCacheRef.current.set(userId, { ...result, timestamp: now })
        }
        return result
      } catch (err) {
        return { name: "", role: "student" }
      }
    }

    try {
      const result = await Promise.race([fetchPromise(), timeoutPromise])
      return result
    } catch (err: any) {
      // Silently return default values on timeout or error
      return { name: "", role: "student" }
    }
  }, [])

  useEffect(() => {
    const supabase = createBrowserClient()
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!isMounted) return

        if (session?.user) {
          const profile = await getProfileWithCache(supabase, session.user.id)
          if (isMounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: profile.name,
              role: profile.role,
            })
          }
        } else {
          if (isMounted) {
            setUser(null)
          }
        }
      } catch (error) {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true)
        try {
          const profile = await getProfileWithCache(supabase, session.user.id)
          if (isMounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: profile.name,
              role: profile.role,
            })
          }
        } catch (err) {
          // Silently handle errors
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          profileCacheRef.current.clear()
          setUser(null)
          setLoading(false)
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const cached = profileCacheRef.current.get(session.user.id)
        if (cached && isMounted) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: cached.name,
            role: cached.role,
          })
        }
      } else if (event === 'INITIAL_SESSION' && session?.user) {
        const profile = await getProfileWithCache(supabase, session.user.id)
        if (isMounted) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: profile.name,
            role: profile.role,
          })
          setLoading(false)
        }
      }
    })

    subscriptionRef.current = subscription

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [getProfileWithCache])

  const login = (userData: User) => {
    setUser(userData)
    if (userData.role === "admin") {
      localStorage.setItem("adminUser", JSON.stringify(userData))
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      localStorage.removeItem("adminUser")
      localStorage.removeItem("studentLoggedIn")
      localStorage.removeItem("studentEmail")

      profileCacheRef.current.clear()

      const supabase = createBrowserClient()
      await supabase.auth.signOut({ scope: 'global' })

      setUser(null)
    } catch (error) {
      console.error("[v0] Error logging out:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    try {
      const supabase = createBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        profileCacheRef.current.delete(session.user.id)
        const profile = await getProfileWithCache(supabase, session.user.id)

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: profile.name,
          role: profile.role,
        })
      }
    } catch (error) {
      console.error("[v0] Error refreshing user:", error)
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, initialized, login, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
