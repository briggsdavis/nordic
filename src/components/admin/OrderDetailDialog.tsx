import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAdminOrders, OrderWithProfile } from "@/hooks/useAdminOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { openStorageFile } from "@/lib/storage";
import { formatPrice, formatDateLong, formatFileSizeError, MAX_FILE_SIZE } from "@/lib/format";
import { ExternalLink, Upload, FileText, CheckCircle2, XCircle, MapPin, Phone, User, Calendar, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = Database["public"]["Enums"]["order_status"];

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
  const { updateOrderStatus, approvePayment, rejectPayment, uploadCertificate, completeOrder } = useAdminOrders();
  const { toast } = useToast();
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState("");
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const handleViewFile = async (filePathOrUrl: string, fileId: string) => {
    setLoadingFile(fileId);
    try {
      await openStorageFile("order-files", filePathOrUrl);
    } finally {
      setLoadingFile(null);
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus.mutate({ orderId: order.id, status });
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
                  <span>Expected: {formatDateLong(order.expected_delivery_date)}</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewFile(order.payment_receipt_url!, "receipt")}
                  disabled={loadingFile === "receipt"}
                >
                  {loadingFile === "receipt" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  View Payment Receipt
                </Button>
                {order.status === "verifying" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleApprovePayment}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
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
          <div>
            <h3 className="font-medium mb-3">Order Status</h3>
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verifying">Verifying</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Certificate Upload */}
          <div>
            <h3 className="font-medium mb-3">Certificates</h3>
            
            {/* Existing Certificates */}
            {order.order_certificates.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {order.order_certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => handleViewFile(cert.file_url, cert.id)}
                    disabled={loadingFile === cert.id}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    {loadingFile === cert.id ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                    <p className="text-sm font-medium truncate">{cert.certificate_type}</p>
                  </button>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > MAX_FILE_SIZE) {
                        toast({
                          variant: "destructive",
                          title: "File too large",
                          description: formatFileSizeError(file.size),
                        });
                        e.target.value = "";
                        return;
                      }
                      setCertificateFile(file);
                    } else {
                      setCertificateFile(null);
                    }
                  }}
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
