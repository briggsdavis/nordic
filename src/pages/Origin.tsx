import originHero from "@/assets/origin.jpg"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Award, CheckCircle, Ship, Snowflake } from "lucide-react"
import { useEffect } from "react"

const Origin = () => {
  useEffect(() => {
    document.title = "Nordic Seafood | Origin Story"
    const description =
      "Discover Nordic Seafood's Norwegian sourcing standards, certified cold-chain logistics, and the story behind our Ethiopian supply."
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", description)
  }, [])

  const values = [
    {
      icon: Award,
      title: "Uncompromising Quality",
      description:
        "Every shipment meets strict Norwegian grading. We only source fish that pass texture, color, and fat-content benchmarks.",
    },
    {
      icon: Snowflake,
      title: "Pure Origins",
      description:
        "Raised in icy, protected fjords, our salmon develops a clean, rich flavor profile without environmental stress.",
    },
    {
      icon: Ship,
      title: "Consistent Supply",
      description:
        "Year-round partnerships keep supply steady, so restaurants and retailers can plan menus with confidence.",
    },
    {
      icon: CheckCircle,
      title: "Certified Excellence",
      description:
        "Full traceability and internationally recognized certificates travel with every order for total transparency.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main aria-label="Origin story">
        {/* Hero Section */}
        <section
          className="relative -mt-20 flex min-h-[70vh] items-end justify-center overflow-hidden pb-20"
          aria-labelledby="origin-hero-title"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={originHero}
              alt="Snow-lined Norwegian fjords where Nordic Seafood sources salmon"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-6 text-center lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-4 animate-fade-in-up text-xs uppercase tracking-[0.3em] text-card/80 opacity-0 md:text-sm"
                style={{ animationDelay: "0.2s" }}
              >
                Our Story
              </p>
              <h1
                id="origin-hero-title"
                className="mb-6 animate-fade-in-up font-serif text-4xl text-card opacity-0 md:text-5xl lg:text-6xl"
                style={{ animationDelay: "0.4s" }}
              >
                From Norwegian Fjords to Ethiopian Kitchens
              </h1>
              <p
                className="mx-auto max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-card/90 opacity-0"
                style={{ animationDelay: "0.6s" }}
              >
                Nordic Seafood bridges two worlds, moving pristine Norwegian
                salmon into Ethiopia with verified cold-chain handling and
                trusted local distribution.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20" aria-labelledby="origin-values">
          <div className="container mx-auto px-6">
            <h2
              id="origin-values"
              className="animate-fade-in mb-12 text-center font-serif text-3xl text-foreground opacity-0"
              style={{ animationDelay: "0.1s" }}
            >
              Our Core Values
            </h2>
            <div className="animate-fade-in mx-auto grid max-w-5xl gap-8 opacity-0 md:grid-cols-2" style={{ animationDelay: "0.3s" }}>
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
        <section className="bg-muted/30 py-20" aria-labelledby="origin-story">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <h2
                id="origin-story"
                className="animate-fade-in mb-8 text-center font-serif text-3xl text-foreground opacity-0"
                style={{ animationDelay: "0.1s" }}
              >
                Our Story
              </h2>
              <div className="animate-fade-in space-y-6 leading-relaxed text-muted-foreground opacity-0" style={{ animationDelay: "0.3s" }}>
                <p>
                  Nordic Seafood was founded to bridge a clear market gap:
                  Ethiopia's growing demand for premium seafood and the lack of
                  a reliable, quality-first supply chain.
                </p>
                <p>
                  Through direct partnerships with Norwegian producers and
                  controlled cold-chain logistics, we keep salmon fresh from
                  harvest to Addis Ababa, with temperature monitoring at every
                  stage.
                </p>
                <p>
                  Today, Nordic Seafood supports hotels, restaurants, retailers,
                  and home chefs who refuse to compromise on quality. Every
                  delivery carries our promise: authentic Norwegian salmon,
                  handled with care and delivered with integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Promise Section */}
        <section className="py-20" aria-labelledby="origin-promise">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                id="origin-promise"
                className="animate-fade-in mb-6 font-serif text-3xl text-foreground opacity-0"
                style={{ animationDelay: "0.1s" }}
              >
                The Nordic Promise
              </h2>
              <p className="animate-fade-in mb-8 text-lg text-muted-foreground opacity-0" style={{ animationDelay: "0.3s" }}>
                When you choose Nordic Seafood, you choose a partner committed
                to consistent supply, transparent sourcing, and dependable
                logistics.
              </p>
              <div className="animate-fade-in flex flex-wrap justify-center gap-4 text-sm text-foreground opacity-0" style={{ animationDelay: "0.5s" }}>
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
