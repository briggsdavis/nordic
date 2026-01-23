import { useShipmentStages } from "@/hooks/useShipmentTracking"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

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

export const ShipmentTimeline = ({
  orderId,
  compact = false,
}: ShipmentTimelineProps) => {
  const { data: stages, isLoading } = useShipmentStages(orderId)

  if (isLoading)
    return <div className="text-sm text-muted-foreground">Loading stages...</div>
  if (!stages?.length)
    return (
      <div className="text-sm text-muted-foreground">
        No tracking data available
      </div>
    )

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      {/* Stage items */}
      <div className="space-y-6">
        {stages.map((stage) => {
          const isCompleted = stage.status === "completed"
          const isInProgress = stage.status === "in_progress"
          const isPending = stage.status === "pending"

          return (
            <div key={stage.id} className="relative flex gap-4">
              {/* Icon circle */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  isCompleted && "bg-primary text-primary-foreground",
                  isInProgress && "bg-primary/50 text-primary-foreground",
                  isPending && "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stage.stage_number
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <h4
                  className={cn(
                    "font-medium",
                    isCompleted && "text-foreground",
                    !isCompleted && "text-muted-foreground",
                  )}
                >
                  {stage.shipment_stage_definitions.stage_name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {stage.shipment_stage_definitions.location}
                </p>
                {!compact && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stage.shipment_stage_definitions.description}
                  </p>
                )}
                {isCompleted && stage.completed_at && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Completed: {formatDate(stage.completed_at)}
                  </p>
                )}
                {stage.admin_notes && (
                  <p className="mt-2 text-sm italic">
                    Note: {stage.admin_notes}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
