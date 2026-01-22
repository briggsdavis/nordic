import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Award, CheckCircle, Ship, Snowflake } from "lucide-react"

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
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-primary/5 pb-20 pt-32">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-serif text-4xl text-foreground md:text-5xl">
                From Norwegian Fjords to Ethiopian Tables
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Nordic Seafood bridges two worlds—bringing the exceptional
                quality of Norwegian salmon to discerning buyers across
                Ethiopia. Our commitment to excellence defines every step of our
                journey.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 text-center font-serif text-3xl text-foreground">
              Our Core Values
            </h2>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-lg border border-border bg-card p-8"
                >
                  <value.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-3 font-serif text-xl text-foreground">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center font-serif text-3xl text-foreground">
                Our Story
              </h2>
              <div className="space-y-6 leading-relaxed text-muted-foreground">
                <p>
                  Nordic Seafood was founded with a singular vision: to bring
                  the world's finest salmon to East Africa. We recognized the
                  growing demand for premium seafood among Ethiopian hotels,
                  restaurants, and health-conscious consumers—and the gap in
                  reliable, quality-focused supply.
                </p>
                <p>
                  Through direct partnerships with Norwegian fishing communities
                  and state-of-the-art cold chain logistics, we've built an
                  import operation that prioritizes freshness above all else.
                  Our salmon travels from Norwegian waters to Addis Ababa in
                  carefully controlled conditions, arriving as fresh as the day
                  it was caught.
                </p>
                <p>
                  Today, Nordic Seafood is the trusted choice for businesses and
                  individuals who refuse to compromise on quality. Every
                  delivery carries our promise: authentic Norwegian salmon,
                  handled with care, delivered with integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Promise Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 font-serif text-3xl text-foreground">
                The Nordic Promise
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                When you choose Nordic Seafood, you're choosing more than
                product—you're choosing a partner committed to your success. We
                stand behind every shipment with our quality guarantee.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground">
                <span className="rounded-full bg-primary/10 px-4 py-2">
                  100% Norwegian Origin
                </span>
                <span className="rounded-full bg-primary/10 px-4 py-2">
                  Unbroken Cold Chain
                </span>
                <span className="rounded-full bg-primary/10 px-4 py-2">
                  Full Traceability
                </span>
                <span className="rounded-full bg-primary/10 px-4 py-2">
                  Quality Certified
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Origin
