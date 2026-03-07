import {
  useShipmentStageDefinitions,
  useShipmentStages,
} from "@/hooks/useShipmentTracking"
import { cn } from "@/lib/utils"
import { Check, Clock } from "lucide-react"
import { Fragment } from "react"

interface ShipmentTimelineProps {
  orderId: string
  orderStatus?: string
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
  orderStatus,
  compact = false,
}: ShipmentTimelineProps) => {
  const { data: stages, isLoading: stagesLoading } = useShipmentStages(orderId)
  const { data: definitions, isLoading: defsLoading } =
    useShipmentStageDefinitions()

  const isLoading = stagesLoading || defsLoading

  if (isLoading)
    return (
      <div className="text-sm text-muted-foreground">Loading stages...</div>
    )

  // For pending orders (payment not verified), show all stages gray using definitions
  const hasRealStages = !!stages?.length

  if (!hasRealStages && !definitions?.length)
    return (
      <div className="text-sm text-muted-foreground">
        No tracking data available
      </div>
    )

  // Payment is verified once order moves past the verifying/rejected states
  const paymentVerifiedActive =
    orderStatus !== "verifying" &&
    orderStatus !== "rejected" &&
    orderStatus !== undefined

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start pb-2">
        {/* Payment Verified — gray when order is still pending */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
              paymentVerifiedActive
                ? "bg-blue-500 text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            {paymentVerifiedActive ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div className="mt-2 w-24 text-center">
            <p
              className={cn(
                "text-xs font-medium leading-tight",
                paymentVerifiedActive
                  ? "text-blue-600"
                  : "text-muted-foreground",
              )}
            >
              Payment Verified
            </p>
          </div>
        </div>

        {hasRealStages
          ? stages!.map((stage, index) => {
              const isCompleted = stage.status === "completed"
              const isInProgress = stage.status === "in_progress"
              const isPending = stage.status === "pending"
              const lineIsActive =
                index === 0
                  ? paymentVerifiedActive
                  : stages![index - 1].status === "completed"

              return (
                <Fragment key={stage.id}>
                  <div
                    className={cn(
                      "mt-4 h-0.5 w-12 flex-shrink-0",
                      lineIsActive ? "bg-blue-500" : "bg-border",
                    )}
                  />
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        isCompleted && "bg-blue-500 text-white",
                        isInProgress && "bg-orange-300 text-orange-900",
                        isPending && "bg-muted text-muted-foreground",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        stage.stage_number
                      )}
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
                        <p className="mt-1 text-xs italic text-muted-foreground">
                          {stage.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Fragment>
              )
            })
          : definitions!.map((def) => (
              <Fragment key={def.id}>
                <div className="mt-4 h-0.5 w-12 flex-shrink-0 bg-border" />
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {def.stage_number}
                  </div>
                  <div className="mt-2 w-24 text-center">
                    <p className="text-xs font-medium leading-tight text-muted-foreground">
                      {def.stage_name}
                    </p>
                  </div>
                </div>
              </Fragment>
            ))}
      </div>
    </div>
  )
}
