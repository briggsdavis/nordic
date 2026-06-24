import { cn } from "@/lib/utils"

type AvailabilityBadgeProps = {
  isAvailable: boolean
  className?: string
}

export const AvailabilityBadge = ({ isAvailable, className }: AvailabilityBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isAvailable
          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isAvailable ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400",
        )}
      />
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  )
}
