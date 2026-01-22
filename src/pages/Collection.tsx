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

      <main className="container mx-auto px-6 pb-12 pt-32">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            The Collection
          </p>
          <h1 className="mb-4 font-serif text-4xl text-foreground md:text-5xl">
            Premium Norwegian Salmon
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse our selection of premium-grade Atlantic salmon, sourced
            directly from Norwegian fjords and delivered with precision.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {product.weight_range}
                  </p>
                  {product.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between border-t border-border pt-2">
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
      </main>

      <Footer />
    </div>
  )
}

export default Collection
