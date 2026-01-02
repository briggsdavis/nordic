import { ChefHat, Ruler, Scale, Utensils } from "lucide-react";

const cuts = [
  {
    name: "Loin",
    description: "Prime center cut, uniform thickness for even cooking. Ideal for high-end presentations.",
    yield: "25-30%",
    applications: ["Fine Dining", "Sashimi", "Grilling"],
  },
  {
    name: "Belly",
    description: "Rich, fatty section prized for its intense flavor. Perfect for curing or grilling.",
    yield: "15-20%",
    applications: ["Gravlax", "Smoking", "Tataki"],
  },
  {
    name: "Tail",
    description: "Leaner cut with firm texture. Excellent for portion control and consistent plating.",
    yield: "10-15%",
    applications: ["Portions", "Kebabs", "Staff Meals"],
  },
  {
    name: "Collar",
    description: "Chef's favorite cut with rich marbling. Often reserved for in-house specialties.",
    yield: "5-8%",
    applications: ["Grilled", "Braised", "Chef's Table"],
  },
];

const TrimmingGuide = () => {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-card">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16">
          <div className="lg:max-w-xl">
            <div className="inline-flex items-center gap-2 text-card/60 mb-4">
              <ChefHat className="w-4 h-4" />
              <span className="text-xs tracking-[0.3em] uppercase">For Professionals</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-card mb-6">
              Trimming Guide
            </h2>
            <p className="text-card/70 text-lg leading-relaxed">
              Maximize yield and minimize waste with our professional breakdown guide. 
              Each salmon is an opportunity for multiple revenue streams.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8 mt-8 lg:mt-0">
            <div className="text-center">
              <Scale className="w-6 h-6 text-card/60 mx-auto mb-2" />
              <p className="font-serif text-2xl text-card">85%</p>
              <p className="text-xs text-card/60 uppercase tracking-wide">Usable Yield</p>
            </div>
            <div className="text-center">
              <Ruler className="w-6 h-6 text-card/60 mx-auto mb-2" />
              <p className="font-serif text-2xl text-card">4-6 kg</p>
              <p className="text-xs text-card/60 uppercase tracking-wide">Avg. Weight</p>
            </div>
            <div className="text-center">
              <Utensils className="w-6 h-6 text-card/60 mx-auto mb-2" />
              <p className="font-serif text-2xl text-card">8+</p>
              <p className="text-xs text-card/60 uppercase tracking-wide">Cut Types</p>
            </div>
          </div>
        </div>

        {/* Salmon Diagram Placeholder */}
        <div className="relative mb-16 rounded-lg overflow-hidden bg-card/5 border border-card/10">
          <div className="aspect-[21/9] flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=80"
              alt="Salmon preparation"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/50 to-transparent" />
            <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-md">
              <p className="text-xs text-card/60 uppercase tracking-[0.2em] mb-2">
                Professional Breakdown
              </p>
              <h3 className="font-serif text-3xl text-card mb-3">
                Every Cut Has Purpose
              </h3>
              <p className="text-card/70 text-sm">
                From premium loin portions to rich belly strips, we help you utilize every section efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Cuts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cuts.map((cut, index) => (
            <div
              key={index}
              className="bg-card/5 border border-card/10 rounded-lg p-6 hover:bg-card/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-serif text-xl text-card">{cut.name}</h3>
                <span className="text-primary text-sm font-medium">{cut.yield}</span>
              </div>
              <p className="text-card/60 text-sm mb-4 leading-relaxed">{cut.description}</p>
              <div className="flex flex-wrap gap-2">
                {cut.applications.map((app, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-card/10 text-card/80"
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
  );
};

export default TrimmingGuide;