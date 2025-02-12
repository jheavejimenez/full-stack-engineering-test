"use client"

import { useState } from "react"
import { useCart } from "../hooks/useCart"
import { Product } from '@/app/utils/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`px-4 py-2 rounded ${isAdded ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
    >
      {isAdded ? "Added!" : "Add to Cart"}
    </button>
  )
}

