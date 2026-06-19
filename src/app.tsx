import ProtectedRoute from "@/components/auth/protected-route"
import ScrollToTop from "@/components/scroll-to-top"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/contexts/auth-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Index from "./pages/index"
import NotFound from "./pages/not-found"

// Lazy-loaded routes
const Admin = lazy(() => import("./pages/admin"))
const Auth = lazy(() => import("./pages/auth"))
const Checkout = lazy(() => import("./pages/checkout"))
const Collection = lazy(() => import("./pages/collection"))
const Contact = lazy(() => import("./pages/contact"))
const Origin = lazy(() => import("./pages/origin"))
const CulinaryOpportunity = lazy(() => import("./pages/culinary-opportunity"))
const Portal = lazy(() => import("./pages/portal"))
const ProductDetail = lazy(() => import("./pages/product-detail"))

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products" element={<Collection />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/for-chefs" element={<CulinaryOpportunity />} />
              <Route path="/origin" element={<Origin />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal"
                element={
                  <ProtectedRoute>
                    <Portal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
