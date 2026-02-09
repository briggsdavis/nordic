import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

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

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest"

export interface ProductFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: SortOption
}

export const useProducts = (filters?: ProductFilters) => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      return data as Product[]
    },
  })

  const filteredProducts = useMemo(() => {
    if (!query.data) return []

    let result = [...query.data]

    // Search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.weight_range?.toLowerCase().includes(searchLower)
      )
    }

    // Price range filter
    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price_per_kg >= filters.minPrice!)
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price_per_kg <= filters.maxPrice!)
    }

    // Sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price_per_kg - b.price_per_kg)
          break
        case "price-desc":
          result.sort((a, b) => b.price_per_kg - a.price_per_kg)
          break
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name))
          break
        case "newest":
          result.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          break
      }
    }

    return result
  }, [query.data, filters])

  return {
    ...query,
    data: filteredProducts,
    allProducts: query.data,
  }
}
