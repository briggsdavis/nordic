import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type LogisticsStage = Database["public"]["Enums"]["logistics_stage"];

export interface Order {
  id: string;
  reference_number: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  contact_name: string;
  contact_phone: string;
  additional_comments: string | null;
  location_description: string | null;
  preferred_delivery_time: string | null;
  expected_delivery_date: string;
  payment_receipt_url: string | null;
  logistics_stage: LogisticsStage | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  variant: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface OrderCertificate {
  id: string;
  order_id: string;
  certificate_type: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
  order_certificates: OrderCertificate[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user's orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          order_certificates(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OrderWithItems[];
    },
    enabled: !!user,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const ordersChannel = supabase
      .channel("user-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders", user.id] });
        }
      )
      .subscribe();

    const certsChannel = supabase
      .channel("user-certificates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_certificates",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(certsChannel);
    };
  }, [user, queryClient]);

  // Create a new order
  const createOrder = useMutation({
    mutationFn: async (orderData: {
      items: { productId: string; productName: string; variant: string; quantity: number; unitPrice: number }[];
      deliveryAddress: string;
      contactName: string;
      contactPhone: string;
      additionalComments?: string;
      locationDescription?: string;
      preferredDeliveryTime?: string;
      paymentReceiptUrl?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const totalAmount = orderData.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3);

      // Set status based on whether payment receipt is uploaded
      const initialStatus: OrderStatus = orderData.paymentReceiptUrl ? "payment_review" : "awaiting_payment";

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          reference_number: "",
          total_amount: totalAmount,
          delivery_address: orderData.deliveryAddress,
          contact_name: orderData.contactName,
          contact_phone: orderData.contactPhone,
          additional_comments: orderData.additionalComments || null,
          location_description: orderData.locationDescription || null,
          preferred_delivery_time: orderData.preferredDeliveryTime || null,
          expected_delivery_date: expectedDeliveryDate.toISOString().split("T")[0],
          payment_receipt_url: orderData.paymentReceiptUrl || null,
          status: initialStatus,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        variant: item.variant,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Order placed!", description: "Your order has been submitted successfully." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Order failed", description: error.message });
    },
  });

  // Upload payment receipt - auto transitions to payment_review
  const uploadPaymentReceipt = useMutation({
    mutationFn: async ({ orderId, file }: { orderId: string; file: File }) => {
      if (!user) throw new Error("Must be logged in");

      const filePath = `${user.id}/receipts/${orderId}-${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("order-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store the file path instead of URL (private bucket)
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_receipt_url: filePath,
          status: "payment_review" as OrderStatus,
        })
        .eq("id", orderId);

      if (updateError) throw updateError;

      return filePath;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Receipt uploaded", description: "Your payment receipt has been submitted for review." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    },
  });

  const currentOrders = orders.filter(
    (o) => !["completed", "cancelled"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["completed", "cancelled"].includes(o.status)
  );

  return {
    orders,
    currentOrders,
    pastOrders,
    isLoading,
    createOrder,
    uploadPaymentReceipt,
  };
};
