import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { Database } from "@/integrations/supabase/types";
import type { OrderWithItems } from "./useOrders";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type LogisticsStage = Database["public"]["Enums"]["logistics_stage"];

export interface OrderWithProfile extends OrderWithItems {
  profile?: {
    full_name: string;
    email: string;
    account_type: string;
  };
}

export const useAdminOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all orders with user profiles
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          order_certificates(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(data.map((o) => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, account_type")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return data.map((order) => ({
        ...order,
        profile: profileMap.get(order.user_id),
      })) as OrderWithProfile[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order status updated" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Approve payment - transitions to processing
  const approvePayment = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "processing" as OrderStatus })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Payment approved", description: "Order is now processing." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Reject payment - transitions to payment_rejected
  const rejectPayment = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "payment_rejected" as OrderStatus })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Payment rejected", description: "Customer will need to re-upload." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Update logistics stage - auto transitions status
  const updateLogisticsStage = useMutation({
    mutationFn: async ({ orderId, stage }: { orderId: string; stage: LogisticsStage }) => {
      const updates: Record<string, unknown> = { logistics_stage: stage };
      
      // Auto-update status based on logistics stage
      if (stage === "delivered") {
        updates.status = "delivered";
      } else {
        updates.status = "in_transit";
      }

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Logistics stage updated" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Upload certificate
  const uploadCertificate = useMutation({
    mutationFn: async ({
      orderId,
      file,
      certificateType,
    }: {
      orderId: string;
      file: File;
      certificateType: string;
    }) => {
      const filePath = `certificates/${orderId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("order-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { user } } = await supabase.auth.getUser();

      // Store file path instead of URL (private bucket)
      const { error: insertError } = await supabase.from("order_certificates").insert({
        order_id: orderId,
        certificate_type: certificateType,
        file_url: filePath,
        uploaded_by: user!.id,
      });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Certificate uploaded" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    },
  });

  // Delete order
  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order deleted" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Mark order as complete
  const completeOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "completed" })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order marked as complete" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Filtered lists using unified status
  const pendingReviewOrders = orders.filter((o) => o.status === "payment_review");
  const inTransitOrders = orders.filter((o) => o.status === "in_transit");
  const completedOrders = orders.filter((o) => o.status === "completed");

  // Analytics - count orders that have been paid (processing or later)
  const paidStatuses: OrderStatus[] = ["processing", "in_transit", "delivered", "completed"];
  const totalRevenue = orders
    .filter((o) => paidStatuses.includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return {
    orders,
    pendingReviewOrders,
    inTransitOrders,
    completedOrders,
    isLoading,
    updateOrderStatus,
    approvePayment,
    rejectPayment,
    updateLogisticsStage,
    uploadCertificate,
    deleteOrder,
    completeOrder,
    totalRevenue,
  };
};
