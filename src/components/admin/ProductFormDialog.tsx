import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Tables } from "@/integrations/supabase/types"
import { MAX_FILE_SIZE, formatFileSizeError } from "@/lib/format"
import {
  deleteProductImage,
  isSupabaseStorageUrl,
  uploadProductImage,
} from "@/lib/storage"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

type Product = Tables<"products">

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(1000).optional(),
  weight_range: z.string().max(50).optional(),
  price_per_kg: z.coerce.number().min(0, "Price must be positive"),
  image_url: z.string().url().optional().or(z.literal("")),
  is_available: z.boolean(),
  allow_size_selection: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (values: ProductFormValues) => void
  isSubmitting: boolean
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting,
}: ProductFormDialogProps) {
  const isEditing = !!product
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlMode, setUseUrlMode] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      weight_range: "",
      price_per_kg: 0,
      image_url: "",
      is_available: true,
      allow_size_selection: true,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        weight_range: product.weight_range || "",
        price_per_kg: product.price_per_kg,
        image_url: product.image_url || "",
        is_available: product.is_available,
        allow_size_selection: product.allow_size_selection,
      })
      setImagePreview(product.image_url || null)
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        weight_range: "",
        price_per_kg: 0,
        image_url: "",
        is_available: true,
        allow_size_selection: true,
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setUseUrlMode(false)
  }, [product, form])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue("name", name)
    if (!isEditing) {
      form.setValue("slug", generateSlug(name))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error(formatFileSizeError(file.size))
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    form.setValue("image_url", "")
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    form.setValue("image_url", "")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (values: ProductFormValues) => {
    let imageUrl = values.image_url || undefined

    if (imageFile) {
      const slug = values.slug
      if (!slug) {
        toast.error("Slug is required to upload an image")
        return
      }

      setIsUploading(true)
      try {
        // Delete old Supabase image if replacing
        const oldUrl = product?.image_url
        if (oldUrl && isSupabaseStorageUrl(oldUrl)) {
          await deleteProductImage(oldUrl)
        }

        imageUrl = await uploadProductImage(imageFile, slug)
      } catch (err) {
        toast.error(
          `Image upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        )
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    onSubmit({
      ...values,
      description: values.description || undefined,
      weight_range: values.weight_range || undefined,
      image_url: imageUrl,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={handleNameChange}
                      placeholder="e.g. Whole Salmon"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. whole-salmon" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight Range</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 4-6 kg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per kg (NOK)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Image</label>

              {(imagePreview || form.watch("image_url")) && (
                <div className="relative w-full h-40 rounded-md overflow-hidden border">
                  <img
                    src={imagePreview || form.watch("image_url")}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {useUrlMode ? (
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {imageFile ? imageFile.name : "Choose image"}
                  </Button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setUseUrlMode(!useUrlMode)
                  setImageFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="text-xs text-muted-foreground underline"
              >
                {useUrlMode ? "Upload a file instead" : "Paste URL instead"}
              </button>
            </div>

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Available for purchase
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allow_size_selection"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Allow size selection (100g / 200g / 300g)
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isUploading
                  ? "Uploading..."
                  : isSubmitting
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
