import { Product } from '@/app/utils/types';
import { fetchWithAuth } from '@/app/services/api';

export async function getProducts(): Promise<Product[]> {
  return fetchWithAuth('/products');
}

export async function getProduct(id: string): Promise<Product> {
  return fetchWithAuth(`/products/${id}`);
}

export async function getMerchantProduct(id: string): Promise<Product> {
  return fetchWithAuth(`/products/${id}/merchant`);
}

export async function getMerchantProducts(): Promise<Product[]> {
  return fetchWithAuth(`/products/merchant`);
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  return fetchWithAuth('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return fetchWithAuth(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetchWithAuth(`/products/${id}`, {
    method: "DELETE",
  })


}
