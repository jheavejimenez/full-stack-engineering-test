'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import ProductForm from '@/app/components/shared/ProductForm';
import { deleteProduct, getProduct, updateProduct } from '@/app/services/products';
import { Product } from '@/app/utils/types';

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, role } = useAuth();
  const params = useParams();

  useEffect(() => {
      fetchProduct();
  }, [user, role, router]);

  const fetchProduct = async () => {
    console.log(params.id);
    try {
      const fetchedProduct = await getProduct(params.id as string);
      setProduct(fetchedProduct);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Product) => {
    console.log(data);
    try {
      await updateProduct(params.id, data);
      toast.success('Product updated successfully');
      router.push('/');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <ProductForm initialData={product} onSubmit={handleSubmit} onDelete={handleDelete} />
    </div>
  );
}

