import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Shield,
  ShoppingCart,
  User,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, role, signOut, loading } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  const hasHeroImage = ["/", "/products", "/contact", "/origin", "/for-chefs"].includes(
    location.pathname,
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home", isRoute: true },
    { href: "/origin", label: "Origin", isRoute: true },
    { href: "/products", label: "Products", isRoute: true },
    { href: "/for-chefs", label: "For Chefs", isRoute: true },
    { href: "/contact", label: "Contact", isRoute: true },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  const handlePortalClick = () => {
    if (user) {
      navigate("/portal")
    } else {
      navigate("/auth")
    }
  }

  return (
    <header
      className={`sticky left-0 right-0 top-0 z-50 duration-300 ${
        isScrolled || !hasHeroImage ? "bg-card/95" : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-28 items-center gap-8">
          {/* Logo */}
          <Link to="/" className="group flex w-fit items-center gap-3">
            <div className="relative flex items-center justify-center">
              <img
                src={isScrolled || !hasHeroImage ? "/vtwo.png" : "/vone.png"}
                alt="Nordic Seafood"
                className="relative w-[120px] object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`whitespace-nowrap text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                    isScrolled || !hasHeroImage ? "text-foreground" : "text-card"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                    isScrolled || !hasHeroImage ? "text-foreground" : "text-card"
                  }`}
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <CartSheet />

            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded bg-muted/50" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`gap-2 ${!isScrolled && hasHeroImage && "border-card/30 bg-card/10 text-card hover:bg-card/20"}`}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">My Orders</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => navigate("/portal")}
                    className="cursor-pointer gap-2"
                  >
                    <User className="h-4 w-4" />
                    Client Portal
                  </DropdownMenuItem>
                  {role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin")}
                      className="cursor-pointer gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer gap-2 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className={`gap-2 ${!isScrolled && hasHeroImage && "border-card/30 bg-card/10 text-card hover:bg-card/20"}`}
                onClick={handlePortalClick}
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Create Account</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`ml-auto p-2 lg:hidden ${isScrolled || !hasHeroImage ? "text-foreground" : "text-card"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 animate-fade-in rounded-2xl bg-card shadow-2xl ring-1 ring-border lg:hidden">
            <nav className="flex flex-col p-2">
              {/* Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium text-foreground">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}

              {/* Cart Row */}
              <Link
                to={user ? "/checkout" : "/auth"}
                className="group flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Cart</span>
                  {cartCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Portal Row */}
              <Link
                to={user ? "/portal" : "/auth"}
                className="group flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {user ? "My Account" : "Sign In"}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Admin Row */}
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="group flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Admin Dashboard</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              {/* Sign Out */}
              {user && (
                <button
                  className="mt-2 border-t border-border pb-2 pt-3 text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
