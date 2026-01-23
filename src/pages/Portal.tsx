import certificateOfCompetence from "@/assets/certificate-of-competence.pdf"
import freeSaleCertificate from "@/assets/free-sale-certificate.pdf"
import managementSystemCertificate from "@/assets/management-system-certificate.pdf"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Award,
  Building2,
  FileCheck,
  FileText,
  Package,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type AccountType = Database["public"]["Enums"]["account_type"]

const Portal = () => {
  const { user, profile, refreshProfile } = useAuth()
  const {
    orders,
    currentOrders,
    pastOrders,
    isLoading: ordersLoading,
  } = useOrders()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
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

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing dialog
      setEditedProfile({
        full_name: profile?.full_name || "",
        phone_number: profile?.phone_number || "",
        whatsapp_number: profile?.whatsapp_number || "",
        primary_address: profile?.primary_address || "",
        account_type: (profile?.account_type || "individual") as AccountType,
      })
    }
    setIsAccountDialogOpen(open)
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
      setIsAccountDialogOpen(false)
    }

    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pt-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Welcome, {profile?.full_name || "User"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your orders, view certificates, and update your account
              information.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAccountDialogOpen(true)}
            className="gap-2"
            disabled={!profile}
          >
            <User className="h-4 w-4" />
            Account
          </Button>
        </div>

        {/* Company Documents Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Certifications & Documents
            </CardTitle>
            <CardDescription>
              View our official certificates and compliance documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Management System Certificate */}
              <button
                onClick={() =>
                  window.open(managementSystemCertificate, "_blank")
                }
                className="group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all hover:border-primary hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-medium text-foreground">
                    Management System Certificate
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ISO certification for quality management
                  </p>
                </div>
              </button>

              {/* Free Sale Certificate */}
              <button
                onClick={() => window.open(freeSaleCertificate, "_blank")}
                className="group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all hover:border-primary hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-medium text-foreground">
                    Free Sale Certificate
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Export authorization and compliance
                  </p>
                </div>
              </button>

              {/* Certificate of Competence */}
              <button
                onClick={() => window.open(certificateOfCompetence, "_blank")}
                className="group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all hover:border-primary hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-medium text-foreground">
                    Certificate of Competence
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Professional qualification verification
                  </p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <div className="space-y-6">
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
        </div>
      </main>

      <Footer />

      {/* Account Dialog */}
      <Dialog open={isAccountDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Account Information</DialogTitle>
            <DialogDescription>
              Update your personal details and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <Input
                  value={editedProfile.full_name}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      full_name: e.target.value,
                    })
                  }
                />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  WhatsApp Number
                </label>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Primary Address
                </label>
                <Input
                  value={editedProfile.primary_address}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      primary_address: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Account Type
              </label>
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
                <div className="flex cursor-pointer items-center space-x-2 rounded-2xl border px-4 py-3 transition-colors hover:bg-muted/50">
                  <RadioGroupItem value="business" id="business" />
                  <label
                    htmlFor="business"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Business</span>
                  </label>
                </div>
                <div className="flex cursor-pointer items-center space-x-2 rounded-2xl border px-4 py-3 transition-colors hover:bg-muted/50">
                  <RadioGroupItem value="individual" id="individual" />
                  <label
                    htmlFor="individual"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Individual</span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAccountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Portal
