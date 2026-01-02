import { Thermometer, Shield, FileText, Clock, Building2 } from "lucide-react";

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
];

const partners = [
  {
    name: "Nordlaks AS",
    location: "Stokmarknes, Norway",
    description: "One of Norway's largest salmon producers, Nordlaks operates sustainable aquaculture facilities across the Vesterålen archipelago. Their fjord-based farms benefit from pristine Arctic waters and strong currents that promote healthy fish development.",
    established: "Est. 1989",
  },
  {
    name: "Lerøy Seafood Group",
    location: "Bergen, Norway",
    description: "A vertically integrated seafood company controlling the entire value chain from egg to export. Lerøy's Bergen processing facility handles our premium-grade Atlantic Salmon with state-of-the-art quality control systems.",
    established: "Est. 1899",
  },
];

const TechnicalDetails = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">
            Precision Logistics
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
            Shipment Integrity
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every detail engineered to preserve quality from Arctic waters to your location.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-6 text-center border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {spec.label}
                </p>
                <p className="font-serif text-2xl text-foreground mb-1">{spec.value}</p>
                <p className="text-sm text-muted-foreground">{spec.description}</p>
              </div>
            );
          })}
        </div>

        {/* Partners Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-xs tracking-[0.2em] uppercase">Sourcing Partners</span>
            </div>
            <h3 className="font-serif text-3xl text-foreground">
              Trusted Norwegian Origins
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-serif text-xl text-foreground">{partner.name}</h4>
                    <p className="text-sm text-muted-foreground">{partner.location}</p>
                  </div>
                  <span className="text-xs text-primary font-medium">{partner.established}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalDetails;