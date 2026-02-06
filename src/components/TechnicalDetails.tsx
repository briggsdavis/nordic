import { Button } from "@/components/ui/button"
import {
  Building2,
  Clock,
  ExternalLink,
  FileText,
  Shield,
  Thermometer,
} from "lucide-react"

const specs = [
  {
    icon: Thermometer,
    label: "Temperature Range",
    value: "-18°C to 4°C",
    description: "Maintained throughout transit",
  },
  {
    icon: Clock,
    label: "Transit Time",
    value: "48-72 Hours",
    description: "Fjord to Addis Ababa",
  },
  {
    icon: Shield,
    label: "Packaging",
    value: "Multi-Layer",
    description: "Insulated polystyrene containers",
  },
  {
    icon: FileText,
    label: "Certifications",
    value: "EU Compliant",
    description: "Health & origin verified",
  },
]

const partners = [
  {
    name: "Brødrene Remø",
    location: "Fiskerstrand, Norway",
    description:
      "With a heritage spanning over a century since 1918, Brødrene Remø has evolved from a coastal family shop on the Sunnmøre coast into a global leader in sustainable seafood. They combine time-honored seafaring wisdom with cutting-edge technology to produce world-recognized Atlantic salmon and traditional smoked delicacies. Our partnership brings over 100 years of passion and sustainable craftsmanship to you, guaranteeing a level of quality and authenticity that only a century of experience can provide.",
    established: "Est. 1918",
    website: "https://www.goldfish.no/",
    buttonLabel: "Visit Brødrene Remø",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Norwegian coastal facility of Brødrene Remø",
  },
  {
    name: "Fishcorp of Norway",
    location: "Norway",
    description:
      "Drawing from over a millennium of tradition, Fishcorp of Norway is a premier exporter dedicated to sharing nutrient-rich, sustainable seafood with the world. Specializing in delicacies like authentic Arctic stockfish and premium Atlantic salmon, they utilize strict quality controls that honor 9th-century Viking innovations. By partnering with Fishcorp, we provide \"Seafood for Healthy Generations,\" ensuring every product meets Norway's most rigorous food safety standards.",
    established: "Est. 9th Century Tradition",
    website: "https://www.fishcorp.no/#about_us",
    buttonLabel: "Visit Fishcorp",
    imageUrl:
      "https://images.unsplash.com/photo-1574781330855-d0db3cc5cc1e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Premium Atlantic salmon from Fishcorp of Norway",
  },
]

const TechnicalDetails = () => {
  return (
    <section
      className="bg-secondary py-24 lg:py-32"
      aria-labelledby="technical-title"
    >
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            Precision Logistics
          </p>
          <h2
            id="technical-title"
            className="mb-6 font-serif text-4xl text-foreground md:text-5xl"
          >
            Shipment Integrity
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Every detail engineered to preserve quality from Arctic waters to
            your kitchen.
          </p>
        </div>

        {/* Specs Grid */}
        <ul className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec, index) => {
            const Icon = spec.icon
            return (
              <li
                key={index}
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-primary/10">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {spec.label}
                </p>
                <p className="mb-1 font-serif text-2xl text-foreground">
                  {spec.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {spec.description}
                </p>
              </li>
            )
          })}
        </ul>

        {/* Partners Section */}
        <div id="norwegian-partners" className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em]">
                Sourcing Partners
              </span>
            </div>
            <h3 className="mb-4 font-serif text-3xl text-foreground md:text-4xl">
              Trusted Norwegian Origins
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We partner with Norway's most respected seafood producers,
              combining centuries of tradition with uncompromising quality
              standards.
            </p>
          </div>

          {/* Partner Cards */}
          <div className="space-y-12">
            {/* Brødrene Remø - Text Left, Image Right */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="grid gap-0 lg:grid-cols-2">
                {/* Text Content */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-4">
                    <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wide text-primary">
                      {partners[0].established}
                    </span>
                    <h4 className="mb-2 font-serif text-3xl text-foreground">
                      {partners[0].name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {partners[0].location}
                    </p>
                  </div>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {partners[0].description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-fit gap-2"
                  >
                    <a
                      href={partners[0].website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {partners[0].buttonLabel}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={partners[0].imageUrl}
                    alt={partners[0].imageAlt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card/20 to-transparent" />
                </div>
              </div>
            </div>

            {/* Fishcorp - Image Left, Text Right */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="grid gap-0 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={partners[1].imageUrl}
                    alt={partners[1].imageAlt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-card/20 to-transparent" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-4">
                    <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wide text-primary">
                      {partners[1].established}
                    </span>
                    <h4 className="mb-2 font-serif text-3xl text-foreground">
                      {partners[1].name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {partners[1].location}
                    </p>
                  </div>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {partners[1].description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-fit gap-2"
                  >
                    <a
                      href={partners[1].website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {partners[1].buttonLabel}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnicalDetails
