import { Button } from "@/components/ui/button"
import { Award, Clock, Eye, MapPin, ShoppingBag, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

const ServiceHighlight = () => {
  const features = [
    {
      icon: Clock,
      title: "Under 2 Days",
      description:
        "Direct import from Norway to Ethiopia in less than 48 hours, delivered straight to your door.",
    },
    {
      icon: ShoppingBag,
      title: "Order Online",
      description:
        "Browse our collection and place orders directly through our platform—simple, secure, and convenient.",
    },
    {
      icon: Award,
      title: "Full Transparency",
      description:
        "View all certifications and individual order certificates on our site for complete quality assurance.",
    },
    {
      icon: TrendingUp,
      title: "Live Tracking",
      description:
        "Track your order through 7 stages of delivery with real-time updates on our platform.",
    },
  ]

  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
                Premium Service
              </p>
              <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl lg:text-6xl">
                From Fjord to
                <br />
                <span className="italic">Your Doorstep</span>
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Experience the fastest, most transparent way to receive
                premium Norwegian salmon in Ethiopia. We handle every step
                of the journey so you can focus on what matters—serving
                exceptional seafood.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 px-8 text-sm font-medium uppercase tracking-wide"
              >
                <Link to="/collection">
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 px-8 text-sm font-medium uppercase tracking-wide"
              >
                <Link to="/portal">
                  <Eye className="h-4 w-4" />
                  View Certificates
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1580959375944-0d50b06e5914?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh Norwegian salmon fillet being prepared"
                className="aspect-[4/3] w-full object-cover"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-card/20 bg-card/95 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Delivery Guarantee
                    </p>
                    <p className="font-serif text-xl text-foreground">
                      48-Hour Direct Service
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceHighlight
