import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/useCart"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const variants = [
  { value: "100g", label: "100g", weight: 0.1 },
  { value: "200g", label: "200g", weight: 0.2 },
  { value: "300g", label: "300g", weight: 0.3 },
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

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
            <Skeleton className="aspect-square rounded-lg" />
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

      <main className="container mx-auto px-6 pb-12 pt-28">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8 gap-2"
          onClick={() => navigate("/collection")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Button>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 font-serif text-4xl text-foreground">
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

            {/* Variant Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Size</label>
              <Select
                value={selectedVariant}
                onValueChange={setSelectedVariant}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((variant) => (
                    <SelectItem key={variant.value} value={variant.value}>
                      {variant.label} -{" "}
                      {formatPrice(product.price_per_kg * variant.weight)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedVariant} × {quantity}
                </span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
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
