import { ChefHat, Ruler, Scale, Utensils } from "lucide-react"

const cuts = [
  {
    name: "Loin",
    description:
      "Prime center cut, uniform thickness for even cooking. Ideal for high-end presentations.",
    yield: "25-30%",
    applications: ["Fine Dining", "Sashimi", "Grilling"],
  },
  {
    name: "Belly",
    description:
      "Rich, fatty section prized for its intense flavor. Perfect for curing or grilling.",
    yield: "15-20%",
    applications: ["Gravlax", "Smoking", "Tataki"],
  },
  {
    name: "Tail",
    description:
      "Leaner cut with firm texture. Excellent for portion control and consistent plating.",
    yield: "10-15%",
    applications: ["Portions", "Kebabs", "Staff Meals"],
  },
  {
    name: "Collar",
    description:
      "Chef's favorite cut with rich marbling. Often reserved for in-house specialties.",
    yield: "5-8%",
    applications: ["Grilled", "Braised", "Chef's Table"],
  },
]

const TrimmingGuide = () => {
  return (
    <section className="bg-foreground py-24 text-card lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 text-card/60">
              <ChefHat className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.3em]">
                For Professionals
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl text-card md:text-5xl">
              Trimming Guide
            </h2>
            <p className="text-lg leading-relaxed text-card/70">
              Maximize yield and minimize waste with our professional breakdown
              guide. Each salmon is an opportunity for multiple revenue streams.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 flex gap-8 lg:mt-0">
            <div className="text-center">
              <Scale className="mx-auto mb-2 h-6 w-6 text-card/60" />
              <p className="font-serif text-2xl text-card">85%</p>
              <p className="text-xs uppercase tracking-wide text-card/60">
                Usable Yield
              </p>
            </div>
            <div className="text-center">
              <Ruler className="mx-auto mb-2 h-6 w-6 text-card/60" />
              <p className="font-serif text-2xl text-card">4-6 kg</p>
              <p className="text-xs uppercase tracking-wide text-card/60">
                Avg. Weight
              </p>
            </div>
            <div className="text-center">
              <Utensils className="mx-auto mb-2 h-6 w-6 text-card/60" />
              <p className="font-serif text-2xl text-card">8+</p>
              <p className="text-xs uppercase tracking-wide text-card/60">
                Cut Types
              </p>
            </div>
          </div>
        </div>

        {/* Salmon Diagram Placeholder */}
        <div className="relative mb-16 overflow-hidden rounded-lg border border-card/10 bg-card/5">
          <div className="flex aspect-[21/9] items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=80"
              alt="Salmon preparation"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/50 to-transparent" />
            <div className="absolute left-8 top-1/2 max-w-md -translate-y-1/2">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-card/60">
                Professional Breakdown
              </p>
              <h3 className="mb-3 font-serif text-3xl text-card">
                Every Cut Has Purpose
              </h3>
              <p className="text-sm text-card/70">
                From premium loin portions to rich belly strips, we help you
                utilize every section efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Cuts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cuts.map((cut, index) => (
            <div
              key={index}
              className="rounded-lg border border-card/10 bg-card/5 p-6 transition-colors hover:bg-card/10"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="font-serif text-xl text-card">{cut.name}</h3>
                <span className="text-sm font-medium text-primary">
                  {cut.yield}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-card/60">
                {cut.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {cut.applications.map((app, i) => (
                  <span
                    key={i}
                    className="rounded bg-card/10 px-2 py-1 text-xs text-card/80"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrimmingGuide
