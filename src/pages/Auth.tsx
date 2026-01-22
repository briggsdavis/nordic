import LoginForm from "@/components/auth/LoginForm"
import SignUpForm from "@/components/auth/SignUpForm"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate("/portal")
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="to-arctic-mist/20 flex min-h-screen items-center justify-center bg-gradient-to-br from-ocean-deep/5 via-background p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Logo */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="font-serif text-xl font-bold text-primary-foreground">
                NS
              </span>
            </div>
            <span className="font-serif text-2xl font-semibold text-foreground">
              Nordic Seafood
            </span>
          </a>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
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
  )
}

export default Auth
