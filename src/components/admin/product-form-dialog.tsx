import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Star, Upload, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { deleteProductImage, uploadProductImage } from "@/lib/storage"

type Product = Tables<"products"> & { product_images: Tables<"product_images">[] }

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(1000).optional(),
  specifications: z.string().max(5000).optional(),
  price_per_unit: z.coerce.number().min(0, "Price must be positive"),
  is_available: z.boolean(),
  allow_size_selection: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>

export interface ProductFormSubmission {
  values: ProductFormValues
  imageUrls: string[]
}

interface PendingImage {
  key: string
  url: string
  file?: File
  persisted: boolean
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (submission: ProductFormSubmission) => Promise<void>
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
  const [images, setImages] = useState<PendingImage[]>([])
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlMode, setUseUrlMode] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      specifications: "",
      price_per_unit: 0,
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
        specifications: product.specifications || "",
        price_per_unit: product.price_per_unit,
        is_available: product.is_available,
        allow_size_selection: product.allow_size_selection,
      })
      const persistedImages = [...product.product_images]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => ({
          key: image.id,
          url: image.image_url,
          persisted: true,
        }))
      setImages((current) => {
        current.forEach((image) => {
          if (image.file) URL.revokeObjectURL(image.url)
        })
        return persistedImages
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        specifications: "",
        price_per_unit: 0,
        is_available: true,
        allow_size_selection: true,
      })
      setImages((current) => {
        current.forEach((image) => {
          if (image.file) URL.revokeObjectURL(image.url)
        })
        return []
      })
    }
    setRemovedImageUrls([])
    setImageUrlInput("")
    setUseUrlMode(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [open, product, form])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue("name", name)
    if (!isEditing) {
      form.setValue("slug", generateSlug(name))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE)
    if (oversizedFile) {
      toast.error(formatFileSizeError(oversizedFile.size))
      e.target.value = ""
      return
    }

    setImages((current) => [
      ...current,
      ...files.map((file) => ({
        key: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
        persisted: false,
      })),
    ])
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages((current) => {
      const image = current[index]
      if (image.file) URL.revokeObjectURL(image.url)
      if (image.persisted) setRemovedImageUrls((urls) => [...urls, image.url])
      return current.filter((_, imageIndex) => imageIndex !== index)
    })
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    setImages((current) => {
      const next = [...current]
      const [image] = next.splice(from, 1)
      next.splice(to, 0, image)
      return next
    })
  }

  const addImageUrl = () => {
    const parsedUrl = z.string().url().safeParse(imageUrlInput.trim())
    if (!parsedUrl.success) {
      toast.error("Enter a valid image URL")
      return
    }

    setImages((current) => [
      ...current,
      {
        key: crypto.randomUUID(),
        url: parsedUrl.data,
        persisted: false,
      },
    ])
    setImageUrlInput("")
  }

  const handleSubmit = async (values: ProductFormValues) => {
    setIsUploading(true)
    const results = await Promise.allSettled(
      images.map(async (image) => ({
        url: image.file ? await uploadProductImage(image.file, values.slug) : image.url,
        uploaded: !!image.file,
      })),
    )

    const failedUpload = results.find((result) => result.status === "rejected")
    if (failedUpload?.status === "rejected") {
      await Promise.all(
        results.flatMap((result) =>
          result.status === "fulfilled" && result.value.uploaded
            ? [deleteProductImage(result.value.url)]
            : [],
        ),
      )
      toast.error(
        `Image upload failed: ${failedUpload.reason instanceof Error ? failedUpload.reason.message : "Unknown error"}`,
      )
      setIsUploading(false)
      return
    }

    const imageUrls = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value.url] : [],
    )

    try {
      await onSubmit({
        values: {
          ...values,
          description: values.description?.trim() || undefined,
          specifications: values.specifications?.trim() || undefined,
        },
        imageUrls,
      })
      await Promise.all(removedImageUrls.map(deleteProductImage))
    } catch {
      await Promise.all(
        results.flatMap((result) =>
          result.status === "fulfilled" && result.value.uploaded
            ? [deleteProductImage(result.value.url)]
            : [],
        ),
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={handleNameChange} placeholder="e.g. Whole Salmon" />
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
                    <Textarea {...field} placeholder="Product description..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Specifications</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Product specifications..." rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (ETB)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Product Images</label>
                <p className="text-xs text-muted-foreground">
                  The first image is primary. Use the controls to reorder or remove images.
                </p>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div key={image.key} className="overflow-hidden rounded-md border">
                      <div className="relative h-32 bg-muted">
                        <img
                          src={image.url}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {index === 0 ? (
                          <span className="absolute top-2 left-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                            Primary
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between gap-1 p-2">
                        <Button
                          type="button"
                          variant={index === 0 ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => moveImage(index, 0)}
                          disabled={index === 0}
                        >
                          <Star className={`mr-1 h-3 w-3 ${index === 0 ? "fill-current" : ""}`} />
                          {index === 0 ? "Primary" : "Make primary"}
                        </Button>
                        <div className="flex">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => moveImage(index, index - 1)}
                            disabled={index === 0}
                            aria-label="Move image left"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => moveImage(index, index + 1)}
                            disabled={index === images.length - 1}
                            aria-label="Move image right"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {useUrlMode ? (
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={imageUrlInput}
                    onChange={(event) => setImageUrlInput(event.target.value)}
                    placeholder="https://..."
                  />
                  <Button type="button" variant="outline" onClick={addImageUrl}>
                    Add
                  </Button>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
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
                    Choose images
                  </Button>
                </>
              )}

              <button
                type="button"
                onClick={() => setUseUrlMode((current) => !current)}
                className="text-xs text-muted-foreground underline"
              >
                {useUrlMode ? "Upload files instead" : "Add an image URL instead"}
              </button>
            </div>

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Available for purchase</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allow_size_selection"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Allow size selection (100g / 200g / 300g)
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
