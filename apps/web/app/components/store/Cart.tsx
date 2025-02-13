'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { getPendingOrder, removeFromOrder } from '@/app/services/orders';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/app/utils/types';

export default function Cart(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, role } = useAuth();

  const fetchCustomerOrders = async (retries = 5, delay = 1000) => {
    if (user && role === 'customer') {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const fetchedOrder = await getPendingOrder();
          setOrders(fetchedOrder);
          setIsLoading(false);
          return; // Exit function after successful fetch
        } catch (err) {
          // If the last retry fails, show the toast error
          if (attempt === retries - 1) {
            toast('Failed to fetch cart after multiple attempts.');
          } else {
            // Wait for the exponential backoff delay
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // Double the delay for the next retry
          }
        }
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let pollingInterval;

    async function startPolling() {
      await fetchCustomerOrders();

      // Set up polling interval
      pollingInterval = setInterval(async () => {
        await fetchCustomerOrders();
      }, 10000); // Poll every 10 seconds
    }

    startPolling();

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const handleRemoveFromCart = async (orderItemId: string) => {
    try {
      const updatedOrder = await removeFromOrder(orderItemId);
      setOrders((prevOrders) => {
        if (updatedOrder === null) {
          return [];
        }
        return prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order));
      });
      if (updatedOrder === null) {
        toast.success('Order removed from cart');
      } else {
        toast.success('Item removed from cart');
      }
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
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className='text-center text-muted-foreground'>Your cart is empty</p>
        ) : (
          <ScrollArea className='h-[300px] pr-4'>
            {orders?.map((order) => (
              <div key={order.id}>
                <h3 className='font-semibold mb-2'>Order #{order.id.slice(-6)}</h3>
                {order.items.map((item) => (
                  <div key={item.id} className='flex justify-between items-center mb-4'>
                    <div>
                      <p className='font-medium'>{item.product.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        ${Number.parseFloat(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <p className='font-medium mr-2'>${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      <Button variant='ghost' size='icon' onClick={() => handleRemoveFromCart(item.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator className='my-4' />
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
      {orders.length > 0 && (
        <CardFooter className='flex-col items-stretch mt-4'>
          <div className='flex justify-between items-center mb-4'>
            <p className='font-semibold'>Total:</p>
            <p className='font-bold text-lg'>
              ${orders.reduce((total, order) => total + Number.parseFloat(order.totalPrice), 0).toFixed(2)}
            </p>
          </div>
          <Button onClick={handleCheckout} className='w-full'>
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
