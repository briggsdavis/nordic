import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AvailabilityBadge } from "@/components/products/availability-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/hooks/use-products"
import { formatPrice } from "@/lib/format"

const CatalogTeaser = () => {
  const { data: products, isLoading } = useProducts()
  const navigate = useNavigate()

  return (
    <section id="collection" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className="mb-16 flex animate-fade-in flex-col opacity-0 md:flex-row md:items-end md:justify-between"
          style={{ animationDelay: "0.1s" }}
        >
          <div>
            <p className="mb-4 text-xs tracking-[0.3em] text-primary uppercase">Order</p>
            <h2 className="font-serif text-4xl text-foreground md:text-5xl">Premium Selection</h2>
          </div>
          <Button
            variant="ghost"
            className="group mt-6 gap-2 md:mt-0"
            onClick={() => navigate("/products")}
          >
            <span className="text-sm tracking-wide uppercase">Order Now</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Products Grid */}
        <div
          className="mb-16 grid animate-fade-in gap-8 opacity-0 md:grid-cols-3"
          style={{ animationDelay: "0.3s" }}
        >
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
            products?.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                    <AvailabilityBadge isAvailable={product.is_available} />
                  </div>
                  <span className="text-xs font-medium tracking-wide text-primary">
                    {formatPrice(product.price_per_unit)}
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
