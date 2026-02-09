import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/hooks/useProducts"
import { formatPrice } from "@/lib/format"
import { ArrowRight, Package } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CatalogTeaser = () => {
  const { data: products, isLoading } = useProducts()
  const navigate = useNavigate()

  // Show only first 3 products for teaser
  const teaserProducts = products?.slice(0, 3)

  return (
    <section id="collection" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="animate-fade-in mb-16 flex flex-col opacity-0 md:flex-row md:items-end md:justify-between" style={{ animationDelay: "0.1s" }}>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
              The Collection
            </p>
            <h2 className="font-serif text-4xl text-foreground md:text-5xl">
              Premium Selection
            </h2>
          </div>
          <Button
            variant="ghost"
            className="group mt-6 gap-2 md:mt-0"
            onClick={() => navigate("/collection")}
          >
            <span className="text-sm uppercase tracking-wide">
              View Full Catalog
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Products Grid */}
<<<<<<< HEAD
        <div className="animate-fade-in mb-16 grid gap-8 opacity-0 md:grid-cols-3" style={{ animationDelay: "0.3s" }}>
=======
        <div className="mb-16 grid gap-6 sm:gap-8 md:grid-cols-3">
>>>>>>> 8d2e06e (nordic stuff)
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </>
          ) : (
            teaserProducts?.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Package className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-lg text-foreground transition-colors group-hover:text-primary sm:text-xl">
                      {product.name}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {product.weight_range}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium tracking-wide text-primary sm:text-sm">
                    {formatPrice(product.price_per_kg)}/kg
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default CatalogTeaser
