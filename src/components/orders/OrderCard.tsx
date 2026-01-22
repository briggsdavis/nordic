import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileText, MapPin, Calendar, Phone, User, Loader2 } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { openStorageFile } from "@/lib/storage";
import { formatPrice, formatDate } from "@/lib/format";
import type { OrderWithItems } from "@/hooks/useOrders";

interface OrderCardProps {
  order: OrderWithItems;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const handleViewFile = async (filePathOrUrl: string, fileId: string) => {
    setLoadingFile(fileId);
    try {
      await openStorageFile("order-files", filePathOrUrl);
    } finally {
      setLoadingFile(null);
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <CardContent className="pt-0 space-y-6">
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-sm mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm py-2 border-b last:border-0"
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
              <h4 className="font-medium text-sm">Delivery Details</h4>
              <div className="space-y-1 text-sm mt-2">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{order.contact_name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{order.contact_phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{order.delivery_address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>Expected: {formatDate(order.expected_delivery_date)}</span>
                </div>
              </div>
            </div>

            {/* Certificates */}
            {order.order_certificates.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3">Certificates</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
