import { OrdersTab } from "@/components/admin/OrdersTab"
import { ProductsTab } from "@/components/admin/ProductsTab"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminOrders } from "@/hooks/useAdminOrders"
import {
  useSiteSettings,
  useSiteSettingsMutation,
} from "@/hooks/useSiteSettings"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { formatPrice } from "@/lib/format"
import {
  CheckCircle2,
  Clock,
  DollarSign,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

const Admin = () => {
  const { profile } = useAuth()
  const { orders, pendingReviewOrders, inTransitOrders, totalRevenue } =
    useAdminOrders()
  const [users, setUsers] = useState<Profile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { data: siteSettings } = useSiteSettings()
  const { update: updateSettings } = useSiteSettingsMutation()
  const [settingsForm, setSettingsForm] = useState({
    contact_phone: "",
    contact_email: "",
  })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Persist active tab across browser-tab switches / component remounts
  const [adminTab, setAdminTab] = useState(
    () => sessionStorage.getItem("admin-tab") ?? "overview",
  )
  const handleAdminTabChange = (tab: string) => {
    setAdminTab(tab)
    sessionStorage.setItem("admin-tab", tab)
  }

  // Lifted here so it survives switching between Overview / Orders / etc. tabs
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    () => sessionStorage.getItem("admin-expanded-order") ?? null,
  )
  const handleExpandedOrderChange = (id: string | null) => {
    setExpandedOrderId(id)
    if (id) sessionStorage.setItem("admin-expanded-order", id)
    else sessionStorage.removeItem("admin-expanded-order")
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        contact_phone: siteSettings.contact_phone,
        contact_email: siteSettings.contact_email,
      })
    }
  }, [siteSettings])

  const fetchUsers = async () => {
    // Get all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    // Get all user IDs with admin role
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")

    const adminUserIds = new Set(
      (adminRoles as { user_id: string }[] | null)?.map((r) => r.user_id) || [],
    )

    // Filter out admin users
    const customers =
      profiles?.filter((profile) => !adminUserIds.has(profile.id)) || []

    setUsers(customers)
    setLoadingUsers(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pt-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage orders, customers, and products.
          </p>
        </div>

        <Tabs
          value={adminTab}
          onValueChange={handleAdminTabChange}
          className="space-y-6"
        >
          <TabsList className="border bg-card">
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
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-3xl text-green-600">
                    {formatPrice(totalRevenue)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Verified payments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Orders</CardDescription>
                  <CardTitle className="text-3xl">{orders.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    All time orders
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending Approval</CardDescription>
                  <CardTitle className="text-3xl text-amber-600">
                    {pendingReviewOrders.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Awaiting payment verification
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Shipments</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">
                    {inTransitOrders.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">In transit</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Approve Pending Payments ({pendingReviewOrders.length})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Clock className="h-4 w-4 text-amber-600" />
                    View Shipped Orders ({inTransitOrders.length})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Registered Customers
                    </span>
                    <span className="font-medium">{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active Orders
                    </span>
                    <span className="font-medium">
                      {
                        orders.filter(
                          (o) => !["completed", "cancelled"].includes(o.status),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Completed Orders
                    </span>
                    <span className="font-medium">
                      {orders.filter((o) => o.status === "completed").length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrdersTab
              expandedOrderId={expandedOrderId}
              onExpandedChange={handleExpandedOrderChange}
            />
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
                <CardDescription>
                  View and manage registered customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>Loading customers...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No customers yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="px-4 py-3 text-sm">
                              {user.full_name}
                            </td>
                            <td className="px-4 py-3 text-sm">{user.email}</td>
                            <td className="px-4 py-3 text-sm">
                              {user.phone_number || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm capitalize">
                              {user.account_type}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
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

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>
                  Displayed on the Contact page and footer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setSettingsSaving(true)
                    setSettingsSaved(false)
                    try {
                      await updateSettings(settingsForm)
                      setSettingsSaved(true)
                    } finally {
                      setSettingsSaving(false)
                    }
                  }}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      value={settingsForm.contact_phone}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          contact_phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settingsForm.contact_email}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          contact_email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="submit" disabled={settingsSaving}>
                      {settingsSaving ? "Saving..." : "Save"}
                    </Button>
                    {settingsSaved && (
                      <span className="text-sm text-green-600">Saved</span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

export default Admin
