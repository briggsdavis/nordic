import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Home,
  CheckCircle2,
  Clock,
  ShoppingBag,
  DollarSign
} from "lucide-react";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const Admin = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { orders, pendingReviewOrders, inTransitOrders, totalRevenue } = useAdminOrders();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Get all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Get all user IDs with admin role
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    const adminUserIds = new Set((adminRoles as { user_id: string }[] | null)?.map(r => r.user_id) || []);

    // Filter out admin users
    const customers = profiles?.filter(profile => !adminUserIds.has(profile.id)) || [];

    setUsers(customers);
    setLoadingUsers(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-deep/5 via-background to-arctic-mist/20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-serif font-bold text-lg">NS</span>
                </div>
                <span className="font-serif text-lg font-semibold text-foreground">
                  Nordic Seafood
                </span>
              </a>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                Admin Dashboard
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/portal")} className="gap-2">
                <Home className="h-4 w-4" />
                Client Portal
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage orders, customers, and products.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-3xl text-green-600">
                    ${totalRevenue.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Verified payments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Orders</CardDescription>
                  <CardTitle className="text-3xl">{orders.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">All time orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending Approval</CardDescription>
                  <CardTitle className="text-3xl text-amber-600">{pendingReviewOrders.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Awaiting payment verification</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Shipments</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">{inTransitOrders.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">In transit</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Approve Pending Payments ({pendingReviewOrders.length})
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    View Shipped Orders ({inTransitOrders.length})
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    View Revenue Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Stats</CardTitle>
                  <CardDescription>Platform overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Registered Customers</span>
                    <span className="font-medium">{users.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Orders</span>
                    <span className="font-medium">{orders.filter(o => !["completed", "cancelled"].includes(o.status)).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed Orders</span>
                    <span className="font-medium">{orders.filter(o => o.status === "completed").length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage registered customers</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Loading customers...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No customers yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm">{user.full_name}</td>
                            <td className="py-3 px-4 text-sm">{user.email}</td>
                            <td className="py-3 px-4 text-sm">{user.phone_number || "-"}</td>
                            <td className="py-3 px-4 text-sm capitalize">{user.account_type}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
