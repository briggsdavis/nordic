import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const landscapes = [
  {
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80",
    caption: "Norwegian Fjords",
  },
  {
    image: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=800&q=80",
    caption: "Arctic Waters",
  },
];

const CatalogTeaser = () => {
  const { data: products, isLoading } = useProducts();
  const navigate = useNavigate();

  return (
    <section id="collection" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">
              The Collection
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Premium Selection
            </h2>
          </div>
          <Button variant="ghost" className="mt-6 md:mt-0 gap-2 group">
            <span className="text-sm tracking-wide uppercase">View Full Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-muted">
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.weight_range}</p>
                  </div>
                  <span className="text-xs text-primary font-medium tracking-wide">
                    ${product.price_per_kg}/kg
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Landscapes Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {landscapes.map((landscape, index) => (
            <div
              key={index}
              className="relative aspect-[21/9] rounded-lg overflow-hidden group"
            >
              <img
                src={landscape.image}
                alt={landscape.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <span className="absolute bottom-6 left-6 text-card text-sm tracking-[0.2em] uppercase">
                {landscape.caption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogTeaser;