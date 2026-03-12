import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderWithProfile, useAdminOrders } from "@/hooks/useAdminOrders"
import type { Database } from "@/integrations/supabase/types"
import { useState } from "react"
import { OrderRow } from "./OrderRow"

type OrderStatus = Database["public"]["Enums"]["order_status"]

interface OrdersTabProps {
  expandedOrderId: string | null
  onExpandedChange: (id: string | null) => void
}

export const OrdersTab = ({
  expandedOrderId,
  onExpandedChange,
}: OrdersTabProps) => {
  const {
    orders,
    pendingReviewOrders,
    inTransitOrders,
    completedOrders,
    isLoading,
    approvePayment,
    rejectPayment,
    saveNote,
    deleteOrder,
    completeOrder,
    updateOrderStatus,
  } = useAdminOrders()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)

  const toggleOrderExpansion = (orderId: string) => {
    onExpandedChange(expandedOrderId === orderId ? null : orderId)
  }

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteOrder.mutate(orderToDelete, {
        onSuccess: () => {
          onExpandedChange(null)
          setOrderToDelete(null)
          setDeleteDialogOpen(false)
        },
      })
    }
  }

  const OrderTable = ({ orderList }: { orderList: OrderWithProfile[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderList.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-8 text-center text-muted-foreground"
            >
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orderList.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              onToggle={() => toggleOrderExpansion(order.id)}
              onApprove={() => approvePayment.mutate(order.id)}
              onReject={(reason) =>
                rejectPayment.mutate({ orderId: order.id, reason })
              }
              onSaveNote={(note) =>
                saveNote.mutate({ orderId: order.id, note })
              }
              onDelete={() => handleDeleteClick(order.id)}
              onComplete={() => completeOrder.mutate(order.id)}
              onStatusChange={(status: OrderStatus) =>
                updateOrderStatus.mutate({ orderId: order.id, status })
              }
            />
          ))
        )}
      </TableBody>
    </Table>
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading orders...
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Needs Review ({pendingReviewOrders.length})
          </TabsTrigger>
          <TabsTrigger value="transit">
            In Transit ({inTransitOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                View and manage all customer orders
              </CardDescription>
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
              <CardDescription>
                Orders awaiting receipt verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orderList={pendingReviewOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transit">
          <Card>
            <CardHeader>
              <CardTitle>In Transit</CardTitle>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
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
  )
}
