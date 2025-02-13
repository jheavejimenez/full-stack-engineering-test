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


export async function removeFromOrder(orderItemId: string): Promise<Order | null> {
  const orders = await getPendingOrder();
  const pendingOrder = orders.find((order) => order.status === OrderStatus.PENDING);

  if (pendingOrder) {
    if (!pendingOrder.items) {
      pendingOrder.items = [];
    }

    const product = pendingOrder.items.find((item) => item.id === orderItemId);

    if (product) {
      if (product.quantity - 1 === 0) {
        product.quantity = 0;
        await updateOrder(pendingOrder.id, pendingOrder);
        await deleteOrder(pendingOrder.id);
        return pendingOrder;
      } else {
        product.quantity -= 1;
        return updateOrder(pendingOrder.id, pendingOrder);
      }
    }
  }
}
