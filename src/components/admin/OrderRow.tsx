import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TableCell, TableRow } from "@/components/ui/table"
import type { OrderWithProfile } from "@/hooks/useAdminOrders"
import { formatDate, formatPrice } from "@/lib/format"
import { openStorageFile } from "@/lib/storage"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Trash2,
  User,
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
      {/* Summary Row */}
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
        <TableCell className="font-medium">
          {order.reference_number}
        </TableCell>
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

      {/* Expanded Details Row */}
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/30 p-6">
            <div className="space-y-6">
              {/* Customer Info Section */}
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Customer Information
                </h4>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.profile?.full_name || order.contact_name}
                      </span>
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
                        Expected: {formatDate(order.expected_delivery_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items Section */}
              <div>
                <h4 className="mb-3 text-sm font-medium">Order Items</h4>
                <div className="max-h-64 space-y-2 overflow-y-auto">
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

              {/* Payment & Certificates Section */}
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Payment & Documents
                </h4>
                <div className="space-y-3">
                  {/* Payment Receipt */}
                  {order.payment_receipt_url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewFile(order.payment_receipt_url!, "receipt")
                      }}
                      disabled={loadingFile === "receipt"}
                    >
                      {loadingFile === "receipt" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="mr-2 h-4 w-4" />
                      )}
                      View Payment Receipt
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No payment receipt uploaded
                    </p>
                  )}

                  {/* Certificates Grid */}
                  {order.order_certificates.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {order.order_certificates.map((cert) => (
                        <button
                          key={cert.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewFile(cert.file_url, cert.id)
                          }}
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
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {order.status === "verifying" && (
                  <>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onApprove()
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
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
                  onClick={(e) => {
                    e.stopPropagation()
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
