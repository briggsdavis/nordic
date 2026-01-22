import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { OrderWithProfile, useAdminOrders } from "@/hooks/useAdminOrders"
import type { Database } from "@/integrations/supabase/types"
import {
  formatDateLong,
  formatFileSizeError,
  formatPrice,
  MAX_FILE_SIZE,
} from "@/lib/format"
import { openStorageFile } from "@/lib/storage"
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Upload,
  User,
  XCircle,
} from "lucide-react"
import { useState } from "react"

type OrderStatus = Database["public"]["Enums"]["order_status"]

interface OrderDetailDialogProps {
  order: OrderWithProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

const certificateTypes = [
  "Health Certificate",
  "Origin Certificate",
  "Quality Certificate",
  "Customs Declaration",
]

export const OrderDetailDialog = ({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) => {
  const {
    updateOrderStatus,
    approvePayment,
    rejectPayment,
    uploadCertificate,
    completeOrder,
  } = useAdminOrders()
  const { toast } = useToast()
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [certificateType, setCertificateType] = useState("")
  const [loadingFile, setLoadingFile] = useState<string | null>(null)

  const handleViewFile = async (filePathOrUrl: string, fileId: string) => {
    setLoadingFile(fileId)
    try {
      await openStorageFile("order-files", filePathOrUrl)
    } finally {
      setLoadingFile(null)
    }
  }

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus.mutate({ orderId: order.id, status })
  }

  const handleCertificateUpload = async () => {
    if (!certificateFile || !certificateType) return

    await uploadCertificate.mutateAsync({
      orderId: order.id,
      file: certificateFile,
      certificateType,
    })

    setCertificateFile(null)
    setCertificateType("")
  }

  const handleApprovePayment = () => {
    approvePayment.mutate(order.id)
  }

  const handleRejectPayment = () => {
    rejectPayment.mutate(order.id)
  }

  const handleMarkComplete = () => {
    completeOrder.mutate(order.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order {order.reference_number}
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="mb-3 font-medium">Customer Information</h3>
            <div className="grid gap-4 text-sm md:grid-cols-2">
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
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{order.delivery_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Expected: {formatDateLong(order.expected_delivery_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="mb-3 font-medium">Order Items</h3>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span>
                    {item.product_name} ({item.variant}) × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(Number(item.subtotal))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-medium">
                <span>Total</span>
                <span>{formatPrice(Number(order.total_amount))}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Section - show approve/reject only for payment_review status */}
          <div>
            <h3 className="mb-3 font-medium">Payment</h3>
            {order.payment_receipt_url ? (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleViewFile(order.payment_receipt_url!, "receipt")
                  }
                  disabled={loadingFile === "receipt"}
                >
                  {loadingFile === "receipt" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  View Payment Receipt
                </Button>
                {order.status === "verifying" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleApprovePayment}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRejectPayment}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment receipt uploaded
              </p>
            )}
          </div>

          <Separator />

          {/* Status Management */}
          <div>
            <h3 className="mb-3 font-medium">Order Status</h3>
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
            <h3 className="mb-3 font-medium">Certificates</h3>

            {/* Existing Certificates */}
            {order.order_certificates.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {order.order_certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => handleViewFile(cert.file_url, cert.id)}
                    disabled={loadingFile === cert.id}
                    className="flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                  >
                    {loadingFile === cert.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                    <p className="truncate text-sm font-medium">
                      {cert.certificate_type}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Upload New Certificate */}
            <div className="space-y-3 rounded-lg border p-4">
              <Select
                value={certificateType}
                onValueChange={setCertificateType}
              >
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
                    const file = e.target.files?.[0]
                    if (file) {
                      if (file.size > MAX_FILE_SIZE) {
                        toast({
                          variant: "destructive",
                          title: "File too large",
                          description: formatFileSizeError(file.size),
                        })
                        e.target.value = ""
                        return
                      }
                      setCertificateFile(file)
                    } else {
                      setCertificateFile(null)
                    }
                  }}
                />
                <Button
                  onClick={handleCertificateUpload}
                  disabled={
                    !certificateFile ||
                    !certificateType ||
                    uploadCertificate.isPending
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
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
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Order as Complete
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
