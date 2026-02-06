import collectionHero from "@/assets/collection.jpg"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/hooks/useProducts"
import { formatPrice } from "@/lib/format"
import { Package } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Collection = () => {
  const { data: products, isLoading } = useProducts()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative -mt-20 flex min-h-[70vh] items-end justify-center overflow-hidden pb-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={collectionHero}
              alt="Premium Norwegian salmon collection"
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
                The Collection
              </p>
              <h1
                className="mb-6 animate-fade-in-up font-serif text-4xl text-card opacity-0 md:text-5xl lg:text-6xl"
                style={{ animationDelay: "0.4s" }}
              >
                Premium Norwegian Salmon
              </h1>
              <p
                className="mx-auto max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-card/90 opacity-0"
                style={{ animationDelay: "0.6s" }}
              >
                Browse our selection of premium-grade Atlantic salmon, sourced
                directly from Norwegian fjords and delivered with precision.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <div className="container mx-auto px-6 pb-24 pt-20">

          {isLoading ? (
          <div className="animate-fade-in mx-auto grid max-w-5xl gap-8 opacity-0 md:grid-cols-2 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="aspect-[16/15] rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="animate-fade-in mx-auto grid max-w-5xl gap-8 opacity-0 md:grid-cols-2 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className="aspect-[16/15] overflow-hidden bg-muted">
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-4 font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  <p className="mb-5 text-sm text-muted-foreground">
                    {product.weight_range}
                  </p>
                  {product.description && (
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between border-t border-border pt-5">
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(product.price_per_kg)}/kg
                    </span>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
            <h3 className="mb-2 font-serif text-2xl text-foreground">
              No Products Available
            </h3>
            <p className="text-muted-foreground">
              Check back soon for our premium salmon selection.
            </p>
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Collection
