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
import type { ProductOption } from "@/hooks/useProducts"
import { supabase } from "@/integrations/supabase/client"
import { formatPrice } from "@/lib/format"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Info, Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const variants = [
  { value: "100g", label: "100g", weight: 1 },
  { value: "200g", label: "200g", weight: 2 },
  { value: "300g", label: "300g", weight: 3 },
]

interface ProductWithOptions {
  id: string
  name: string
  slug: string
  description: string | null
  price_per_unit: number
  image_url: string | null
  is_available: boolean
  allow_size_selection: boolean
  product_options: ProductOption[]
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [selectedVariant, setSelectedVariant] = useState("100g")
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_options(*)")
        .eq("slug", slug)
        .eq("is_available", true)
        .single()

      if (error) throw error
      return data as ProductWithOptions
    },
    enabled: !!slug,
  })

  const availableOptions =
    product?.product_options?.filter((o) => o.is_available) || []
  const selectedOption =
    availableOptions.find((o) => o.id === selectedOptionId) || null
  const effectivePricePerUnit =
    selectedOption?.price_per_unit ?? product?.price_per_unit ?? 0

  const selectedVariantData = variants.find((v) => v.value === selectedVariant)
  const unitPrice = product?.allow_size_selection
    ? effectivePricePerUnit * (selectedVariantData?.weight || 0.1)
    : effectivePricePerUnit
  const totalPrice = unitPrice * quantity

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/auth?returnTo=/products/${slug}`)
      return
    }

    addToCart.mutate({
      productId: product!.id,
      variant: product!.allow_size_selection ? selectedVariant : "whole",
      quantity,
      optionId: selectedOptionId,
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
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Order
        </Button>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
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
                {formatPrice(effectivePricePerUnit)}
              </p>
            </div>

            {product.description && (
              <p className="leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Option Selection */}
            {availableOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Option</label>
                <Select
                  value={selectedOptionId || "__default__"}
                  onValueChange={(v) =>
                    setSelectedOptionId(v === "__default__" ? null : v)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__default__">
                      Standard - {formatPrice(product.price_per_unit)}
                    </SelectItem>
                    {availableOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} -{" "}
                        {formatPrice(
                          option.price_per_unit ?? product.price_per_unit,
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Variant Selection */}
            {product.allow_size_selection && (
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
                        {formatPrice(effectivePricePerUnit * variant.weight)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                  {product.allow_size_selection ? selectedVariant : "unit"} ×{" "}
                  {quantity}
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

            {/* Payment Notice */}
            <div className="flex gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <p>
                Orders are confirmed via bank transfer screenshot proof. At
                checkout you'll receive our bank details and the amount to send,
                then upload your proof of payment to complete your order.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetail
