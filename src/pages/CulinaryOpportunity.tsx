import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChefHat, ShoppingBag, Users } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

const galleryImages = [
  { src: "/c1.jpg", alt: "Premium Norwegian salmon preparation" },
  { src: "/c4.jpg", alt: "Salmon dish with fine dining plating" },
  { src: "/c6.jpg", alt: "Artisan salmon creation with garnishes" },
  { src: "/c7.jpg", alt: "Salmon tartare with seasonal ingredients" },
  { src: "/c8.jpg", alt: "Grilled salmon with herbs and lemon" },
]

const CulinaryOpportunity = () => {
  useEffect(() => {
    document.title = "Nordic Seafood | For Chefs"
    const description =
      "Discover how premium Norwegian salmon can transform your menu, elevate your restaurant, and attract discerning customers."
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", description)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main aria-label="Culinary opportunity">
        {/* Hero Section */}
        <section
          className="relative -mt-28 flex min-h-[75vh] items-end justify-center overflow-hidden pb-20"
          aria-labelledby="culinary-hero-title"
        >
          <div className="absolute inset-0 z-0">
            <img
              src="/culinary.jpg"
              alt="Fine dining restaurant with salmon dishes"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-4 animate-fade-in-up text-xs uppercase tracking-[0.3em] text-card/80 opacity-0 md:text-sm"
                style={{ animationDelay: "0.2s" }}
              >
                For Chefs
              </p>
              <h1
                id="culinary-hero-title"
                className="mb-6 animate-fade-in-up font-serif text-4xl text-card opacity-0 md:text-5xl lg:text-6xl"
                style={{ animationDelay: "0.4s" }}
              >
                Elevate Your Offer with Norwegian Salmon
              </h1>
              <div
                className="flex animate-fade-in-up flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
                style={{ animationDelay: "0.6s" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-primary px-8 py-6 text-sm font-medium uppercase tracking-wide text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  <Link to="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Order Now
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full border-white/40 bg-transparent px-8 py-6 text-sm font-medium uppercase tracking-wide text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Link to="/contact">
                    <Users className="mr-2 h-4 w-4" />
                    B2B Inquiries
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 text-muted-foreground">
                <ChefHat className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">
                  For Chefs & Businesses
                </span>
              </div>
              <h2 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
                A Gateway to Culinary Excellence
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Salmon is more than an ingredient; it is a statement. For chefs,
                it opens a world of preparations from delicate sashimi to hearty
                grills. For businesses, it signals quality and sophistication
                that guests remember and return for. Our salmon is certified
                sushi grade and arrives vacuum packed, ensuring every piece
                meets the highest standards of freshness and food safety.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Hotels elevate their breakfast buffets, restaurants build
                signature dishes, and retailers attract a premium clientele.
                Norwegian Atlantic salmon is the ingredient that turns a good
                offer into an exceptional one.
              </p>
            </div>
          </div>
        </section>

        {/* Split-Screen Sticky Gallery Section */}
        <section className="bg-secondary">
          <div className="grid lg:grid-cols-2">
            {/* Left Sticky Panel */}
            <div className="flex items-center justify-center bg-foreground px-6 py-20 lg:sticky lg:top-0 lg:h-screen lg:py-0">
              <div className="max-w-md text-center">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-card/60">
                  Discover the Possibilities
                </p>
                <h2 className="mb-8 font-serif text-4xl leading-tight text-card md:text-5xl">
                  Salmon, an Endless World of Culinary Opportunity
                </h2>
                <div className="mx-auto h-px w-16 bg-primary" />
                <p className="mt-8 text-sm leading-relaxed text-card/70">
                  Scroll to explore the versatility of premium Norwegian salmon
                  from fine dining presentations to everyday elegance.
                </p>
              </div>
            </div>

            {/* Right Scrolling Images */}
            <div className="space-y-0">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative aspect-[4/3]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    loading={index > 1 ? "lazy" : undefined}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-6">
                    <p className="text-sm font-light text-card/90">
                      {image.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - For Chefs */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
                  For Chefs
                </p>
                <h2 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
                  Transform Your Menu
                </h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Premium salmon adapts to every cuisine and technique. Build
                  signature dishes that set your restaurant apart, from raw
                  preparations that showcase purity to slow-cooked creations
                  that highlight richness. Every piece is sushi grade, making it
                  perfect for sashimi, tartare, and other raw preparations
                  without compromise.
                </p>
                <p className="mb-8 leading-relaxed text-muted-foreground">
                  Delivered vacuum packed for maximum freshness, with consistent
                  supply and chef-ready portions, you can plan your menu with
                  confidence and deliver excellence every service.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 px-8 py-6 text-sm font-medium uppercase tracking-wide"
                >
                  <Link to="/products">
                    Order Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
                  alt="Chef preparing a salmon dish in professional kitchen"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - For Businesses */}
        <section className="bg-secondary py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl lg:order-first">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Upscale restaurant interior with elegant table settings"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
                  For Hotels, Restaurants & Retailers
                </p>
                <h2 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
                  Strengthen Your Business
                </h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Premium Norwegian salmon signals quality to your customers
                  before the first bite. Hotels attract international guests,
                  restaurants build reputation, and retailers create a
                  destination for discerning shoppers.
                </p>
                <p className="mb-8 leading-relaxed text-muted-foreground">
                  Our B2B partnership model provides reliable supply,
                  competitive pricing, and full certification: everything you
                  need to offer premium seafood with confidence.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 px-8 py-6 text-sm font-medium uppercase tracking-wide"
                >
                  <Link to="/contact">
                    Discuss a Partnership
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-foreground py-20 lg:py-28">
          <div className="container mx-auto px-6 text-center lg:px-8">
            <h2 className="mb-6 font-serif text-3xl text-card md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-card/80">
              Whether you want to order directly or explore a B2B partnership,
              we are here to help you bring Norwegian excellence to your table.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full gap-2 bg-primary px-8 py-6 text-sm font-medium uppercase tracking-wide text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                <Link to="/products">
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full gap-2 border-card/30 bg-transparent px-8 py-6 text-sm font-medium uppercase tracking-wide text-card hover:bg-card/10 hover:text-card sm:w-auto"
              >
                <Link to="/contact">
                  <Users className="h-4 w-4" />
                  B2B Inquiries
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CulinaryOpportunity
