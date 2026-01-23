import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useAdminShipmentStages,
  useShipmentStages,
} from "@/hooks/useShipmentTracking"
import { cn } from "@/lib/utils"

interface ShipmentStageManagerProps {
  orderId: string
}

export function ShipmentStageManager({
  orderId,
}: ShipmentStageManagerProps): JSX.Element {
  const { data: stages } = useShipmentStages(orderId)
  const { batchUpdateStages } = useAdminShipmentStages(orderId)

  function handleStageClick(clickedStageNumber: number): void {
    if (!stages) return

    // Batch all stage updates into a single mutation
    const updates = stages
      .map((stage) => ({
        stageId: stage.id,
        status: (stage.stage_number <= clickedStageNumber
          ? "completed"
          : "pending") as const,
      }))
      .filter((update, idx) => stages[idx].status !== update.status)

    if (updates.length > 0) {
      batchUpdateStages.mutate({ updates })
    }
  }

  const completedCount = stages?.filter((s) => s.status === "completed").length ?? 0
  const totalCount = stages?.length ?? 0

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="flex h-6 w-full overflow-hidden rounded-full border bg-muted">
          {stages?.map((stage) => (
            <Tooltip key={stage.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleStageClick(stage.stage_number)}
                  className={cn(
                    "flex flex-1 items-center justify-center border-r transition-none last:border-r-0 hover:opacity-80",
                    stage.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent className="border bg-popover text-popover-foreground shadow-md">
                <p className="text-sm font-medium">
                  {stage.shipment_stage_definitions.stage_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stage.shipment_stage_definitions.location}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="text-center text-sm text-muted-foreground">
        Stage {completedCount} of {totalCount} completed
      </div>
    </div>
  )
}
