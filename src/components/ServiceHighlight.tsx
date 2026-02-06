import { Button } from "@/components/ui/button"
import { Award, MapPin, Package, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

const ServiceHighlight = () => {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
                How It Works
              </p>
              <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl">
                Norway to Your Door in 48 Hours
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Premium Norwegian salmon delivered fresh to your doorstep in
                under two days.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-6">
              {/* Order Online */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-xl text-foreground">
                    Order Online Anytime
                  </h3>
                  <p className="text-muted-foreground">
                    Browse and order 24/7 through our secure platform.
                  </p>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-xl text-foreground">
                    Full Transparency
                  </h3>
                  <p className="text-muted-foreground">
                    View all health and quality certificates directly on our
                    site.
                  </p>
                </div>
              </div>

              {/* Live Tracking */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-xl text-foreground">
                    Live Delivery Tracking
                  </h3>
                  <p className="text-muted-foreground">
                    Track your order through all 7 stages with real-time
                    updates.
                  </p>
                </div>
              </div>

              {/* Direct Delivery */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-xl text-foreground">
                    Direct Home Delivery
                  </h3>
                  <p className="text-muted-foreground">
                    Refrigerated delivery across Addis Ababa—no middlemen, no
                    delays.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="gap-2 px-8 py-6 text-sm font-medium uppercase tracking-wide"
              >
                <Link to="/collection">
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:order-last">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1580959375944-0a23d9df6e86?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh Norwegian salmon fillet being prepared in modern kitchen"
                className="aspect-[4/5] w-full object-cover lg:aspect-square"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-card/95 p-6 backdrop-blur-sm">
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Premium Quality
                </p>
                <p className="font-serif text-xl text-foreground">
                  Norwegian Atlantic Salmon
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sustainably harvested, cold-chain verified, delivered fresh
                </p>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -right-4 -top-4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceHighlight
