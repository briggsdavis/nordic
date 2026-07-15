import { ArrowRight, ChefHat, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import chefBrochure from "@/assets/chef-brochure.pdf"
import { Button } from "@/components/ui/button"

const TrimmingGuide = () => {
  return (
    <section className="bg-secondary py-24 lg:py-32" aria-labelledby="trimming-guide-title">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className="mb-16 flex animate-fade-in flex-col opacity-0 lg:flex-row lg:items-center lg:justify-between"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="lg:max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              <span className="text-xs tracking-[0.3em] uppercase">For Professionals</span>
            </div>
            <h2
              id="trimming-guide-title"
              className="mb-6 font-serif text-4xl text-foreground md:text-5xl"
            >
              Trimming Guide
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Maximize yield and minimize waste with our professional breakdown guide. Each salmon
              delivers multiple menu-ready cuts.
            </p>
          </div>

          {/* Chef Brochure Link */}
          <div className="mt-8 lg:mt-0">
            <Button asChild variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
              <a
                href={chefBrochure}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open chef trimming brochure"
              >
                <FileText className="h-4 w-4" />
                View Chef Brochure
              </a>
            </Button>
          </div>
        </div>

        {/* Culinary Opportunity CTA */}
        <div
          className="mb-16 animate-fade-in rounded-2xl border border-border bg-card p-8 text-center opacity-0 lg:p-10"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="mb-3 font-serif text-2xl text-foreground">
            Norwegian Salmon for Your Menu
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Chefs and restaurants across Ethiopia are building menus around premium Norwegian
            salmon.
          </p>
          <Button
            asChild
            size="lg"
            className="gap-2 px-8 py-6 text-sm font-medium tracking-wide uppercase"
          >
            <Link to="/for-chefs">
              For Chefs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Salmon Diagram Placeholder */}
        <div
          className="relative mb-16 animate-fade-in overflow-hidden rounded-2xl border border-card/10 bg-card/5 opacity-0"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex aspect-[21/9] items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=80"
              alt="Chef trimming a salmon fillet for portioning"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/50 to-transparent" />
            <div className="absolute top-1/2 right-6 left-6 max-w-md -translate-y-1/2 md:right-auto md:left-8">
              <p className="mb-2 text-xs tracking-[0.2em] text-card/80 uppercase">
                Professional Breakdown
              </p>
              <h3 className="mb-3 font-serif text-3xl text-card">Every Cut Has Purpose</h3>
              <p className="text-sm text-card/90">
                From premium loin portions to rich belly strips, we help you utilize every section
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrimmingGuide
