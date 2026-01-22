import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-end justify-center overflow-hidden pb-32 -mt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="Norwegian fjord with pristine waters"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p 
            className="text-card/80 text-xs md:text-sm tracking-[0.3em] uppercase mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Exclusively from the fjords
          </p>

          {/* Main Headline */}
          <h1 
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-card mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Arctic Purity,
            <br />
            <span className="italic font-normal">Addis Elegance.</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-card/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            Premium Norwegian Atlantic Salmon delivered directly to Ethiopia. 
            Unbroken cold chain from fjord to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-sm tracking-wide uppercase font-medium"
            >
              <Link to="/collection">Explore Selection</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 py-6 text-sm tracking-wide uppercase font-medium"
            >
              <Link to="/contact">B2B Inquiries</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
        style={{ animationDelay: "1.2s" }}
      >
        <span className="text-card/60 text-xs tracking-[0.2em] uppercase">Scroll to discover</span>
        <ChevronDown className="w-5 h-5 text-card/60 animate-bounce-subtle" />
      </div>
    </section>
  );
};

export default Hero;