import { ShipmentStageManager } from "@/components/admin/ShipmentStageManager"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import type { OrderWithProfile } from "@/hooks/useAdminOrders"
import { formatDate, formatPrice } from "@/lib/format"
import { openStorageFile } from "@/lib/storage"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react"
import { useState } from "react"

interface OrderRowProps {
  order: OrderWithProfile
  isExpanded: boolean
  onToggle: () => void
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
}

export const OrderRow = ({
  order,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
  onDelete,
}: OrderRowProps) => {
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
    <>
      <TableRow
        className="cursor-pointer transition-colors hover:bg-muted/50"
        onClick={onToggle}
      >
        <TableCell className="w-12">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </TableCell>
        <TableCell className="font-medium">{order.reference_number}</TableCell>
        <TableCell>
          <div>
            <p className="font-medium">
              {order.profile?.full_name || order.contact_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.profile?.email}
            </p>
          </div>
        </TableCell>
        <TableCell className="capitalize">
          {order.profile?.account_type || "-"}
        </TableCell>
        <TableCell>{formatPrice(Number(order.total_amount))}</TableCell>
        <TableCell>
          <OrderStatusBadge status={order.status} />
        </TableCell>
        <TableCell>{formatDate(order.created_at)}</TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/20 p-6">
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Customer
                  </h4>
                  <div className="space-y-1.5">
                    <p className="font-medium text-foreground">
                      {order.profile?.full_name || order.contact_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.profile?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.contact_phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Delivery
                  </h4>
                  <div className="space-y-1.5">
                    <p className="font-medium text-foreground">
                      {order.delivery_address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expected: {formatDate(order.expected_delivery_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Items
                </h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(Number(item.subtotal))}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(Number(order.total_amount))}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Docs:
                </h4>
                {order.payment_receipt_url ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleViewFile(order.payment_receipt_url!, "receipt")
                    }}
                    disabled={loadingFile === "receipt"}
                  >
                    {loadingFile === "receipt" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-4 w-4" />
                    )}
                    Receipt
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No receipt
                  </span>
                )}
                {order.order_certificates.length > 0 ? (
                  order.order_certificates.map((cert) => (
                    <Button
                      key={cert.id}
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleViewFile(cert.file_url, cert.id)
                      }}
                      disabled={loadingFile === cert.id}
                    >
                      {loadingFile === cert.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      {cert.certificate_type}
                    </Button>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No certificates
                  </span>
                )}
              </div>

              {(order.status === "confirmed" ||
                order.status === "shipped" ||
                order.status === "delivered") && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Shipment Tracking
                  </h4>
                  <ShipmentStageManager orderId={order.id} />
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t pt-4">
                {order.status === "verifying" && (
                  <>
                    <Button
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation()
                        onApprove()
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(event) => {
                        event.stopPropagation()
                        onReject()
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Payment
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Order
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
