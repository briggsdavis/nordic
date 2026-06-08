import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  option_id: string | null
  variant: string
  quantity: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    price_per_unit: number
    image_url: string | null
  }
  option?: {
    id: string
    name: string
    price_per_unit: number | null
  } | null
}

export const useCart = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(id, name, price_per_unit, image_url),
          option:product_options(id, name, price_per_unit)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data as CartItem[]
    },
    enabled: !!user,
  })

  const addToCart = useMutation({
    mutationFn: async ({
      productId,
      variant,
      quantity = 1,
      optionId,
    }: {
      productId: string
      variant: string
      quantity?: number
      optionId?: string | null
    }) => {
      if (!user) throw new Error("Must be logged in")

      // Check if item already exists in cart
      let query = supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("variant", variant)

      if (optionId) {
        query = query.eq("option_id", optionId)
      } else {
        query = query.is("option_id", null)
      }

      const { data: existing, error: existingError } = await query.maybeSingle()

      if (existingError) throw existingError

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id)
        if (error) throw error
      } else {
        // Insert new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          variant,
          quantity,
          option_id: optionId || null,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
  })

  const updateQuantity = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string
      quantity: number
    }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", itemId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", itemId)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast({ title: "Removed from cart" })
    },
  })

  const clearCart = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in")
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const getVariantPrice = (
    variant: string,
    pricePerUnit: number,
    optionPricePerUnit?: number | null,
  ): number => {
    const multiplierMap: Record<string, number> = {
      "100g": 1,
      "200g": 2,
      "300g": 3,
    }
    const effectivePrice = optionPricePerUnit ?? pricePerUnit
    return effectivePrice * (multiplierMap[variant] || 1)
  }

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product
      ? getVariantPrice(
          item.variant,
          item.product.price_per_unit,
          item.option?.price_per_unit,
        )
      : 0
    return total + price * item.quantity
  }, 0)

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    getVariantPrice,
  }
}
