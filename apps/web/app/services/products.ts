import { Product } from '@/app/services/types';
import { fetchWithAuth } from '@/app/services/api';

export async function getProducts(): Promise<Product[]> {
  return fetchWithAuth("/products")
}

export async function getProduct(id: string): Promise<Product> {
  return fetchWithAuth(`/products/${id}`)
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  return fetchWithAuth("/products", {
    method: "POST",
    body: JSON.stringify(product),
  })
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return fetchWithAuth(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await fetchWithAuth(`/products/${id}`, {
    method: "DELETE",
  })
}
