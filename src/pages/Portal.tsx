import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { OrderCard } from "@/components/orders/OrderCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useOrders } from "@/hooks/useOrders"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { extractFilePath, getSignedUrl } from "@/lib/storage"
import {
  Building2,
  Edit2,
  FileText,
  Home,
  Loader2,
  Package,
  Save,
  ShoppingBag,
  User,
  X,
} from "lucide-react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

type AccountType = Database["public"]["Enums"]["account_type"]

const Portal = () => {
  const { user, profile, refreshProfile } = useAuth()
  const {
    orders,
    currentOrders,
    pastOrders,
    isLoading: ordersLoading,
  } = useOrders()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get("tab") || "dashboard"
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingFile, setLoadingFile] = useState<string | null>(null)
  const [editedProfile, setEditedProfile] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    whatsapp_number: profile?.whatsapp_number || "",
    primary_address: profile?.primary_address || "",
    account_type: (profile?.account_type || "individual") as AccountType,
  })

  const handleViewFile = async (filePathOrUrl: string, fileId: string) => {
    setLoadingFile(fileId)
    try {
      const filePath = extractFilePath(filePathOrUrl)
      const signedUrl = await getSignedUrl("order-files", filePath)
      if (signedUrl) {
        window.open(signedUrl, "_blank")
      }
    } finally {
      setLoadingFile(null)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile({
        full_name: profile?.full_name || "",
        phone_number: profile?.phone_number || "",
        whatsapp_number: profile?.whatsapp_number || "",
        primary_address: profile?.primary_address || "",
        account_type: (profile?.account_type || "individual") as AccountType,
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editedProfile.full_name,
        phone_number: editedProfile.phone_number,
        whatsapp_number: editedProfile.whatsapp_number,
        primary_address: editedProfile.primary_address,
        account_type: editedProfile.account_type,
      })
      .eq("id", user.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      })
    } else {
      toast({
        title: "Profile updated",
        description: "Your information has been saved.",
      })
      await refreshProfile()
      setIsEditing(false)
    }

    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pt-28">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Welcome, {profile?.full_name || "User"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your orders, view certificates, and update your account
            information.
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="border bg-card">
            <TabsTrigger value="dashboard" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <FileText className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Orders</CardDescription>
                  <CardTitle className="text-3xl">{orders.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {orders.length === 0
                      ? "No orders yet"
                      : `${currentOrders.length} active`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>In Progress</CardDescription>
                  <CardTitle className="text-3xl">
                    {currentOrders.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {currentOrders.length === 0
                      ? "All orders complete"
                      : "Active orders"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Account Type</CardDescription>
                  <CardTitle className="text-xl capitalize">
                    {profile?.account_type || "Individual"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {profile?.account_type === "business"
                      ? "Business pricing available"
                      : "Consumer pricing"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading orders...
                  </div>
                ) : currentOrders.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No active orders</p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate("/#collection")}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentOrders.slice(0, 3).map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Tabs defaultValue="current">
              <TabsList>
                <TabsTrigger value="current">
                  Current Orders ({currentOrders.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Orders ({pastOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="mt-4">
                {ordersLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading orders...
                  </div>
                ) : currentOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No current orders</p>
                      <p className="mt-2 text-sm">
                        Your active orders will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {currentOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-4">
                {ordersLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading orders...
                  </div>
                ) : pastOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No past orders</p>
                      <p className="mt-2 text-sm">
                        Your completed orders will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pastOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Health and origin certificates for your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading certificates...
                  </div>
                ) : orders.filter((o) => o.order_certificates.length > 0)
                    .length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No certificates available</p>
                    <p className="mt-2 text-sm">
                      Certificates will be available after your orders are
                      shipped.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders
                      .filter((o) => o.order_certificates.length > 0)
                      .map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <h4 className="mb-3 font-medium">
                            Order {order.reference_number}
                          </h4>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {order.order_certificates.map((cert) => (
                              <button
                                key={cert.id}
                                onClick={() =>
                                  handleViewFile(cert.file_url, cert.id)
                                }
                                disabled={loadingFile === cert.id}
                                className="flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                              >
                                {loadingFile === cert.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                  <FileText className="h-4 w-4 text-primary" />
                                )}
                                <p className="truncate text-sm font-medium">
                                  {cert.certificate_type}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "ghost" : "outline"}
                  size="sm"
                  onClick={handleEditToggle}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.full_name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            full_name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-foreground">
                        {profile?.full_name || "-"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-foreground">
                      {profile?.email || user?.email || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editedProfile.phone_number}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value)
                          setEditedProfile({
                            ...editedProfile,
                            phone_number: formatted,
                          })
                        }}
                        placeholder="9XX XXX XXX"
                      />
                    ) : (
                      <p className="text-foreground">
                        {profile?.phone_number || "-"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      WhatsApp Number
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editedProfile.whatsapp_number}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value)
                          setEditedProfile({
                            ...editedProfile,
                            whatsapp_number: formatted,
                          })
                        }}
                        placeholder="9XX XXX XXX (optional)"
                      />
                    ) : (
                      <p className="text-foreground">
                        {profile?.whatsapp_number || "-"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Primary Address
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.primary_address}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            primary_address: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-foreground">
                        {profile?.primary_address || "-"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </label>
                  {isEditing ? (
                    <RadioGroup
                      value={editedProfile.account_type}
                      onValueChange={(value) =>
                        setEditedProfile({
                          ...editedProfile,
                          account_type: value as AccountType,
                        })
                      }
                      className="flex gap-4"
                    >
                      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="business" id="edit-business" />
                        <label
                          htmlFor="edit-business"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Business</span>
                        </label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50">
                        <RadioGroupItem
                          value="individual"
                          id="edit-individual"
                        />
                        <label
                          htmlFor="edit-individual"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Individual
                          </span>
                        </label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <p className="capitalize text-foreground">
                      {profile?.account_type || "Individual"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="border-t pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

export default Portal
