import LoginForm from "@/components/auth/login-form"
import SignUpForm from "@/components/auth/sign-up-form"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate("/portal")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (!loading) {
      setShowSkeleton(false)
      return
    }

    const timer = setTimeout(() => setShowSkeleton(true), 150)
    return () => clearTimeout(timer)
  }, [loading])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {showSkeleton ? (
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="h-10 w-40" />
            <div className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-xl">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="to-arctic-mist/20 min-h-screen bg-gradient-to-br from-ocean-deep/5 via-background">
      <Header />
      <div className="flex justify-center p-4 pt-12">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
            {isLogin ? (
              <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
            ) : (
              <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
