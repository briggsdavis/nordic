import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  weight_range: string | null
  price_per_kg: number
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      return data as Product[]
    },
  })
}
