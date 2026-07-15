import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { useAdminProducts, type ProductWithOptions } from "@/hooks/use-admin-products"
import { formatPrice } from "@/lib/format"
import { ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react"
import { useState } from "react"
import { DeleteProductDialog } from "./delete-product-dialog"
import {
  ProductFormDialog,
  type ProductFormSubmission,
} from "./product-form-dialog"

type Product = ProductWithOptions

export function ProductsTab() {
  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleAvailability,
    createOption,
    updateOption,
    deleteOption,
  } = useAdminProducts()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [newOptionName, setNewOptionName] = useState("")
  const [newOptionPrice, setNewOptionPrice] = useState("")

  const handleAdd = () => {
    setSelectedProduct(null)
    setFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async ({ values, imageUrls }: ProductFormSubmission) => {
    const productValues = {
      ...values,
      description: values.description ?? null,
      specifications: values.specifications ?? null,
    }

    try {
      if (selectedProduct) {
        await updateProduct.mutateAsync({
          id: selectedProduct.id,
          updates: productValues,
          imageUrls,
        })
        toast({ title: "Product updated successfully" })
      } else {
        await createProduct.mutateAsync({ product: productValues, imageUrls })
        toast({ title: "Product created successfully" })
      }
      setFormOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return
    try {
      await deleteProduct.mutateAsync(selectedProduct.id)
      toast({ title: "Product deleted successfully" })
      setDeleteOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleToggleAvailability = async (product: Product) => {
    try {
      await toggleAvailability.mutateAsync({
        id: product.id,
        is_available: !product.is_available,
      })
      toast({
        title: product.is_available ? "Product marked unavailable" : "Product marked available",
        description: product.is_available
          ? "It stays visible to customers but can't be ordered."
          : "Customers can order it again.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleAddOption = async (productId: string) => {
    if (!newOptionName.trim()) return
    try {
      await createOption.mutateAsync({
        product_id: productId,
        name: newOptionName.trim(),
        price_per_unit: newOptionPrice ? Number(newOptionPrice) : null,
      })
      setNewOptionName("")
      setNewOptionPrice("")
      toast({ title: "Option added" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOption = async (optionId: string) => {
    try {
      await deleteOption.mutateAsync(optionId)
      toast({ title: "Option deleted" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading products...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const isExpanded = expandedProductId === product.id
                  const options = product.product_options || []
                  return (
                    <>
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                            {product.name}
                            {options.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ({options.length} options)
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{product.slug}</TableCell>
                        <TableCell>{formatPrice(product.price_per_unit)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={product.is_available}
                            onCheckedChange={() => handleToggleAvailability(product)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${product.id}-options`}>
                          <TableCell colSpan={6} className="bg-muted/30 px-8 py-4">
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Product Options</h4>
                              {options.length > 0 && (
                                <div className="space-y-2">
                                  {options.map((option) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center justify-between rounded border bg-background px-3 py-2"
                                    >
                                      <div className="flex items-center gap-4">
                                        <span className="font-medium">{option.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                          {option.price_per_unit != null
                                            ? formatPrice(option.price_per_unit) + ""
                                            : "Base price"}
                                        </span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleDeleteOption(option.id)}
                                      >
                                        <X className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Option name"
                                  value={newOptionName}
                                  onChange={(e) => setNewOptionName(e.target.value)}
                                  className="max-w-[200px]"
                                />
                                <Input
                                  placeholder="Price (optional)"
                                  type="number"
                                  step="0.01"
                                  value={newOptionPrice}
                                  onChange={(e) => setNewOptionPrice(e.target.value)}
                                  className="max-w-[150px]"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddOption(product.id)}
                                  disabled={!newOptionName.trim() || createOption.isPending}
                                >
                                  <Plus className="mr-1 h-4 w-4" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No products yet. Add your first product to get started.
            </p>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        isSubmitting={createProduct.isPending || updateProduct.isPending}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteProduct.isPending}
      />
    </>
  )
}
