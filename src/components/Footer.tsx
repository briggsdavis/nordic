import { useSiteSettings } from "@/hooks/useSiteSettings"
import { Mail, MapPin, Phone } from "lucide-react"

const Footer = () => {
  const { data: settings } = useSiteSettings()
  const phone = settings?.contact_phone ?? "+251 911 000 000"
  const email = settings?.contact_email ?? "orders@nordicseafood.et"
  const phoneRaw = phone.replace(/\s+/g, "")

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
                <span>
                  South African Street, Shimekit Commercial Center 10/12, Woreda
                  08, Lideta Sub City, Addis Ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-primary"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`tel:${phoneRaw}`}
                  className="transition-colors hover:text-primary"
                >
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Nordic Seafood Ethiopia. All rights reserved.
          </p>

          <p className="text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://briggsdavis.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-primary"
            >
              Briggs Davis
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
