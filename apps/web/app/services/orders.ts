import { Product } from '@/app/services/types';
import { fetchWithAuth } from '@/app/services/api';

export async function getOrders(): Promise<Product[]> {
  return fetchWithAuth('/orders');
}

export async function addToCart(productId: string): Promise<void> {
  await fetchWithAuth('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromCart(productId: string): Promise<void> {
  await fetchWithAuth('/cart/remove', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function getCart(): Promise<Product[]> {
  return fetchWithAuth('/orders');
}
