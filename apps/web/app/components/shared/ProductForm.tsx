"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { z } from "zod"
import { productSchema, ProductFormData } from '@/app/utils/productSchema';


interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export default function ProductForm({ initialData, onSubmit, onDelete }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    description: initialData?.description || "",
  })
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      const validatedData = productSchema.parse(formData)
      await onSubmit(validatedData)
      toast.success(initialData?.id ? "Product updated successfully" : "Product added successfully")
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors)
      } else {
        console.error("Submission failed:", error)
        toast.error("Failed to submit product. Please try again.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (onDelete && formData.id) {
      setIsProcessing(true)
      try {
        await onDelete(formData.id)
        toast.success("Product deleted successfully")
      } catch (error) {
        console.error("Deletion failed:", error)
        toast.error("Failed to delete product. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="50"
                value={formData.price}
                onChange={handleChange}
                required
              />
              {errors.price && <p className="text-sm font-medium text-destructive">{errors.price}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              {errors.stock && <p className="text-sm font-medium text-destructive">{errors.stock}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {errors.description && <p className="text-sm font-medium text-destructive">{errors.description}</p>}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {initialData?.id ? "Update Product" : "Add Product"}
        </Button>
        {initialData?.id && (
          <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
            Delete Product
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

