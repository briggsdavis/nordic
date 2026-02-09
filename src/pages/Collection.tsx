import collectionHero from "@/assets/collection.jpg"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { type ProductFilters, type SortOption, useProducts } from "@/hooks/useProducts"
import { formatPrice } from "@/lib/format"
import { Package, Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Collection = () => {
  const navigate = useNavigate()
  // const [search, setSearch] = useState("")
  // const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  // const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  // const [sortBy, setSortBy] = useState<SortOption | undefined>(undefined)
  // const [showFilters, setShowFilters] = useState(false)

  // const filters: ProductFilters = {
  //   search,
  //   minPrice,
  //   maxPrice,
  //   sortBy,
  // }

  const { data: products, isLoading } = useProducts()

  // const handleClearFilters = () => {
  //   setSearch("")
  //   setMinPrice(undefined)
  //   setMaxPrice(undefined)
  //   setSortBy(undefined)
  // }

  // const hasActiveFilters = search || minPrice !== undefined || maxPrice !== undefined || sortBy

  // Calculate price range for filter inputs
  // const priceRange = allProducts?.reduce(
  //   (acc, p) => ({
  //     min: Math.min(acc.min, p.price_per_kg),
  //     max: Math.max(acc.max, p.price_per_kg),
  //   }),
  //   { min: Infinity, max: 0 }
  // )

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

<<<<<<< HEAD
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
=======
        {/* Filters & Search Section */}
        {/* <div className="container mx-auto px-6 py-8">
          <div className="mx-auto max-w-5xl space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {[search, minPrice, maxPrice, sortBy].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="animate-fade-in rounded-lg border border-border bg-card p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="gap-2 text-xs"
                    >
                      <X className="h-3 w-3" />
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Min Price</Label>
                    <Input
                      type="number"
                      placeholder={`${formatPrice(priceRange?.min ?? 0)}`}
                      value={minPrice ?? ""}
                      onChange={(e) =>
                        setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Price</Label>
                    <Input
                      type="number"
                      placeholder={`${formatPrice(priceRange?.max ?? 0)}`}
                      value={maxPrice ?? ""}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select
                      value={sortBy ?? ""}
                      onValueChange={(value) =>
                        setSortBy(value ? (value as SortOption) : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
>>>>>>> 8d2e06e (nordic stuff)
                  </div>
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "product" : "products"} found
                {hasActiveFilters && " (filtered)"}
              </div>
            )}
          </div>
        </div> */}

        {/* Products Section */}
        <div className="container mx-auto px-6 py-16">
          {isLoading ? (
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                  onClick={() => navigate(`/products/${product.slug}`)}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
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
                    ) : null}
                    {!product.image_url && (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Package className="h-12 w-12 opacity-50" />
                      </div>
                    )}
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
              <p className="mb-4 text-muted-foreground">
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
