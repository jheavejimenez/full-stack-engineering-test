'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { Order } from '@/app/utils/types';
import { getPendingOrder, removeFromOrder } from '@/app/services/orders';

export default function Cart(): JSX.Element {
  const [order, setOrder] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, role } = useAuth();

  useEffect(() => {
    fetchCustomerOrders();
  }, [user, role]);

  const fetchCustomerOrders = async () => {
    try {
      if (user) {
        const orders = await getPendingOrder();
        setOrder(orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const updatedOrder = await removeFromOrder(productId);
      setOrder(updatedOrder);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (!user || role !== 'customer') {
    return (
      <Card>
        <CardContent>
          <p className='text-center py-4'>Please log in as a customer to view your cart.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) return <div>Loading cart...</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {!order || order.length === 0 || order[0].items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-2">
            {order[0].items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>{item.product.name}</span>
                <div>
            <span className="mr-2">
              ${Number(item.product.price).toFixed(2)} x {item.quantity}
            </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {order && order.length > 0 && order[0].items.length > 0 && (
        <CardFooter className="flex-col items-stretch">
          <div className="mb-4 text-right">
            <strong>Total: ${order[0].items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</strong>
          </div>
          <Button onClick={handleCheckout}>Proceed to Checkout</Button>
        </CardFooter>
      )}
    </Card>
  );
}
