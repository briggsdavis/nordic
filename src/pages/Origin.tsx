import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Snowflake, Ship, CheckCircle } from "lucide-react";

const Origin = () => {
  const values = [
    {
      icon: Award,
      title: "Uncompromising Quality",
      description:
        "Every salmon we source meets the highest Norwegian standards. From fjord to fork, we ensure only the finest specimens reach your table.",
    },
    {
      icon: Snowflake,
      title: "Pure Origins",
      description:
        "Our salmon comes from the pristine, icy waters of Norway's protected fjords—where cold, clean currents produce fish of exceptional flavor and texture.",
    },
    {
      icon: Ship,
      title: "Consistent Supply",
      description:
        "We maintain reliable, year-round imports through established partnerships with Norway's most trusted producers, ensuring you never face shortages.",
    },
    {
      icon: CheckCircle,
      title: "Certified Excellence",
      description:
        "All our products arrive with complete traceability and internationally recognized quality certificates, giving you confidence in every order.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                From Norwegian Fjords to Ethiopian Tables
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nordic Seafood bridges two worlds—bringing the exceptional quality of 
                Norwegian salmon to discerning buyers across Ethiopia. Our commitment 
                to excellence defines every step of our journey.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-serif text-3xl text-foreground text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-8 rounded-lg border border-border bg-card"
                >
                  <value.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl text-foreground text-center mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Nordic Seafood was founded with a singular vision: to bring the world's 
                  finest salmon to East Africa. We recognized the growing demand for 
                  premium seafood among Ethiopian hotels, restaurants, and health-conscious 
                  consumers—and the gap in reliable, quality-focused supply.
                </p>
                <p>
                  Through direct partnerships with Norwegian fishing communities and 
                  state-of-the-art cold chain logistics, we've built an import operation 
                  that prioritizes freshness above all else. Our salmon travels from 
                  Norwegian waters to Addis Ababa in carefully controlled conditions, 
                  arriving as fresh as the day it was caught.
                </p>
                <p>
                  Today, Nordic Seafood is the trusted choice for businesses and 
                  individuals who refuse to compromise on quality. Every delivery carries 
                  our promise: authentic Norwegian salmon, handled with care, delivered 
                  with integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Promise Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl text-foreground mb-6">
                The Nordic Promise
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                When you choose Nordic Seafood, you're choosing more than product—you're 
                choosing a partner committed to your success. We stand behind every 
                shipment with our quality guarantee.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground">
                <span className="px-4 py-2 bg-primary/10 rounded-full">
                  100% Norwegian Origin
                </span>
                <span className="px-4 py-2 bg-primary/10 rounded-full">
                  Unbroken Cold Chain
                </span>
                <span className="px-4 py-2 bg-primary/10 rounded-full">
                  Full Traceability
                </span>
                <span className="px-4 py-2 bg-primary/10 rounded-full">
                  Quality Certified
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Origin;
