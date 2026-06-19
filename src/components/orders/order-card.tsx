import { ShipmentTimeline } from "@/components/shipment/shipment-timeline"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { OrderWithItems } from "@/hooks/use-orders"
import { formatDate, formatPrice } from "@/lib/format"
import { openStorageFile } from "@/lib/storage"
import { ChevronDown, FileText, Loader2, MapPin, Phone, User } from "lucide-react"
import { useState } from "react"
import { OrderStatusBadge } from "./order-status-badge"

interface OrderCardProps {
  order: OrderWithItems
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loadingFile, setLoadingFile] = useState<string | null>(null)

  const handleViewFile = async (filePathOrUrl: string, fileId: string) => {
    setLoadingFile(fileId)
    try {
      await openStorageFile("order-files", filePathOrUrl)
    } finally {
      setLoadingFile(null)
    }
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer p-6 hover:bg-muted/40 transition-colors rounded-t-lg select-none">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <h3 className="font-medium">{order.reference_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ordered {formatDate(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{formatPrice(Number(order.total_amount))}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform text-muted-foreground ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Reject Reason */}
            {order.status === "rejected" && order.reject_reason && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                <p className="mb-1 font-medium text-destructive">Payment Rejection Reason</p>
                <p className="text-muted-foreground">{order.reject_reason}</p>
              </div>
            )}

            {/* Shipment Timeline Section */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Shipment Tracking</h4>
              <ShipmentTimeline orderId={order.id} orderStatus={order.status} compact />
            </div>

            {/* Order Items */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Order Items</h4>
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b py-2 text-sm last:border-0"
                  >
                    <span>
                      {item.product_name}
                      {item.option_name ? ` - ${item.option_name}` : ""} ({item.variant}) ×{" "}
                      {item.quantity}
                    </span>
                    <span>{formatPrice(Number(item.subtotal))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <h4 className="mb-2 text-sm font-medium">Delivery Details</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span>{order.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span>{order.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span>{order.delivery_address}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span>
                    Expected: {formatDate(order.expected_delivery_date)}
                  </span>
                </div> */}
              </div>
            </div>

            {/* Certificates */}
            {order.order_certificates.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium">Certificates</h4>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {order.order_certificates.map((cert) => (
                    <button
                      key={cert.id}
                      onClick={() => handleViewFile(cert.file_url, cert.id)}
                      disabled={loadingFile === cert.id}
                      className="flex items-center gap-2 rounded-2xl border p-3 text-left transition-colors hover:bg-muted"
                    >
                      {loadingFile === cert.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                      <p className="truncate text-sm font-medium">{cert.certificate_type}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
