import heroBanner from "@/assets/hero-banner.jpg"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section
      className="relative -mt-20 flex min-h-screen items-end justify-center overflow-hidden pb-32"
      aria-labelledby="hero-title"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="Norwegian fjord with salmon farms at sunrise"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center lg:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Tagline */}
          <p
            className="mb-6 animate-fade-in-up text-xs uppercase tracking-[0.3em] text-card/80 opacity-0 md:text-sm"
            style={{ animationDelay: "0.2s" }}
          >
            Exclusively from the fjords
          </p>

          {/* Main Headline */}
          <h1
            id="hero-title"
            className="mb-6 animate-fade-in-up font-serif text-5xl text-card opacity-0 md:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.4s" }}
          >
            Arctic Purity,
            <br />
            <span className="font-normal italic">Addis Elegance.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto mb-10 max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-card/90 opacity-0 md:text-xl"
            style={{ animationDelay: "0.6s" }}
          >
            Premium Norwegian Atlantic salmon delivered directly to Ethiopia.
            Temperature-controlled, fully traceable, and chef-ready.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex animate-fade-in-up flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              asChild
              size="lg"
              className="w-full bg-primary px-8 py-6 text-sm font-medium uppercase tracking-wide text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <Link to="/collection">Explore Selection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-white/40 bg-transparent px-8 py-6 text-sm font-medium uppercase tracking-wide text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link to="/contact">B2B Inquiries</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 animate-fade-in flex-col items-center gap-2 opacity-0"
        style={{ animationDelay: "1.2s" }}
      >
        <span className="text-xs uppercase tracking-[0.2em] text-card/60">
          Scroll to discover
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce-subtle text-card/60" />
      </div>
    </section>
  )
}

export default Hero
