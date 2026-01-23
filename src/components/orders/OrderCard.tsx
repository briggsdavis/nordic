import { ShipmentTimeline } from "@/components/shipment/ShipmentTimeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { OrderWithItems } from "@/hooks/useOrders"
import { formatDate, formatPrice } from "@/lib/format"
import { openStorageFile } from "@/lib/storage"
import {
  Calendar,
  ChevronDown,
  FileText,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { useState } from "react"
import { OrderStatusBadge } from "./OrderStatusBadge"

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
        <CardHeader className="p-6">
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
              <span className="font-medium">
                {formatPrice(Number(order.total_amount))}
              </span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Shipment Timeline Section */}
            {(order.status === "confirmed" ||
              order.status === "shipped" ||
              order.status === "delivered") && (
              <div>
                <h4 className="mb-3 text-sm font-medium">Shipment Tracking</h4>
                <ShipmentTimeline orderId={order.id} compact />
              </div>
            )}

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
                      {item.product_name} ({item.variant}) × {item.quantity}
                    </span>
                    <span>{formatPrice(Number(item.subtotal))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <h4 className="text-sm font-medium">Delivery Details</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{order.contact_name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{order.contact_phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{order.delivery_address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>
                    Expected: {formatDate(order.expected_delivery_date)}
                  </span>
                </div>
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
                      <p className="truncate text-sm font-medium">
                        {cert.certificate_type}
                      </p>
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
