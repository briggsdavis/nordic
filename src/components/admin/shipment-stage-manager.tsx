import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAdminShipmentStages, useShipmentStages } from "@/hooks/use-shipment-tracking"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ShipmentStageManagerProps {
  orderId: string
  onAllStagesComplete?: () => void
}

export function ShipmentStageManager({
  orderId,
  onAllStagesComplete,
}: ShipmentStageManagerProps): JSX.Element {
  const { data: stages } = useShipmentStages(orderId)
  const { batchUpdateStages } = useAdminShipmentStages(orderId)
  const [pendingStageNumber, setPendingStageNumber] = useState<number | null>(null)

  const savedCompletedCount = stages?.filter((s) => s.status === "completed").length ?? 0
  const displayCompletedCount = pendingStageNumber ?? savedCompletedCount
  const totalCount = stages?.length ?? 0
  const isDirty = pendingStageNumber !== null && pendingStageNumber !== savedCompletedCount

  function handleStageClick(clickedStageNumber: number): void {
    setPendingStageNumber(clickedStageNumber)
  }

  function handleSave(): void {
    if (!stages || pendingStageNumber === null) return

    const updates = stages
      .map((stage) => ({
        stageId: stage.id,
        status: (stage.stage_number <= pendingStageNumber ? "completed" : "pending") as const,
      }))
      .filter((update, idx) => stages[idx].status !== update.status)

    const allWillBeComplete = pendingStageNumber === stages.length

    batchUpdateStages.mutate(
      { updates },
      {
        onSuccess: () => {
          setPendingStageNumber(null)
          if (allWillBeComplete) onAllStagesComplete?.()
        },
      },
    )
  }

  function handleCancel(): void {
    setPendingStageNumber(null)
  }

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
                    stage.stage_number <= displayCompletedCount
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent className="border bg-popover text-popover-foreground shadow-md">
                <p className="text-sm font-medium">{stage.shipment_stage_definitions.stage_name}</p>
                <p className="text-xs text-muted-foreground">
                  {stage.shipment_stage_definitions.location}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Stage {displayCompletedCount} of {totalCount} completed
        </span>
        {isDirty && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={batchUpdateStages.isPending}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={batchUpdateStages.isPending}>
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
