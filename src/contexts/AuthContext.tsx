import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { Session, User } from "@supabase/supabase-js"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type AppRole = Database["public"]["Enums"]["app_role"]

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  role: AppRole | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: (optimistic?: {
    profile?: Profile | null
    role?: AppRole | null
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [role, setRole] = useState<AppRole | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const currentUserIdRef = useRef<string | null>(null)
  const hasLoadedProfileRef = useRef(false)
  const initialSessionHandledRef = useRef(false)

  const shouldRetry = (message: string) => {
    const normalized = message.toLowerCase()
    return (
      normalized.includes("network") ||
      normalized.includes("timeout") ||
      normalized.includes("fetch")
    )
  }

  const runWithRetry = async <T,>(
    fetcher: () => Promise<{
      data: T | null
      error: { message: string } | null
    }>,
    retries = 1,
  ) => {
    let lastError: { message: string } | null = null

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const { data, error } = await fetcher()

      if (!error) {
        return { data, error: null }
      }

      lastError = error

      if (attempt < retries && shouldRetry(error.message)) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)))
        continue
      }
      break
    }

    return { data: null, error: lastError }
  }

  const fetchUserData = async (userId: string) => {
    const [profileResult, roleResult] = await Promise.all([
      runWithRetry(async () =>
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      ),
      runWithRetry(async () =>
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle(),
      ),
    ])

    if (profileResult.error || roleResult.error) {
      const detail = [profileResult.error?.message, roleResult.error?.message]
        .filter(Boolean)
        .join(" | ")

      toast({
        variant: "destructive",
        title: "Profile load failed",
        description: detail || "Unable to load your profile. Please retry.",
      })
      return null
    }

    return {
      profile: profileResult.data,
      role: roleResult.data?.role ?? null,
    }
  }

  const updateSession = (sessionData: Session | null) => {
    setSession(sessionData)
    setUser(sessionData?.user ?? null)

    const nextUserId = sessionData?.user?.id ?? null
    if (nextUserId !== currentUserIdRef.current) {
      currentUserIdRef.current = nextUserId
      hasLoadedProfileRef.current = false
    }

    if (!sessionData?.user) {
      setProfile(null)
      setRole(null)
    }
  }

  const loadUserData = async (userId: string) => {
    const data = await fetchUserData(userId)

    if (!data || currentUserIdRef.current !== userId) {
      return
    }

    setProfile(data.profile)
    setRole(data.role)
    hasLoadedProfileRef.current = true
  }

  const handleSession = async (
    sessionData: Session | null,
    options?: { defer?: boolean; shouldFetch?: boolean },
  ) => {
    updateSession(sessionData)

    if (!sessionData?.user) {
      return
    }

    const shouldFetch = options?.shouldFetch ?? !hasLoadedProfileRef.current

    if (!shouldFetch) {
      return
    }

    if (options?.defer) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          void loadUserData(sessionData.user.id).finally(resolve)
        }, 0)
      })
      return
    }

    await loadUserData(sessionData.user.id)
  }

  const refreshProfile = async (optimistic?: {
    profile?: Profile | null
    role?: AppRole | null
  }) => {
    if (!user) {
      return
    }

    const previousProfile = profile
    const previousRole = role

    if (optimistic?.profile !== undefined) {
      setProfile(optimistic.profile ?? null)
    }
    if (optimistic?.role !== undefined) {
      setRole(optimistic.role ?? null)
    }

    const data = await fetchUserData(user.id)

    if (!data || currentUserIdRef.current !== user.id) {
      setProfile(previousProfile)
      setRole(previousRole)
      return
    }

    setProfile(data.profile)
    setRole(data.role)
    hasLoadedProfileRef.current = true
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, sessionData) => {
      if (event === "INITIAL_SESSION" && !initialSessionHandledRef.current) {
        initialSessionHandledRef.current = true
        setLoading(true)
        void handleSession(sessionData, { defer: true }).finally(() => {
          setLoading(false)
        })
        return
      }

      if (event === "SIGNED_IN") {
        setLoading(true)
        void handleSession(sessionData, {
          defer: true,
          shouldFetch: true,
        }).finally(() => {
          setLoading(false)
        })
        return
      }

      void handleSession(sessionData, { defer: true })
    })

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: sessionData } }) => {
      if (initialSessionHandledRef.current) {
        return
      }

      initialSessionHandledRef.current = true
      setLoading(true)
      void handleSession(sessionData).finally(() => {
        setLoading(false)
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setRole(null)
    currentUserIdRef.current = null
    hasLoadedProfileRef.current = false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
