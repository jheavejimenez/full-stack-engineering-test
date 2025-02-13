import { JSX, useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { fetchMerchantOrders, getPendingOrder, updateOrderStatus } from '@/app/services/orders';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/app/utils/types';
import { toast } from 'sonner';
import { Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus, UserRole } from '@/app/utils/enums';


export default function OrderList(): JSX.Element {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pendingOrders = orders.filter((order) => order.status === OrderStatus.PENDING);
  const shippedOrders = orders.filter((order) => order.status === OrderStatus.SHIPPED);
  const deliveredOrders = orders.filter((order) => order.status === OrderStatus.COMPLETED);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (user) {
        const orders = role === UserRole.MERCHANT ? await fetchMerchantOrders(user?.id) : await getPendingOrder();
        setOrders(orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };
  const handleOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, { status: status });
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
          <span>Order #{order.id.slice(-6)}</span>
          <Badge variant={order.status === OrderStatus.PENDING ? 'secondary' : 'success'}>{order.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='font-bold mt-2'>Total: ${Number(order.totalPrice).toFixed(2)}</p>
        <ul className='mt-2'>
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </CardContent>
      {role === UserRole.MERCHANT ? (
        <CardFooter>
          {
            order.status === OrderStatus.PENDING &&
            <Button onClick={() => handleOrderStatus(order.id, OrderStatus.SHIPPED)}>Mark as Shipped</Button>
          }
        </CardFooter>
      ) : (
        <CardFooter>
          {
            order.status ===  OrderStatus.SHIPPED &&
            <Button onClick={() => handleOrderStatus(order.id, OrderStatus.COMPLETED)}>Mark as Received</Button>
          }
        </CardFooter>
      )}
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
