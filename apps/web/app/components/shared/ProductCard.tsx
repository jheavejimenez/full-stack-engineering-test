'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { Product } from '@/app/utils/types';
import { addToOrder } from '@/app/services/orders';
import { UserRole } from '@/app/utils/enums';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps): JSX.Element {
  const [isAdding, setIsAdding] = useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      router.push('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addToOrder(product.id);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.log(err)
      toast.error('Failed to add to cart. Please try again.', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRedirect = () => {
    router.push(`/dashboard/merchant/edit-product/${product.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>{product.description}</p>
        <p className='mt-2 text-lg font-bold'>${Number(product.price).toFixed(2)}</p>
        <p className='mt-2 text-sm text-muted-foreground'>Stock: {product.stock}</p>
      </CardContent>
      <CardFooter>
        {role === UserRole.MERCHANT ? (
          <Button className='w-full' onClick={handleRedirect}>
            Edit
          </Button>
        ) : (
          <Button onClick={handleAddToCart} disabled={isAdding} className='w-full'>
            {isAdding ? 'Processing...' : 'Add to Cart'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
