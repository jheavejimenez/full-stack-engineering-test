"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/app/contexts/AuthContext"
import { toast } from "sonner"
import { Order } from '@/app/utils/types';
import { getCart, removeFromCart } from '@/app/services/orders';

export default function Cart() {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, role } = useAuth()

  useEffect(() => {
    async function fetchCart() {
      if (user && role === "customer") {
        try {
          const fetchedOrder = await getCart()
          setOrder(fetchedOrder)
        } catch (err) {
          toast.error("Failed to fetch cart")
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [user, role])

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const updatedOrder = await removeFromCart(productId)
      setOrder(updatedOrder)
      toast.success("Item removed from cart")
    } catch (err) {
      toast.error("Failed to remove item from cart")
    }
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (!user || role !== "customer") {
    return (
      <Card>
        <CardContent>
          <p className="text-center py-4">Please log in as a customer to view your cart.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) return <div>Loading cart...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {!order || order.items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center">
                <span>{item.product.name}</span>
                <div>
                  <span className="mr-2">
                    ${item.product.price.toFixed(2)} x {item.quantity}
                  </span>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveFromCart(item.productId)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {order && order.items.length > 0 && (
        <CardFooter className="flex-col items-stretch">
          <div className="mb-4 text-right">
            <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
          </div>
          <Button onClick={handleCheckout}>Proceed to Checkout</Button>
        </CardFooter>
      )}
    </Card>
  )
}

