import { useState } from "react";
import { useAdminOrders, OrderWithProfile } from "@/hooks/useAdminOrders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, Eye, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderDetailDialog } from "./OrderDetailDialog";
import { formatPrice, formatDate } from "@/lib/format";

export const OrdersTab = () => {
  const { orders, pendingReviewOrders, inTransitOrders, completedOrders, isLoading, approvePayment, rejectPayment, deleteOrder } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProfile | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleViewOrder = (order: OrderWithProfile) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleApprovePayment = (orderId: string) => {
    approvePayment.mutate(orderId);
  };

  const handleRejectPayment = (orderId: string) => {
    rejectPayment.mutate(orderId);
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteOrder.mutate(orderToDelete);
      setOrderToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const OrderTable = ({ orderList }: { orderList: OrderWithProfile[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orderList.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.reference_number}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.profile?.full_name || order.contact_name}</p>
                  <p className="text-xs text-muted-foreground">{order.profile?.email}</p>
                </div>
              </TableCell>
              <TableCell className="capitalize">{order.profile?.account_type || "-"}</TableCell>
              <TableCell>{formatPrice(Number(order.total_amount))}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {order.status === "verifying" && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprovePayment(order.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRejectPayment(order.id)}>
                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading orders...
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Needs Review ({pendingReviewOrders.length})
          </TabsTrigger>
          <TabsTrigger value="transit">Shipped ({inTransitOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View and manage all customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orderList={orders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Needs Review</CardTitle>
              <CardDescription>Orders awaiting receipt verification</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orderList={pendingReviewOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transit">
          <Card>
            <CardHeader>
              <CardTitle>Shipped</CardTitle>
              <CardDescription>Orders currently being shipped</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orderList={inTransitOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>Successfully delivered orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orderList={completedOrders} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
