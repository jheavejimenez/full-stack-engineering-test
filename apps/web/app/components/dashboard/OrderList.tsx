import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { fetchMerchantOrders } from '@/app/services/orders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Order } from '@/app/utils/types';



export default function OrderList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      fetchMerchantOrders(user.id).then(setOrders);
    }
  }, [user]);

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {order.status}</p>
            <p>Total Price: ${Number(order.totalPrice).toFixed(2)}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  Quantity: {item.quantity}, Price: ${Number(item.price).toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}