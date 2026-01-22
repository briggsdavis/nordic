import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"
import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/portal" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
