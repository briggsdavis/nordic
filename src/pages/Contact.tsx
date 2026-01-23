import contactHero from "@/assets/contact.jpg"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react"

const Contact = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative -mt-20 flex min-h-[70vh] items-end justify-center overflow-hidden pb-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={contactHero}
              alt="Contact Nordic Seafood"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-6 text-center lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-4 animate-fade-in-up text-xs uppercase tracking-[0.3em] text-card/80 opacity-0 md:text-sm"
                style={{ animationDelay: "0.2s" }}
              >
                Contact Us
              </p>
              <h1
                className="mb-6 animate-fade-in-up font-serif text-4xl text-card opacity-0 md:text-5xl lg:text-6xl"
                style={{ animationDelay: "0.4s" }}
              >
                Get in Touch
              </h1>
              <p
                className="mx-auto max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-card/90 opacity-0"
                style={{ animationDelay: "0.6s" }}
              >
                Whether you're a restaurant, hotel, or retailer looking for
                premium Norwegian salmon, we're here to help. Reach out to
                discuss your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Location */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">Visit Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Bole Road, Atlas District
                    <br />
                    Addis Ababa, Ethiopia
                  </p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:orders@nordicseafood.et"
                    className="text-primary hover:underline"
                  >
                    orders@nordicseafood.et
                  </a>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For orders and general inquiries
                  </p>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:+251911000000"
                    className="text-primary hover:underline"
                  >
                    +251 911 000 000
                  </a>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Monday - Saturday, 8am - 6pm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* B2B Section */}
        <section className="bg-secondary py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-serif text-3xl text-foreground lg:text-4xl">
                  Business Inquiries
                </h2>
                <p className="text-lg text-muted-foreground">
                  Looking to establish a regular supply of premium Norwegian
                  salmon for your business?
                </p>
              </div>

              <Card className="border-border">
                <CardContent className="p-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-1 font-medium text-foreground">
                            WhatsApp Business
                          </h3>
                          <a
                            href="https://wa.me/251911000000"
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            +251 911 000 000
                          </a>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Quick responses for urgent inquiries
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-1 font-medium text-foreground">
                            Business Hours
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Monday - Friday: 8:00 AM - 6:00 PM
                            <br />
                            Saturday: 9:00 AM - 2:00 PM
                            <br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">We serve:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Hotels & Resorts
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Restaurants & Cafes
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Catering Companies
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Supermarkets & Retailers
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Food Distributors
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border pt-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                      Ready to discuss your requirements?
                    </p>
                    <Button asChild size="lg">
                      <a href="mailto:orders@nordicseafood.et?subject=B2B Inquiry">
                        Send Business Inquiry
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
