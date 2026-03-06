import { useShipmentStages } from "@/hooks/useShipmentTracking"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Fragment } from "react"

interface ShipmentTimelineProps {
  orderId: string
  compact?: boolean
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const ShipmentTimeline = ({ orderId, compact = false }: ShipmentTimelineProps) => {
  const { data: stages, isLoading } = useShipmentStages(orderId)

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading stages...</div>
  if (!stages?.length)
    return <div className="text-sm text-muted-foreground">No tracking data available</div>

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start pb-2">
        {/* Payment Verified — synthetic first step, always completed (blue) */}
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
            <Check className="h-4 w-4" />
          </div>
          <div className="mt-2 w-24 text-center">
            <p className="text-xs font-medium leading-tight text-blue-600">Payment Verified</p>
          </div>
        </div>

        {stages.map((stage, index) => {
          const isCompleted = stage.status === "completed"
          const isInProgress = stage.status === "in_progress"
          const isPending = stage.status === "pending"

          // Line before this stage is active if the preceding step is completed.
          // Index 0 connects from Payment Verified, which is always completed.
          const lineIsActive = index === 0 ? true : stages[index - 1].status === "completed"

          return (
            <Fragment key={stage.id}>
              {/* Connecting line */}
              <div
                className={cn(
                  "mt-4 h-0.5 w-12 flex-shrink-0",
                  lineIsActive ? "bg-blue-500" : "bg-border",
                )}
              />

              {/* Stage node */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    isCompleted && "bg-blue-500 text-white",
                    isInProgress && "bg-orange-300 text-orange-900",
                    isPending && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stage.stage_number}
                </div>

                <div className="mt-2 w-24 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium leading-tight",
                      isCompleted && "text-blue-600",
                      isInProgress && "text-orange-600",
                      isPending && "text-muted-foreground",
                    )}
                  >
                    {stage.shipment_stage_definitions.stage_name}
                  </p>
                  {isCompleted && stage.completed_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(stage.completed_at)}
                    </p>
                  )}
                  {stage.admin_notes && !compact && (
                    <p className="mt-1 text-xs italic text-muted-foreground">{stage.admin_notes}</p>
                  )}
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
