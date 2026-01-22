import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
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
            <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Premium Norwegian Atlantic Salmon delivered directly to Ethiopia.
              Unbroken cold chain, certified quality, from fjord to doorstep.
            </p>
{/* <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div> */}
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 font-serif text-lg text-foreground">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>
                  Bole Road, Atlas District
                  <br />
                  Addis Ababa, Ethiopia
                </span>
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

          {/* Certifications */}
          <div>
            <h4 className="mb-6 font-serif text-lg text-foreground">
              Certifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                  EU
                </div>
                <span>EU Health Certificate</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                  NO
                </div>
                <span>Norwegian Origin</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                  ASC
                </div>
                <span>Sustainable Aquaculture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Nordic Seafood Ethiopia. All rights reserved.
          </p>
{/* <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms of Service
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
