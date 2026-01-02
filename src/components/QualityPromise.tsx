import { useEffect, useRef, useState } from "react";
import { Waves, Search, Award, Snowflake, Plane, FileCheck, Truck } from "lucide-react";

const steps = [
  {
    icon: Waves,
    title: "Fjord Harvest",
    description: "Sustainably sourced from pristine Norwegian waters at optimal maturity.",
    location: "Norway",
  },
  {
    icon: Search,
    title: "Quality Inspection",
    description: "Rigorous testing for color, texture, and freshness standards.",
    location: "Processing Facility",
  },
  {
    icon: Award,
    title: "Certified Processing",
    description: "EU-certified facilities ensuring international food safety compliance.",
    location: "Bergen, Norway",
  },
  {
    icon: Snowflake,
    title: "Cold Chain Packaging",
    description: "Advanced insulated packaging maintaining -18°C to 4°C range.",
    location: "Export Hub",
  },
  {
    icon: Plane,
    title: "Air Transport",
    description: "Direct cargo flights minimizing transit time and temperature exposure.",
    location: "In Transit",
  },
  {
    icon: FileCheck,
    title: "Customs Clearance",
    description: "Pre-arranged documentation for seamless Ethiopian import.",
    location: "Bole Airport",
  },
  {
    icon: Truck,
    title: "Doorstep Delivery",
    description: "Refrigerated last-mile delivery to your location in Addis Ababa.",
    location: "Ethiopia",
  },
];

const QualityPromise = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute("data-step") || "0");
            setVisibleSteps((prev) => [...new Set([...prev, stepIndex])]);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-50px" }
    );

    const stepElements = document.querySelectorAll("[data-step]");
    stepElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="origin" ref={sectionRef} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">
            Transparency at Every Step
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Our Quality Promise
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Seven documented steps from Norwegian fjords to Ethiopian tables. 
            Each shipment is tracked, verified, and certified.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const isVisible = visibleSteps.includes(index);
              const isEven = index % 2 === 0;
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  data-step={index}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  } transition-all duration-700`}
                  style={{
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative z-10">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className={`hidden md:flex w-full items-center ${isEven ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`w-1/2 ${isEven ? "pr-12 text-right" : "pl-12 text-left"}`}>
                      <span className="text-xs text-muted-foreground tracking-wide uppercase block mb-2">
                        {step.location}
                      </span>
                      <h3 className="font-serif text-2xl text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    {/* Icon */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary flex items-center justify-center z-10 shadow-lg">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>

                    {/* Spacer */}
                    <div className="w-1/2" />
                  </div>

                  {/* Mobile Content */}
                  <div className="md:hidden flex-1">
                    <span className="text-xs text-muted-foreground tracking-wide uppercase block mb-1">
                      {step.location}
                    </span>
                    <h3 className="font-serif text-xl text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityPromise;