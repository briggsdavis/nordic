import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/format"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Check, Minus, Package, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const variants = [
  { value: "100g", label: "100g", weight: 0.1, description: "Single serving" },
  { value: "200g", label: "200g", weight: 0.2, description: "Double serving" },
  { value: "300g", label: "300g", weight: 0.3, description: "Family size" },
]

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [selectedVariant, setSelectedVariant] = useState("100g")
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_available", true)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!slug,
  })

  const selectedVariantData = variants.find((v) => v.value === selectedVariant)
  const unitPrice = product
    ? product.price_per_kg * (selectedVariantData?.weight || 0.1)
    : 0
  const totalPrice = unitPrice * quantity

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/auth?returnTo=/products/${slug}`)
      return
    }

    addToCart.mutate({
      productId: product!.id,
      variant: selectedVariant,
      quantity,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="grid gap-12 md:grid-cols-2">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="py-12 text-center">
            <h1 className="mb-4 font-serif text-2xl">Product Not Found</h1>
            <Button onClick={() => navigate("/#collection")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collection
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 pb-32 pt-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8 gap-2"
          onClick={() => navigate("/collection")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="eager"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : null}
            {!product.image_url && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-muted-foreground">
                <Package className="h-16 w-16 opacity-50" />
                <p className="text-sm">Image not available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 font-serif text-3xl text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <p className="text-lg font-medium text-primary">
                {formatPrice(product.price_per_kg)}/kg
              </p>
              {product.weight_range && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.weight_range}
                </p>
              )}
            </div>

            {product.description && (
              <p className="leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Variant Selection - Card Style */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Size</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {variants.map((variant) => {
                  const isSelected = selectedVariant === variant.value
                  const price = product.price_per_kg * variant.weight
                  return (
                    <button
                      key={variant.value}
                      type="button"
                      onClick={() => setSelectedVariant(variant.value)}
                      className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-base font-medium">{variant.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {variant.description}
                      </div>
                      <div className="mt-2 text-sm font-medium text-primary">
                        {formatPrice(price)}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedVariant} × {quantity}
                </span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-lg font-medium">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full touch-manipulation"
              size="lg"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetail
