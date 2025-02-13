"use client"

import { useEffect, useState } from "react"
import ProductCard from "../shared/ProductCard"
import type { Product } from "@/app/utils/types"
import { getProducts, getMerchantProducts } from '@/app/services/products';
import { useAuth } from '@/app/contexts/AuthContext';
import { UserRole } from '@/app/utils/enums';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, role } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = role === UserRole.MERCHANT ? await getMerchantProducts(user?.id) : await getProducts();
        setProducts(fetchedProducts)
      } catch (err) {
        setError("Failed to fetch products")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [user, role])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}