import { useAdminOrders } from "@/hooks/useAdminOrders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Upload, FileText } from "lucide-react";
import { LogisticsPipeline, logisticsStages } from "@/components/orders/LogisticsPipeline";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type LogisticsStage = Database["public"]["Enums"]["logistics_stage"];

const certificateTypes = [
  "Health Certificate",
  "Origin Certificate",
  "Quality Certificate",
  "Customs Declaration",
];

export const LogisticsTab = () => {
  const { inTransitOrders, isLoading, updateLogisticsStage, uploadCertificate } = useAdminOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState("");

  const handleStageChange = (orderId: string, stage: LogisticsStage) => {
    updateLogisticsStage.mutate({ orderId, stage });
  };

  const handleCertificateUpload = async () => {
    if (!selectedOrderId || !certificateFile || !certificateType) return;

    await uploadCertificate.mutateAsync({
      orderId: selectedOrderId,
      file: certificateFile,
      certificateType,
    });

    setCertificateFile(null);
    setCertificateType("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Manage shipment stages for orders in transit</CardDescription>
        </CardHeader>
        <CardContent>
          {inTransitOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active shipments</p>
              <p className="text-sm mt-2">Orders in transit will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Update Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inTransitOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.reference_number}</TableCell>
                    <TableCell>{order.profile?.full_name || order.contact_name}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <LogisticsPipeline currentStage={order.logistics_stage} compact />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.logistics_stage || ""}
                        onValueChange={(v) => handleStageChange(order.id, v as LogisticsStage)}
                      >
                        <SelectTrigger className="w-[180px]">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Batch Certificate Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Certificates</CardTitle>
          <CardDescription>Upload certificates for orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Order" />
                </SelectTrigger>
                <SelectContent>
                  {inTransitOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.reference_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button
              onClick={handleCertificateUpload}
              disabled={!selectedOrderId || !certificateFile || !certificateType || uploadCertificate.isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Certificate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Overview */}
      {inTransitOrders.some((o) => o.order_certificates.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Certificates</CardTitle>
            <CardDescription>Certificates attached to orders in transit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inTransitOrders
                .filter((o) => o.order_certificates.length > 0)
                .map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{order.reference_number}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
