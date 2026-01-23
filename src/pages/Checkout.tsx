import Footer from "@/components/Footer"
import Header from "@/components/Header"
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
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"
import { supabase } from "@/integrations/supabase/client"
import { AlertTriangle, ArrowLeft, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const Checkout = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { cartItems, cartTotal, clearCart, getVariantPrice } = useCart()
  const { createOrder } = useOrders()
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

  const expectedDeliveryDate = new Date()
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
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
    if (
      !formData.contactName ||
      !formData.contactPhone ||
      !formData.deliveryAddress
    ) {
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
          ? getVariantPrice(item.variant, item.product.price_per_kg)
          : 0,
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
        <Button
          variant="ghost"
          className="mb-8 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="mb-8 font-serif text-3xl">Order Confirmation</h1>

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
                    <label className="text-sm font-medium">
                      Contact Name *
                    </label>
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
                    <label className="text-sm font-medium">
                      Phone Number *
                    </label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Delivery Address *
                  </label>
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
                  <label className="text-sm font-medium">
                    Location Description
                  </label>
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
                  <label className="text-sm font-medium">
                    Preferred Delivery Time
                  </label>
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
                  <label className="text-sm font-medium">
                    Additional Comments
                  </label>
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
                  className={`rounded-lg border-2 border-dashed p-6 text-center ${!paymentFile ? "border-muted-foreground/50" : "border-primary"}`}
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
                    className="flex cursor-pointer flex-col items-center gap-2"
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
                      <span className="text-sm font-medium text-primary">
                        {paymentFile.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-medium">
                          Upload Payment Receipt
                        </span>
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
                    ? getVariantPrice(item.variant, item.product.price_per_kg)
                    : 0

                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product?.name} ({item.variant}) × {item.quantity}
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
                    !paymentFile
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
              Please note that your information has to be correct. Review your
              delivery address, contact details, and order items before
              proceeding. Make sure everything is accurate.
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
