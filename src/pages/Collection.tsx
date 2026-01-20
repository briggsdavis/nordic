import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package } from "lucide-react";

const Collection = () => {
  const { data: products, isLoading } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">
            The Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Premium Norwegian Salmon
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our selection of premium-grade Atlantic salmon, sourced directly from Norwegian fjords and delivered with precision.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
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
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.weight_range}
                  </p>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm font-medium text-primary">
                      ${product.price_per_kg}/kg
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-2xl text-foreground mb-2">
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
  );
};

export default Collection;
