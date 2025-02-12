import { Order } from '@/app/utils/types';
import { fetchWithAuth } from '@/app/services/api';
import { OrderStatus } from '@/app/utils/enums';
import { getProduct } from '@/app/services/products';

export async function getOrder(id: string): Promise<Order> {
  return fetchWithAuth(`/orders/${id}`);
}

export async function getPendingOrder(): Promise<Order[]> {
  return fetchWithAuth('/orders/pending');
}

export async function fetchMerchantOrders(merchantId: number): Promise<Order[]> {
  return fetchWithAuth(`/orders/merchant/${merchantId}`);
}

export async function createOrder(order: Order): Promise<Order> {
  return fetchWithAuth('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  return fetchWithAuth(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(order),
  });
}

export async function updateOrderStatus(id: string, order: Partial<Order>): Promise<Order> {
  return fetchWithAuth(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(order),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  await fetchWithAuth(`/orders/${id}`, {
    method: 'DELETE',
  });
}

export async function addToOrder(productId: string, quantity = 1): Promise<Order> {
  const pendingOrders = await getPendingOrder();
  let pendingOrder = pendingOrders.find((order) => order.status === OrderStatus.PENDING);

  const product = await getProduct(productId);

  if (pendingOrder) {
    if (!pendingOrder.items) {
      pendingOrder.items = [];
    }

    const existingItem = pendingOrder.items.find((item) => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      pendingOrder.items.push({
        quantity,
        price: product.price,
        product: {
          id: productId,
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
        },
      });
    }
    pendingOrder.totalPrice = pendingOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return updateOrder(pendingOrder.id, pendingOrder);
  } else {
    const newOrder = {
      status: OrderStatus.PENDING,
      items: [
        {
          quantity,
          price: product.price,
          created_at: new Date().toISOString(),
          product: {
            id: productId,
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
          },
        },
      ],
      totalPrice: product.price * quantity,
    };
    return createOrder(newOrder);
  }
}

export async function removeFromOrder(productId: string): Promise<Order | null> {
  const orders = await getPendingOrder(); // This returns an array of orders
  const pendingOrder = orders.find((order) => order.status === 'pending'); // Find the pending order

  if (pendingOrder) {
    if (!pendingOrder.items) {
      pendingOrder.items = []; // Initialize items if undefined
    }

    // Filter out the item to be removed
    pendingOrder.items = pendingOrder.items.filter((item) => item.product.id !== productId);

    if (pendingOrder.items.length === 0) {
      // If no items remain, delete the order
      await deleteOrder(pendingOrder.id);
      return null;
    } else {
      // Otherwise, update the order
      return updateOrder(pendingOrder.id, pendingOrder);
    }
  }

  // Return null if no pending order exists
  return null;
}
