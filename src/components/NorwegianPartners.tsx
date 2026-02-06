import { Button } from "@/components/ui/button"
import { Building2, ExternalLink } from "lucide-react"

const NorwegianPartners = () => {
  return (
    <section className="bg-background py-24 lg:py-32" aria-labelledby="norwegian-partners-title">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="animate-fade-in mb-16 text-center opacity-0" style={{ animationDelay: "0.1s" }}>
          <div className="mb-4 inline-flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Sourcing Partners</span>
          </div>
          <h2 id="norwegian-partners-title" className="mb-4 font-serif text-4xl text-foreground md:text-5xl">
            Trusted Norwegian Origins
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our partnerships with century-old Norwegian exporters guarantee the highest quality Atlantic salmon,
            backed by generations of expertise and tradition.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="space-y-12" aria-label="Norwegian partners">
          {/* Brødrene Remø - Text Left, Image Right */}
          <div className="animate-fade-in overflow-hidden rounded-2xl border border-border bg-card shadow-lg opacity-0 transition-all duration-300 hover:shadow-xl" style={{ animationDelay: "0.3s" }}>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Text Content - Left */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-4">
                  <h3 className="mb-1 font-serif text-2xl text-foreground md:text-3xl">
                    Brødrene Remø
                  </h3>
                  <p className="text-sm font-medium text-primary">Est. 1918</p>
                </div>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  With a heritage spanning over a century since 1918, Brødrene Remø has evolved from a coastal family shop on the Sunnmøre coast into a global leader in sustainable seafood. They combine time-honored seafaring wisdom with cutting-edge technology to produce world-recognized Atlantic salmon and traditional smoked delicacies. Our partnership brings over 100 years of passion and sustainable craftsmanship to you, guaranteeing a level of quality and authenticity that only a century of experience can provide.
                </p>
                <div>
                  <Button
                    asChild
                    variant="outline"
                    className="gap-2 font-medium"
                  >
                    <a
                      href="https://www.goldfish.no/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Brødrene Remø
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Image - Right */}
              <div className="relative h-64 lg:h-auto">
                <img
                  src="/remo.jpg"
                  alt="Brødrene Remø seafood processing facility in Norway"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Fishcorp of Norway - Image Left, Text Right */}
          <div className="animate-fade-in overflow-hidden rounded-2xl border border-border bg-card shadow-lg opacity-0 transition-all duration-300 hover:shadow-xl" style={{ animationDelay: "0.5s" }}>
            <div className="grid gap-8 lg:grid-cols-2 lg:grid-flow-dense">
              {/* Image - Left */}
              <div className="relative h-64 lg:h-auto">
                <img
                  src="/fishcorp.jpg"
                  alt="Fishcorp of Norway Atlantic salmon and stockfish"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>

              {/* Text Content - Right */}
              <div className="flex flex-col justify-center p-8 lg:col-start-2 lg:row-start-1 lg:p-12">
                <div className="mb-4">
                  <h3 className="mb-1 font-serif text-2xl text-foreground md:text-3xl">
                    Fishcorp of Norway
                  </h3>
                  <p className="text-sm font-medium text-primary">Since 9th Century Tradition</p>
                </div>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Drawing from over a millennium of tradition, Fishcorp of Norway is a premier exporter dedicated to sharing nutrient-rich, sustainable seafood with the world. Specializing in delicacies like authentic Arctic stockfish and premium Atlantic salmon, they utilize strict quality controls that honor 9th-century Viking innovations. By partnering with Fishcorp, we provide "Seafood for Healthy Generations," ensuring every product meets Norway's most rigorous food safety standards.
                </p>
                <div>
                  <Button
                    asChild
                    variant="outline"
                    className="gap-2 font-medium"
                  >
                    <a
                      href="https://www.fishcorp.no/#about_us"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Fishcorp
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

export default NorwegianPartners
