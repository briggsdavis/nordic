import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  awaiting_payment: { label: "Awaiting Payment", variant: "outline" },
  payment_review: { label: "Payment Under Review", variant: "secondary" },
  payment_rejected: { label: "Payment Rejected", variant: "destructive" },
  pending: { label: "Pending", variant: "secondary" },
  payment_verified: { label: "Payment Verified", variant: "default" },
  processing: { label: "Order Confirmed", variant: "default" },
  in_transit: { label: "Shipping", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  completed: { label: "Complete", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = statusConfig[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
