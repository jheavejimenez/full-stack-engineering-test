import { Product } from '@/app/services/types';
import { fetchWithAuth } from '@/app/services/api';

export async function getProducts(): Promise<Product[]> {
  return fetchWithAuth('/products');
}
