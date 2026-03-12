import { ShipmentStageManager } from "@/components/admin/ShipmentStageManager"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { TableCell, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import type { OrderWithProfile } from "@/hooks/useAdminOrders"
import type { Database } from "@/integrations/supabase/types"
import { formatDate, formatPrice } from "@/lib/format"
import { openStorageFile } from "@/lib/storage"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Trash2,
  User,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

type OrderStatus = Database["public"]["Enums"]["order_status"]

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "verifying", label: "Verifying" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
]

interface OrderRowProps {
  order: OrderWithProfile
  isExpanded: boolean
  onToggle: () => void
  onApprove: () => void
  onReject: (reason: string) => void
  onSaveNote: (note: string) => void
  onDelete: () => void
  onComplete: () => void
  onStatusChange: (status: OrderStatus) => void
}

export const OrderRow = ({
  order,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
  onSaveNote,
  onDelete,
  onComplete,
  onStatusChange,
}: OrderRowProps) => {
  const [loadingFile, setLoadingFile] = useState<string | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [noteValue, setNoteValue] = useState(order.note ?? "")

  useEffect(() => {
    setNoteValue(order.note ?? "")
  }, [order.note])

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

        {/* Clickable status badge — stops row expansion */}
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <OrderStatusBadge status={order.status} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Change Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  disabled={value === order.status}
                  onClick={() => onStatusChange(value)}
                  className={cn(
                    value === order.status && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>

        <TableCell>{formatDate(order.created_at)}</TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/20 p-6">
            <div className="space-y-6">
              {/* Customer + Delivery */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Customer
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {order.profile?.full_name || order.contact_name}
                      </span>
                    </div>
                    {order.profile?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {order.profile.email}
                        </span>
                      </div>
                    )}
                    {order.contact_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {order.contact_phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Delivery
                  </h4>
                  <div className="space-y-2">
                    {order.delivery_address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {order.delivery_address}
                        </span>
                      </div>
                    )}
                    {/* {order.expected_delivery_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Expected: {formatDate(order.expected_delivery_date)}
                        </span>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Items
                </h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-lg border bg-background p-3 text-sm"
                    >
                      <div className="flex items-start gap-3">
                        <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {item.product_name}
                          </p>
                          {item.option_name && (
                            <p className="text-xs text-muted-foreground">
                              Type: {item.option_name}
                            </p>
                          )}
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              Variant: {item.variant}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatPrice(Number(item.subtotal))}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t pt-2 font-semibold text-sm">
                    <span>Total</span>
                    <span>{formatPrice(Number(order.total_amount))}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
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

              {/* Shipment Tracking */}
              {(order.status === "confirmed" ||
                order.status === "shipped" ||
                order.status === "delivered") && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Shipment Tracking
                  </h4>
                  <ShipmentStageManager
                    orderId={order.id}
                    onAllStagesComplete={onComplete}
                  />
                </div>
              )}

              {/* Admin Note */}
              {/* <div onClick={(e) => e.stopPropagation()}>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Admin Note
                </Label>
                <div className="mt-2 flex gap-2">
                  <Textarea
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Internal note (not visible to customer)..."
                    className="min-h-[72px] resize-none text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="self-end"
                    onClick={() => onSaveNote(noteValue)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div> */}

              {/* Reject Reason (shown when rejected) */}
              {order.status === "rejected" && order.reject_reason && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-destructive">
                    Reject Reason
                  </p>
                  <p className="text-muted-foreground">{order.reject_reason}</p>
                </div>
              )}

              {/* Action Buttons */}
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
                        setRejectReason("")
                        setRejectDialogOpen(true)
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

              {/* Reject Dialog */}
              <Dialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
              >
                <DialogContent onClick={(e) => e.stopPropagation()}>
                  <DialogHeader>
                    <DialogTitle>Reject Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reject-reason">
                      Reason (shown to customer)
                    </Label>
                    <Textarea
                      id="reject-reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Receipt image is unclear, please re-upload..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setRejectDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onReject(rejectReason)
                        setRejectDialogOpen(false)
                      }}
                    >
                      Reject
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
