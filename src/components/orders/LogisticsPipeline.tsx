import { cn } from "@/lib/utils";
import { Warehouse, FileCheck, Plane, Ship, FileSearch, Truck, CheckCircle2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type LogisticsStage = Database["public"]["Enums"]["logistics_stage"];

const stages: { value: LogisticsStage; label: string; icon: React.ElementType }[] = [
  { value: "origin_warehouse", label: "Origin Warehouse", icon: Warehouse },
  { value: "customs_origin", label: "Origin Customs", icon: FileCheck },
  { value: "in_transit_air", label: "Air Transit", icon: Plane },
  { value: "in_transit_sea", label: "Sea Transit", icon: Ship },
  { value: "customs_destination", label: "Destination Customs", icon: FileSearch },
  { value: "local_delivery", label: "Local Delivery", icon: Truck },
  { value: "delivered", label: "Delivered", icon: CheckCircle2 },
];

interface LogisticsPipelineProps {
  currentStage: LogisticsStage | null;
  compact?: boolean;
}

export const LogisticsPipeline = ({ currentStage, compact = false }: LogisticsPipelineProps) => {
  const currentIndex = currentStage
    ? stages.findIndex((s) => s.value === currentStage)
    : -1;

  if (compact) {
    const current = stages.find((s) => s.value === currentStage);
    return (
      <div className="flex items-center gap-2 text-sm">
        {current && (
          <>
            <current.icon className="h-4 w-4 text-primary" />
            <span>{current.label}</span>
          </>
        )}
        {!current && <span className="text-muted-foreground">Not started</span>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm">Logistics Progress</h4>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted" />
        <div
          className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
          style={{
            height: currentIndex >= 0 ? `${(currentIndex / (stages.length - 1)) * 100}%` : "0%",
          }}
        />

        {/* Stages */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.value} className="flex items-center gap-3 relative">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "text-sm",
                    isCurrent && "font-medium text-primary",
                    !isCompleted && "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const logisticsStages = stages;
