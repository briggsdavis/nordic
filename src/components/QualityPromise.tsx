import {
  Award,
  FileCheck,
  Plane,
  Search,
  Snowflake,
  Truck,
  Waves,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const steps = [
  {
    icon: Waves,
    title: "Fjord Harvest",
    description:
      "Sustainably sourced from pristine Norwegian waters at optimal maturity.",
    location: "Norway",
  },
  {
    icon: Search,
    title: "Quality Inspection",
    description:
      "Rigorous testing for color, texture, and freshness standards.",
    location: "Processing Facility",
  },
  {
    icon: Award,
    title: "Certified Processing",
    description:
      "EU-certified facilities ensuring international food safety compliance.",
    location: "Bergen, Norway",
  },
  {
    icon: Snowflake,
    title: "Cold Chain Packaging",
    description: "Advanced insulated packaging maintaining -18°C to 4°C range.",
    location: "Export Hub",
  },
  {
    icon: Plane,
    title: "Air Transport",
    description:
      "Direct cargo flights minimizing transit time and temperature exposure.",
    location: "In Transit",
  },
  {
    icon: FileCheck,
    title: "Customs Clearance",
    description: "Pre-arranged documentation for seamless Ethiopian import.",
    location: "Bole Airport",
  },
  {
    icon: Truck,
    title: "Doorstep Delivery",
    description:
      "Refrigerated last-mile delivery to your location in Addis Ababa.",
    location: "Ethiopia",
  },
]

const QualityPromise = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(
              entry.target.getAttribute("data-step") || "0",
            )
            setVisibleSteps((prev) => [...new Set([...prev, stepIndex])])
          }
        })
      },
      { threshold: 0.3, rootMargin: "-50px" },
    )

    const stepElements = document.querySelectorAll("[data-step]")
    stepElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="origin"
      ref={sectionRef}
      className="bg-background py-24 lg:py-32"
    >
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            Transparency at Every Step
          </p>
          <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl lg:text-6xl">
            Our Quality Promise
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Seven documented steps from Norwegian fjords to Ethiopian tables.
            Each shipment is tracked, verified, and certified.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="relative mx-auto max-w-5xl">
          {/* Connecting Line */}
          <div className="absolute bottom-0 left-6 top-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const isVisible = visibleSteps.includes(index)
              const isEven = index % 2 === 0
              const Icon = step.icon

              return (
                <div
                  key={index}
                  data-step={index}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  } transition-all duration-700`}
                  style={{
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Mobile Layout */}
                  <div className="flex-shrink-0 md:hidden">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div
                    className={`hidden w-full items-center md:flex ${isEven ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Content */}
                    <div
                      className={`w-1/2 ${isEven ? "pr-12 text-right" : "pl-12 text-left"}`}
                    >
                      <span className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
                        {step.location}
                      </span>
                      <h3 className="mb-2 font-serif text-2xl text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="absolute left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-lg">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>

                    {/* Spacer */}
                    <div className="w-1/2" />
                  </div>

                  {/* Mobile Content */}
                  <div className="flex-1 md:hidden">
                    <span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
                      {step.location}
                    </span>
                    <h3 className="mb-1 font-serif text-xl text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default QualityPromise
