import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  MapPin,
  Shield,
} from "lucide-react"

const FullTransparency = () => {
  const handleScrollToPartners = () => {
    const partnersSection = document.getElementById("norwegian-partners")
    if (partnersSection) {
      partnersSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const qualityPoints = [
    {
      icon: Shield,
      title: "Live Order Tracking",
      description:
        "All seven delivery steps are updated live, allowing you to track your order in real-time from Norwegian fjords to your doorstep.",
    },
    {
      icon: FileCheck,
      title: "Order-Specific Certificates",
      description:
        "Every purchase comes with updated certificates providing real-time confirmation and full transparency on quality standards.",
    },
    {
      icon: CheckCircle2,
      title: "Always Up to Date",
      description:
        "All processes are handled properly and kept current—ensuring you have complete visibility into your order's journey and quality assurance.",
    },
  ]

  const originPoints = [
    {
      icon: Clock,
      detail: "Under 2 Days",
      label: "Express Delivery",
    },
    {
      icon: MapPin,
      detail: "Direct from Norway",
      label: "No Middlemen",
    },
    {
      icon: Shield,
      detail: "2 Norwegian Partners",
      label: "Trusted Sources",
    },
  ]

  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            Our Commitment
          </p>
          <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl lg:text-6xl">
            Full Transparency
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From live tracking to verified certificates, we believe in complete
            openness at every stage of your order.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Quality & Real-Time Tracking */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 font-serif text-3xl text-foreground">
                Quality & Real-Time Tracking
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                We don't just promise quality—we prove it. Every order is
                traceable, certified, and visible to you at all times.
              </p>
            </div>

            {/* Quality Points */}
            <div className="space-y-6">
              {qualityPoints.map((point, index) => {
                const Icon = point.icon
                return (
                  <div
                    key={index}
                    className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold text-foreground">
                          {point.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Assurance Badge */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Real-Time Assurance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All processes are continuously updated and verified—you're
                    always informed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Origin & Delivery Speed */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 font-serif text-3xl text-foreground">
                Origin & Delivery Speed
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lightning-fast delivery from Norway's finest suppliers, bringing
                premium Atlantic salmon directly to Ethiopia.
              </p>
            </div>

            {/* Origin Stats Cards */}
            <div className="space-y-4">
              {originPoints.map((point, index) => {
                const Icon = point.icon
                return (
                  <div
                    key={index}
                    className="flex items-center gap-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 font-serif text-2xl text-foreground">
                        {point.detail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {point.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Partner Highlight Box */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Sourcing Partners
                    </p>
                    <p className="font-serif text-xl text-foreground">
                      Norwegian Excellence
                    </p>
                  </div>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  We partner with two renowned Norwegian suppliers who share our
                  commitment to sustainability, quality, and traceability.
                  Combined, they bring over a century of seafood expertise.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleScrollToPartners}
                  className="gap-2 px-8 text-sm font-medium uppercase tracking-wide"
                >
                  Find Out More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              {/* Decorative Background */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FullTransparency
