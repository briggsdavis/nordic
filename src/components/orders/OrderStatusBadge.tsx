import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  payment_verified: { label: "Payment Verified", variant: "default" },
  processing: { label: "Processing", variant: "default" },
  in_transit: { label: "In Transit", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Awaiting Payment", variant: "outline" },
  uploaded: { label: "Pending Review", variant: "secondary" },
  verified: { label: "Verified", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = paymentStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
