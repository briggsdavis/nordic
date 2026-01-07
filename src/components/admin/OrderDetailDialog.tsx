import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAdminOrders, OrderWithProfile } from "@/hooks/useAdminOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { LogisticsPipeline, logisticsStages } from "@/components/orders/LogisticsPipeline";
import { ExternalLink, Upload, FileText, CheckCircle2, XCircle, MapPin, Phone, User, Calendar } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type LogisticsStage = Database["public"]["Enums"]["logistics_stage"];

interface OrderDetailDialogProps {
  order: OrderWithProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const certificateTypes = [
  "Health Certificate",
  "Origin Certificate",
  "Quality Certificate",
  "Customs Declaration",
];

export const OrderDetailDialog = ({ order, open, onOpenChange }: OrderDetailDialogProps) => {
  const { updateOrderStatus, approvePayment, rejectPayment, updateLogisticsStage, uploadCertificate, completeOrder } = useAdminOrders();
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus.mutate({ orderId: order.id, status });
  };

  const handleLogisticsChange = (stage: LogisticsStage) => {
    updateLogisticsStage.mutate({ orderId: order.id, stage });
  };

  const handleCertificateUpload = async () => {
    if (!certificateFile || !certificateType) return;

    await uploadCertificate.mutateAsync({
      orderId: order.id,
      file: certificateFile,
      certificateType,
    });

    setCertificateFile(null);
    setCertificateType("");
  };

  const handleApprovePayment = () => {
    approvePayment.mutate(order.id);
  };

  const handleRejectPayment = () => {
    rejectPayment.mutate(order.id);
  };

  const handleMarkComplete = () => {
    completeOrder.mutate(order.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order {order.reference_number}
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-medium mb-3">Customer Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{order.profile?.full_name || order.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.contact_phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{order.delivery_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Expected: {formatDate(order.expected_delivery_date)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b">
                  <span>
                    {item.product_name} ({item.variant}) × {item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(Number(item.subtotal))}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-2">
                <span>Total</span>
                <span>{formatPrice(Number(order.total_amount))}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Section - show approve/reject only for payment_review status */}
          <div>
            <h3 className="font-medium mb-3">Payment</h3>
            {order.payment_receipt_url ? (
              <div className="space-y-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={order.payment_receipt_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Payment Receipt
                  </a>
                </Button>
                {order.status === "payment_review" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleApprovePayment}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleRejectPayment}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payment receipt uploaded</p>
            )}
          </div>

          <Separator />

          {/* Status Management */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Order Status</h3>
              <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                  <SelectItem value="payment_review">Payment Under Review</SelectItem>
                  <SelectItem value="payment_rejected">Payment Rejected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(order.status === "in_transit" || order.status === "processing") && (
              <div>
                <h3 className="font-medium mb-3">Logistics Stage</h3>
                <Select
                  value={order.logistics_stage || ""}
                  onValueChange={(v) => handleLogisticsChange(v as LogisticsStage)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {logisticsStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Logistics Pipeline */}
          {order.logistics_stage && (
            <>
              <Separator />
              <LogisticsPipeline currentStage={order.logistics_stage} />
            </>
          )}

          <Separator />

          {/* Certificate Upload */}
          <div>
            <h3 className="font-medium mb-3">Certificates</h3>
            
            {/* Existing Certificates */}
            {order.order_certificates.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {order.order_certificates.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium truncate">{cert.certificate_type}</p>
                  </a>
                ))}
              </div>
            )}

            {/* Upload New Certificate */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Select value={certificateType} onValueChange={setCertificateType}>
                <SelectTrigger>
                  <SelectValue placeholder="Certificate Type" />
                </SelectTrigger>
                <SelectContent>
                  {certificateTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                />
                <Button
                  onClick={handleCertificateUpload}
                  disabled={!certificateFile || !certificateType || uploadCertificate.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Complete Order Button */}
          {order.status === "delivered" && (
            <>
              <Separator />
              <Button className="w-full" onClick={handleMarkComplete}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Order as Complete
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
