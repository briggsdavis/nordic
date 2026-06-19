import { OrdersTab } from "@/components/admin/orders-tab"
import { ProductsTab } from "@/components/admin/products-tab"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useAdminOrders } from "@/hooks/use-admin-orders"
import {
  type SiteSettings,
  useSiteSettings,
  useSiteSettingsMutation,
} from "@/hooks/use-site-settings"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { formatPrice } from "@/lib/format"
import { uploadSiteDocument } from "@/lib/storage"
import {
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Upload,
  Users,
} from "lucide-react"
import { type ChangeEvent, useEffect, useState } from "react"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

const defaultSettingsForm: SiteSettings = {
  contact_phone: "",
  contact_email: "",
  bank_account_holder: "",
  bank_account_number: "",
  bank_name: "",
  document_management_system_url: "",
  document_free_sale_url: "",
  document_certificate_of_competence_url: "",
}

const siteDocuments: {
  title: string
  description: string
  settingKey: keyof Pick<
    SiteSettings,
    | "document_management_system_url"
    | "document_free_sale_url"
    | "document_certificate_of_competence_url"
  >
  slug: string
}[] = [
  {
    title: "Management System Certificate",
    description: "ISO certification for quality management.",
    settingKey: "document_management_system_url",
    slug: "management-system-certificate",
  },
  {
    title: "Free Sale Certificate",
    description: "Export authorization and compliance.",
    settingKey: "document_free_sale_url",
    slug: "free-sale-certificate",
  },
  {
    title: "Certificate of Competence",
    description: "Replace this when the CoC expires.",
    settingKey: "document_certificate_of_competence_url",
    slug: "certificate-of-competence",
  },
]

const Admin = () => {
  const { profile } = useAuth()
  const adminOrders = useAdminOrders()
  const { orders, pendingReviewOrders, inTransitOrders, totalRevenue } = adminOrders
  const [users, setUsers] = useState<Profile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { data: siteSettings } = useSiteSettings()
  const { update: updateSettings } = useSiteSettingsMutation()
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(defaultSettingsForm)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null)

  // Persist active tab across browser-tab switches / component remounts
  const [adminTab, setAdminTab] = useState(() => sessionStorage.getItem("admin-tab") ?? "overview")
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
      setSettingsForm(siteSettings)
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
    const customers = profiles?.filter((profile) => !adminUserIds.has(profile.id)) || []

    setUsers(customers)
    setLoadingUsers(false)
  }

  const handleDocumentUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    document: (typeof siteDocuments)[number],
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    setUploadingDocument(document.settingKey)
    setSettingsSaved(false)
    try {
      const url = await uploadSiteDocument(file, document.slug)
      const nextSettings = { ...settingsForm, [document.settingKey]: url }
      setSettingsForm(nextSettings)
      await updateSettings({ [document.settingKey]: url })
      setSettingsSaved(true)
    } finally {
      setUploadingDocument(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pt-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage orders, customers, and products.</p>
        </div>

        <Tabs value={adminTab} onValueChange={handleAdminTabChange} className="space-y-6">
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
                  <CardTitle className="text-3xl text-amber-600">
                    {pendingReviewOrders.length}
                  </CardTitle>
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

            <div className="grid gap-6 md:grid-cols-2">
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Registered Customers</span>
                    <span className="font-medium">{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Orders</span>
                    <span className="font-medium">
                      {orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed Orders</span>
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
              adminOrders={adminOrders}
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
                <CardDescription>View and manage registered customers</CardDescription>
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
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm">{user.full_name}</td>
                            <td className="px-4 py-3 text-sm">{user.email}</td>
                            <td className="px-4 py-3 text-sm">{user.phone_number || "-"}</td>
                            <td className="px-4 py-3 text-sm capitalize">{user.account_type}</td>
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
          <TabsContent value="settings" className="space-y-6">
            <form
              className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
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
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>Displayed on the Contact page and footer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                  <CardDescription>Shown to customers during checkout.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bank_account_holder">Account Holder</Label>
                    <Input
                      id="bank_account_holder"
                      value={settingsForm.bank_account_holder}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          bank_account_holder: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bank_account_number">Account Number</Label>
                    <Input
                      id="bank_account_number"
                      value={settingsForm.bank_account_number}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          bank_account_number: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={settingsForm.bank_name}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          bank_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 xl:col-span-2">
                <Button type="submit" disabled={settingsSaving}>
                  {settingsSaving ? "Saving..." : "Save Settings"}
                </Button>
                {settingsSaved && <span className="text-sm text-green-600">Saved</span>}
              </div>
            </form>

            <Card>
              <CardHeader>
                <CardTitle>Company Documents</CardTitle>
                <CardDescription>Replace public certificates shown in the customer portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {siteDocuments.map((document) => {
                  const currentUrl = settingsForm[document.settingKey]
                  const isUploading = uploadingDocument === document.settingKey

                  return (
                    <div
                      key={document.settingKey}
                      className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">{document.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{document.description}</p>
                        <Input
                          value={currentUrl}
                          placeholder="No uploaded replacement yet"
                          onChange={(e) =>
                            setSettingsForm((f) => ({
                              ...f,
                              [document.settingKey]: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={!currentUrl}
                          onClick={() => window.open(currentUrl, "_blank", "noopener,noreferrer")}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </Button>
                        <Button type="button" variant="outline" asChild disabled={isUploading}>
                          <label>
                            <Upload className="h-4 w-4" />
                            {isUploading ? "Uploading..." : "Replace"}
                            <input
                              className="sr-only"
                              type="file"
                              accept="application/pdf,.pdf"
                              onChange={(event) => handleDocumentUpload(event, document)}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                  )
                })}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    disabled={settingsSaving}
                    onClick={async () => {
                      setSettingsSaving(true)
                      setSettingsSaved(false)
                      try {
                        await updateSettings({
                          document_management_system_url:
                            settingsForm.document_management_system_url,
                          document_free_sale_url: settingsForm.document_free_sale_url,
                          document_certificate_of_competence_url:
                            settingsForm.document_certificate_of_competence_url,
                        })
                        setSettingsSaved(true)
                      } finally {
                        setSettingsSaving(false)
                      }
                    }}
                  >
                    {settingsSaving ? "Saving..." : "Save Document URLs"}
                  </Button>
                  {settingsSaved && <span className="text-sm text-green-600">Saved</span>}
                </div>
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
