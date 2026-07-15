import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export interface ProductOption {
  id: string
  product_id: string
  name: string
  price_per_unit: number | null
  is_available: boolean
  sort_order: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  specifications: string | null
  price_per_unit: number
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  product_options?: ProductOption[]
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      // Unavailable products are still shown to customers (with an
      // "Unavailable" badge); they just can't be ordered.
      const { data, error } = await supabase
        .from("products")
        .select("*, product_options(*)")
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      return data as Product[]
    },
  })
}
