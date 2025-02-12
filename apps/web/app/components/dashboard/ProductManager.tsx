'use client';

import { toast } from 'sonner';
import ProductForm from '@/app/components/shared/ProductForm';
import { useProducts } from '@/app/hooks/UseProducts';
import { Product } from '@/app/utils/types';

export default function ProductManager() {
  const { addProduct, deleteProduct } = useProducts();

  const handleAddProduct = async (data: Product) => {
    try {
      await addProduct(data);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
}

