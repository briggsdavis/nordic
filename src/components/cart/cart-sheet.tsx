import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

type CartSheetProps = {
  className?: string
  iconOnly?: boolean
}

export const CartSheet = ({ className, iconOnly = false }: CartSheetProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    getVariantPrice,
    hasUnavailableItems,
    isLoading,
  } = useCart()
  const [open, setOpen] = useState(false)

  const handleCheckout = () => {
    setOpen(false)
    navigate("/checkout")
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size={iconOnly ? "icon" : "default"}
        onClick={() => navigate("/auth")}
        className={cn("gap-2", className)}
        aria-label="Cart"
      >
        <ShoppingCart className="h-4 w-4" />
        {iconOnly ? <span className="sr-only">Cart</span> : "Cart"}
      </Button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size={iconOnly ? "icon" : "default"}
          className={cn("relative gap-2", className)}
          aria-label="Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {iconOnly ? <span className="sr-only">Cart</span> : "Cart"}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
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
              <Link to="/products" onClick={() => setOpen(false)}>
                Order Now
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {cartItems.map((item) => {
                const price = item.product
                  ? getVariantPrice(
                      item.variant,
                      item.product.price_per_unit,
                      item.option?.price_per_unit,
                    )
                  : 0

                return (
                  <div key={item.id} className="flex gap-4 rounded-2xl border p-4">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium">{item.product?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.option?.name ? `${item.option.name} - ` : ""}
                        {item.variant}
                      </p>
                      <p className="text-sm font-medium">{formatPrice(price)}</p>
                      {item.product?.is_available === false && (
                        <p className="text-xs font-medium text-red-600 dark:text-red-400">
                          No longer available — remove to checkout
                        </p>
                      )}
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
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
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
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={hasUnavailableItems}
              >
                Proceed to Checkout
              </Button>
              {hasUnavailableItems && (
                <p className="text-center text-xs text-red-600 dark:text-red-400">
                  Remove unavailable items to continue.
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
