import policies from "@/assets/policies.pdf"
import terms from "@/assets/terms.pdf"
import { Mail, MapPin, Phone } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="font-serif text-lg font-bold text-primary-foreground">
                  NS
                </span>
              </div>
              <span className="font-serif text-xl text-foreground">
                Nordic Seafood
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Premium Norwegian Atlantic Salmon delivered directly to Ethiopia.
              Unbroken cold chain, certified quality, from fjord to doorstep.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 font-serif text-lg text-foreground">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>Bole Road, Atlas District, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:orders@nordicseafood.et"
                  className="transition-colors hover:text-primary"
                >
                  orders@nordicseafood.et
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:+251911000000"
                  className="transition-colors hover:text-primary"
                >
                  +251 911 000 000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
<<<<<<< HEAD
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground md:flex-row md:gap-4">
            <p>© 2026 Nordic Seafood Ethiopia. All rights reserved.</p>
            <span className="hidden md:inline">·</span>
            <p>
              made by{" "}
              <a
                href="https://briggsdavis.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors hover:text-primary"
              >
                BriggsDavis
              </a>
            </p>
          </div>
=======
        <div className="mt-16 grid grid-cols-1 items-center gap-4 border-t border-border pt-8 text-center md:grid-cols-3 md:text-left">
          <p className="text-xs text-muted-foreground">
            © 2026 Nordic Seafood Ethiopia. All rights reserved.
          </p>
>>>>>>> 8d2e06e (nordic stuff)

          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a
              href={policies}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Policies
            </a>
            <a
              href={terms}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </a>
          </div>

          <p className="text-xs text-muted-foreground md:text-right">
            <a
              href="https://briggsdavis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Made by Briggs Davis
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
