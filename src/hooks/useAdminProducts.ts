import { supabase } from "@/integrations/supabase/client"
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type Product = Tables<"products">
type ProductInsert = TablesInsert<"products">
type ProductUpdate = TablesUpdate<"products">
type ProductOption = Tables<"product_options">
type ProductOptionInsert = TablesInsert<"product_options">
type ProductOptionUpdate = TablesUpdate<"product_options">

export interface ProductWithOptions extends Product {
  product_options: ProductOption[]
}

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
        .select("*, product_options(*)")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as ProductWithOptions[]
    },
  })

  const createProduct = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase.from("products").insert(product).select().single()

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
    mutationFn: async ({ id, is_available }: { id: string; is_available: boolean }) => {
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

  const createOption = useMutation({
    mutationFn: async (option: ProductOptionInsert) => {
      const { data, error } = await supabase
        .from("product_options")
        .insert(option)
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

  const updateOption = useMutation({
    mutationFn: async ({ id, ...updates }: ProductOptionUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("product_options")
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

  const deleteOption = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_options").delete().eq("id", id)
      if (error) throw error
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
    createOption,
    updateOption,
    deleteOption,
  }
}
