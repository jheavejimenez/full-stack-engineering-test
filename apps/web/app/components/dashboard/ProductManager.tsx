'use client';

import ProductForm from '@/app/components/shared/ProductForm';
import { Product } from '@/app/utils/types';
import { createProduct } from '@/app/services/products';

export default function ProductManager() {

  const handleAddProduct = async (data: Product) => {
    try {
      await createProduct(data);
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

