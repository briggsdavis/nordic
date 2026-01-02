import { MapPin, Mail, Phone, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">NS</span>
              </div>
              <span className="font-serif text-xl text-foreground">Nordic Seafood</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
              Premium Norwegian Atlantic Salmon delivered directly to Ethiopia. 
              Unbroken cold chain, certified quality, from fjord to doorstep.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Bole Road, Atlas District<br />Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:orders@nordicseafood.et" className="hover:text-primary transition-colors">
                  orders@nordicseafood.et
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+251911000000" className="hover:text-primary transition-colors">
                  +251 911 000 000
                </a>
              </li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Certifications</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                  EU
                </div>
                <span>EU Health Certificate</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                  NO
                </div>
                <span>Norwegian Origin</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                  ASC
                </div>
                <span>Sustainable Aquaculture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Nordic Seafood Ethiopia. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;