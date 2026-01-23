import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type ShipmentStageStatus =
  Database["public"]["Enums"]["shipment_stage_status"]

export interface ShipmentStage {
  id: string
  order_id: string
  stage_number: number
  status: ShipmentStageStatus
  started_at: string | null
  completed_at: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  updated_by: string | null
  shipment_stage_definitions: {
    stage_name: string
    description: string
    location: string
    stage_number: number
  }
}

// Customer/admin read-only hook
export const useShipmentStages = (orderId: string | undefined) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["shipment-stages", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipment_stages")
        .select(
          `
          *,
          shipment_stage_definitions(*)
        `,
        )
        .eq("order_id", orderId!)
        .order("stage_number")

      if (error) throw error
      return data as ShipmentStage[]
    },
    enabled: !!orderId,
  })

  // Realtime subscription disabled for instant updates
  // useEffect(() => {
  //   if (!orderId) return

  //   const channel = supabase
  //     .channel("shipment-stages")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "shipment_stages" },
  //       () => {
  //         queryClient.invalidateQueries({ queryKey: ["shipment-stages"] })
  //       },
  //     )
  //     .subscribe()

  //   return () => {
  //     supabase.removeChannel(channel)
  //   }
  // }, [queryClient, orderId])

  return query
}

// Admin mutations for stage updates
export const useAdminShipmentStages = (orderId?: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const batchUpdateStages = useMutation({
    mutationFn: async ({
      updates,
    }: {
      updates: Array<{ stageId: string; status: ShipmentStageStatus }>
    }) => {
      // Update all stages in parallel
      await Promise.all(
        updates.map(({ stageId, status }) => {
          const updateData: Database["public"]["Tables"]["shipment_stages"]["Update"] =
            { status }

          if (status === "completed") {
            updateData.completed_at = new Date().toISOString()
          } else if (status === "pending") {
            updateData.completed_at = null
            updateData.started_at = null
          }

          return supabase
            .from("shipment_stages")
            .update(updateData)
            .eq("id", stageId)
        }),
      )
    },
    onMutate: async ({ updates }) => {
      if (!orderId) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["shipment-stages", orderId] })

      // Snapshot previous value
      const previousStages = queryClient.getQueryData<ShipmentStage[]>([
        "shipment-stages",
        orderId,
      ])

      // Single optimistic update for all stages
      queryClient.setQueryData<ShipmentStage[]>(
        ["shipment-stages", orderId],
        (old) =>
          old?.map((stage) => {
            const update = updates.find((u) => u.stageId === stage.id)
            return update ? { ...stage, status: update.status } : stage
          }),
      )

      return { previousStages }
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (orderId && context?.previousStages) {
        queryClient.setQueryData(
          ["shipment-stages", orderId],
          context.previousStages,
        )
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
    onSettled: () => {
      // Single refetch to ensure sync with server
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ["shipment-stages", orderId] })
      }
    },
  })

  return { batchUpdateStages }
}
