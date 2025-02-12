import { JSX, useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { fetchMerchantOrders, updateOrderStatus } from '@/app/services/orders';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/app/utils/types';
import { toast } from 'sonner';
import { Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@/app/utils/enums';


export default function OrderList(): JSX.Element {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const shippedOrders = orders.filter((order) => order.status === 'shipped');
  const deliveredOrders = orders.filter((order) => order.status === 'delivered');

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (user) {
        const orders = await fetchMerchantOrders(user.id);
        setOrders(orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };
  const handleShipOrder = async (orderId: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, { status: OrderStatus.SHIPPED });
      setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)));
      toast.success('Order status updated to shipped');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };
  if (isLoading) return <div>Loading orders...</div>;


  const renderOrderCard = (order: Order) => (
    <Card key={order.id}>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <span>Order #{order.id}</span>
          <Badge variant={order.status === 'pending' ? 'secondary' : 'success'}>{order.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='font-bold mt-2'>Total: ${Number(order.totalPrice).toFixed(2)}</p>
        <ul className='mt-2'>
          {order.items.map((item) => (
            <li key={item.id}>
             Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {order.status === 'pending' && <Button onClick={() => handleShipOrder(order.id)}>Mark as Shipped</Button>}
      </CardFooter>
    </Card>
  );


  return (
    <Tabs defaultValue='pending' className='w-full'>
      <TabsList>
        <TabsTrigger value='pending'>Pending ({pendingOrders.length})</TabsTrigger>
        <TabsTrigger value='shipped'>Shipped ({shippedOrders.length})</TabsTrigger>
        <TabsTrigger value='delivered'>Delivered ({deliveredOrders.length})</TabsTrigger>
      </TabsList>
      <TabsContent value='pending' className='space-y-4'>
        {pendingOrders.map(renderOrderCard)}
      </TabsContent>
      <TabsContent value='shipped' className='space-y-4'>
        {shippedOrders.map(renderOrderCard)}
      </TabsContent>
      <TabsContent value='delivered' className='space-y-4'>
        {deliveredOrders.map(renderOrderCard)}
      </TabsContent>
    </Tabs>
  );
}