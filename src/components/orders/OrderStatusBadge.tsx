import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  verifying: { label: "Verifying", variant: "secondary" },
  rejected: { label: "Rejected", variant: "destructive" },
  confirmed: { label: "Confirmed", variant: "default" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  completed: { label: "Complete", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = statusConfig[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
