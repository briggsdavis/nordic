import { Button } from "@/components/ui/button"
import { Award, Clock, Globe, Package, Shield, Truck } from "lucide-react"
import { Link } from "react-router-dom"

const FullTransparency = () => {

  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-4xl text-foreground md:text-5xl">
            Full Transparency
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Real-time tracking, verifiable certifications, and direct sourcing
            from Norway to Ethiopia.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Quality & Real-Time Tracking */}
          <div className="space-y-8 rounded-2xl border border-border bg-card p-8 lg:p-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.3em]">
                  Quality Assurance
                </span>
              </div>
              <h3 className="mb-6 font-serif text-3xl text-foreground">
                Track Every Step
              </h3>
            </div>

            {/* Live Tracking */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-foreground">
                    Live 7-Stage Tracking
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All seven delivery stages are updated live in real-time.
                    Track your order from Norwegian fjords to your doorstep with
                    complete visibility.
                  </p>
                </div>
              </div>

              {/* Certificates */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-foreground">
                    Order-Specific Certificates
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Every purchase includes updated health and quality
                    certificates. View your order's specific documentation for
                    full transparency on quality standards.
                  </p>
                </div>
              </div>

              {/* Assurance */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-foreground">
                    Verified & Up-to-Date
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All processes are handled properly and kept current. Our
                    commitment to transparency means you always know the status
                    and quality of your salmon.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Origin & Delivery Speed */}
          <div className="space-y-8 rounded-2xl border border-border bg-card p-8 lg:p-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-primary">
                <Globe className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.3em]">
                  Direct from Source
                </span>
              </div>
              <h3 className="mb-6 font-serif text-3xl text-foreground">
                Norwegian Excellence
              </h3>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {/* Speed */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-serif text-xl text-foreground">
                    Under 2 Days
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Rapid cold-chain delivery from Norway to Ethiopia in less
                    than 48 hours.
                  </p>
                </div>
              </div>

              {/* Direct Source */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-serif text-xl text-foreground">
                    Direct from Norway
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Sourced exclusively from Norwegian Atlantic waters—no
                    intermediaries, just premium quality.
                  </p>
                </div>
              </div>

              {/* Partnerships */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-serif text-xl text-foreground">
                    Two Trusted Partners
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We work directly with two established Norwegian suppliers
                    with decades of expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full gap-2 text-sm font-medium uppercase tracking-wide sm:w-auto"
              >
                <Link to="/collection">Explore Our Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FullTransparency
