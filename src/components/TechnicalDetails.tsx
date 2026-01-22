import { Building2, Clock, FileText, Shield, Thermometer } from "lucide-react"

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
    name: "Nordlaks AS",
    location: "Stokmarknes, Norway",
    description:
      "One of Norway's largest salmon producers, Nordlaks operates sustainable aquaculture facilities across the Vesterålen archipelago. Their fjord-based farms benefit from pristine Arctic waters and strong currents that promote healthy fish development.",
    established: "Est. 1989",
  },
  {
    name: "Lerøy Seafood Group",
    location: "Bergen, Norway",
    description:
      "A vertically integrated seafood company controlling the entire value chain from egg to export. Lerøy's Bergen processing facility handles our premium-grade Atlantic Salmon with state-of-the-art quality control systems.",
    established: "Est. 1899",
  },
]

const TechnicalDetails = () => {
  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            Precision Logistics
          </p>
          <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl">
            Shipment Integrity
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Every detail engineered to preserve quality from Arctic waters to
            your location.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="mb-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {specs.map((spec, index) => {
            const Icon = spec.icon
            return (
              <div
                key={index}
                className="group rounded-lg border border-border bg-card p-6 text-center transition-colors hover:border-primary/30"
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
              </div>
            )
          })}
        </div>

        {/* Partners Section */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em]">
                Sourcing Partners
              </span>
            </div>
            <h3 className="font-serif text-3xl text-foreground">
              Trusted Norwegian Origins
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-xl text-foreground">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {partner.location}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    {partner.established}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnicalDetails
