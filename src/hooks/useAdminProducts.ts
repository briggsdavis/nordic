import { supabase } from "@/integrations/supabase/client"
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type Product = Tables<"products">
type ProductInsert = TablesInsert<"products">
type ProductUpdate = TablesUpdate<"products">

export function useAdminProducts() {
  const queryClient = useQueryClient()

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Product[]
    },
  })

  const createProduct = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: ProductUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const toggleAvailability = useMutation({
    mutationFn: async ({
      id,
      is_available,
    }: {
      id: string
      is_available: boolean
    }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ is_available })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleAvailability,
  }
}
