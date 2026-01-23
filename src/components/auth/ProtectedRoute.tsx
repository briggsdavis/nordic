import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { ReactNode, useEffect, useState } from "react"
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
  const [showSkeleton, setShowSkeleton] = useState(false)

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
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        {showSkeleton ? (
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : null}
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
