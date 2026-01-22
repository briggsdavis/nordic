import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/hooks/useProducts"
import { formatPrice } from "@/lib/format"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CatalogTeaser = () => {
  const { data: products, isLoading } = useProducts()
  const navigate = useNavigate()

  return (
    <section id="collection" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between">
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
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
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
                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.weight_range}
                    </p>
                  </div>
                  <span className="text-xs font-medium tracking-wide text-primary">
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
