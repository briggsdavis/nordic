import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/useCart"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const CartSheet = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    getVariantPrice,
    isLoading,
  } = useCart()
  const [open, setOpen] = useState(false)

  const handleCheckout = () => {
    setOpen(false)
    navigate("/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => navigate("/auth")}
        className="gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Cart
      </Button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <ShoppingCart className="h-4 w-4" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartCount} items)</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/collection" onClick={() => setOpen(false)}>
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {cartItems.map((item) => {
                const price = item.product
                  ? getVariantPrice(item.variant, item.product.price_per_kg)
                  : 0

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border p-4"
                  >
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.variant}
                      </p>
                      <p className="text-sm font-medium">
                        {formatPrice(price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFromCart.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity.mutate({
                              itemId: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity.mutate({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between text-lg font-medium">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
