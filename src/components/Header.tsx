import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { CartSheet } from "@/components/cart/CartSheet";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, role, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#origin", label: "Origin" },
    { href: "#collection", label: "Collection" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handlePortalClick = () => {
    if (user) {
      navigate("/portal");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">NS</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-lg font-semibold tracking-wide transition-colors ${
                isScrolled ? "text-foreground" : "text-card"
              }`}>
                Nordic Seafood
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-card"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <CartSheet />
            
            {loading ? (
              <div className="w-24 h-9 bg-muted/50 rounded animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isScrolled ? "outline" : "secondary"}
                    className={`gap-2 ${!isScrolled && "bg-card/10 border-card/30 text-card hover:bg-card/20"}`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {profile?.full_name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/portal")} className="gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Client Portal
                  </DropdownMenuItem>
                  {role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="gap-2 cursor-pointer">
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant={isScrolled ? "outline" : "secondary"}
                className={`gap-2 ${!isScrolled && "bg-card/10 border-card/30 text-card hover:bg-card/20"}`}
                onClick={handlePortalClick}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Portal</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-card"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in">
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground text-base font-medium py-2 border-b border-border"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => {
                        navigate("/portal");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4" />
                      Client Portal
                    </Button>
                    {role === "admin" && (
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => {
                          navigate("/admin");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full gap-2 text-destructive"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      navigate("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    Portal
                  </Button>
                )}
                <CartSheet />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
