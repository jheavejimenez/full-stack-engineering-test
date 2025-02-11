import { Order } from '@/app/services/types';
import { fetchWithAuth } from '@/app/services/api';

export async function getOrders(): Promise<Order[]> {
  return fetchWithAuth("/orders")
}

export async function getOrder(id: string): Promise<Order> {
  return fetchWithAuth(`/orders/${id}`)
}

export async function createOrder(order: Omit<Order, "id">): Promise<Order> {
  return fetchWithAuth("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  })
}

export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  return fetchWithAuth(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(order),
  })
}

export async function deleteOrder(id: string): Promise<void> {
  await fetchWithAuth(`/orders/${id}`, {
    method: "DELETE",
  })
}

export async function getPendingOrder(): Promise<Order | null> {
  return fetchWithAuth("/orders/pending")
}

export async function addToOrder(productId: string, quantity = 1): Promise<Order> {
  const pendingOrder = await getPendingOrder()

  if (pendingOrder) {
    // Update existing order
    const existingItem = pendingOrder.items.find((item) => item.productId === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      pendingOrder.items.push({ productId, quantity })
    }
    return updateOrder(pendingOrder.id, pendingOrder)
  } else {
    // Create new order
    return createOrder({
      status: "pending",
      items: [{ productId, quantity }],
      totalPrice: 0, // This will be calculated on the server
    })
  }
}

export async function removeFromOrder(productId: string): Promise<Order | null> {
  const pendingOrder = await getPendingOrder()

  if (pendingOrder) {
    pendingOrder.items = pendingOrder.items.filter((item) => item.productId !== productId)
    if (pendingOrder.items.length === 0) {
      await deleteOrder(pendingOrder.id)
      return null
    } else {
      return updateOrder(pendingOrder.id, pendingOrder)
    }
  }

  return null
}

// Replace getCart, addToCart, and removeFromCart with these new functions
export async function getCart(): Promise<Order | null> {
  return getPendingOrder()
}

export { addToOrder as addToCart }
export { removeFromOrder as removeFromCart }