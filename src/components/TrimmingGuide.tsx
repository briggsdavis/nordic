import chefBrochure from "@/assets/chef-brochure.pdf"
import { Button } from "@/components/ui/button"
import { ChefHat, FileText } from "lucide-react"

const TrimmingGuide = () => {
  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.3em]">
                For Professionals
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl">
              Trimming Guide
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Maximize yield and minimize waste with our professional breakdown
              guide. Each salmon is an opportunity for multiple revenue streams.
            </p>
          </div>

          {/* Chef Brochure Link */}
          <div className="mt-8 lg:mt-0">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <a
                href={chefBrochure}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4" />
                View Chef Brochure
              </a>
            </Button>
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
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-card/80">
                Professional Breakdown
              </p>
              <h3 className="mb-3 font-serif text-3xl text-card">
                Every Cut Has Purpose
              </h3>
              <p className="text-sm text-card/90">
                From premium loin portions to rich belly strips, we help you
                utilize every section efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrimmingGuide
