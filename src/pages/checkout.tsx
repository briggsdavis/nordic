import Footer from "@/components/footer"
import Header from "@/components/header"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { useOrders } from "@/hooks/use-orders"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { supabase } from "@/integrations/supabase/client"
import { formatPrice } from "@/lib/format"
import { AlertTriangle, ArrowLeft, Check, Copy, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const Checkout = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { cartItems, cartTotal, clearCart, getVariantPrice, hasUnavailableItems } = useCart()
  const { createOrder } = useOrders()
  const { data: siteSettings } = useSiteSettings()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    contactName: profile?.full_name || "",
    contactPhone: profile?.phone_number || "",
    deliveryAddress: profile?.primary_address || "",
    additionalComments: "",
    locationDescription: "",
    preferredDeliveryTime: "",
  })
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const expectedDeliveryDate = new Date()
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3)

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
        })
        e.target.value = "" // Reset input
        return
      }
      setPaymentFile(file)
    }
  }

  const handleSubmitClick = () => {
    if (!formData.contactName || !formData.contactPhone || !formData.deliveryAddress) {
      return
    }
    if (hasUnavailableItems) {
      toast({
        variant: "destructive",
        title: "Unavailable items in cart",
        description: "Please remove unavailable items before placing your order.",
      })
      return
    }
    setShowWarning(true)
  }

  const handleConfirmSubmit = async () => {
    setShowWarning(false)
    setIsUploading(true)

    try {
      let paymentReceiptPath: string | undefined

      if (paymentFile && user) {
        const filePath = `${user.id}/receipts/${Date.now()}-${paymentFile.name}`
        const { error: uploadError } = await supabase.storage
          .from("order-files")
          .upload(filePath, paymentFile)

        if (uploadError) throw uploadError

        // Store path instead of URL (private bucket)
        paymentReceiptPath = filePath
      }

      const items = cartItems.map((item) => ({
        productId: item.product_id,
        productName: item.product?.name || "Unknown Product",
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: item.product
          ? getVariantPrice(item.variant, item.product.price_per_unit, item.option?.price_per_unit)
          : 0,
        optionId: item.option_id,
        optionName: item.option?.name || null,
      }))

      await createOrder.mutateAsync({
        items,
        deliveryAddress: formData.deliveryAddress,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        additionalComments: formData.additionalComments || undefined,
        locationDescription: formData.locationDescription || undefined,
        preferredDeliveryTime: formData.preferredDeliveryTime || undefined,
        paymentReceiptUrl: paymentReceiptPath,
      })

      await clearCart.mutateAsync()
      navigate("/portal?tab=orders")
    } catch (error) {
      console.error("Order submission failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) {
    navigate("/auth?returnTo=/checkout")
    return null
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="py-12 text-center">
            <h1 className="mb-4 font-serif text-2xl">Your cart is empty</h1>
            <Button onClick={() => navigate("/#collection")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <Button variant="ghost" className="mb-8 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="mb-8 font-serif text-3xl">Order Confirmation</h1>

        {/* Bank Payment Instructions */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              Bank Transfer Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To complete your order, transfer the amount below to our bank account. Then upload
              your proof of payment in the form below before submitting.
            </p>

            {/* Highlighted Total */}
            <div className="rounded-xl bg-primary/10 px-6 py-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-widest text-primary">
                Amount to Transfer
              </p>
              <p className="font-serif text-4xl font-medium text-primary">
                {formatPrice(cartTotal)}
              </p>
            </div>

            {/* Bank Details */}
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              {[
                {
                  label: "Account Holder",
                  value: siteSettings?.bank_account_holder ?? "Nordic Seafood Imports",
                  field: "holder",
                },
                {
                  label: "Account Number",
                  value: siteSettings?.bank_account_number ?? "1000693338623",
                  field: "account",
                },
                {
                  label: "Bank Name",
                  value: siteSettings?.bank_name ?? "Commercial Bank of Ethiopia",
                  field: "bank",
                },
              ].map(({ label, value, field }) => (
                <div key={field} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-mono font-medium text-foreground">{value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(value, field)}
                    className="flex-shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={`Copy ${label}`}
                  >
                    {copiedField === field ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Delivery Information */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name *</label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactName: e.target.value,
                        })
                      }
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number *</label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+1 234 567 8900"
                      type="tel"
                      pattern="^\+?[\d\s\-().]{7,20}$"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address *</label>
                  <Textarea
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: e.target.value,
                      })
                    }
                    placeholder="Full delivery address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Description</label>
                  <Textarea
                    value={formData.locationDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationDescription: e.target.value,
                      })
                    }
                    placeholder="Any additional directions or landmarks..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Delivery Time</label>
                  <Input
                    value={formData.preferredDeliveryTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredDeliveryTime: e.target.value,
                      })
                    }
                    placeholder="e.g., Morning 9-12, Afternoon 2-5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Comments</label>
                  <Textarea
                    value={formData.additionalComments}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalComments: e.target.value,
                      })
                    }
                    placeholder="Any special instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Receipt *</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`rounded-2xl border-2 border-dashed ${!paymentFile ? "border-muted-foreground/50" : "border-primary"}`}
                >
                  <input
                    type="file"
                    id="payment-file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="payment-file"
                    className="flex w-full cursor-pointer flex-col items-center gap-2 p-6 text-center"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        document.getElementById("payment-file")?.click()
                      }
                    }}
                  >
                    <Upload
                      className={`h-8 w-8 ${paymentFile ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {paymentFile ? (
                      <span className="text-sm font-medium text-primary">{paymentFile.name}</span>
                    ) : (
                      <>
                        <span className="text-sm font-medium">Upload Payment Receipt</span>
                        <span className="text-xs text-muted-foreground">
                          Required - Click to upload image or PDF
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const price = item.product
                    ? getVariantPrice(
                        item.variant,
                        item.product.price_per_unit,
                        item.option?.price_per_unit,
                      )
                    : 0

                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product?.name}
                        {item.option?.name ? ` - ${item.option.name}` : ""} ({item.variant}) ×{" "}
                        {item.quantity}
                      </span>
                      <span>{formatPrice(price * item.quantity)}</span>
                    </div>
                  )
                })}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Expected Delivery</span>
                    <span>{expectedDeliveryDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmitClick}
                  disabled={
                    isUploading ||
                    !formData.contactName ||
                    !formData.contactPhone ||
                    !formData.deliveryAddress ||
                    !paymentFile ||
                    hasUnavailableItems
                  }
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Your Information
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please note that your information has to be correct. Review your delivery address,
              contact details, and order items before proceeding. Make sure everything is accurate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Confirm & Place Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Checkout
