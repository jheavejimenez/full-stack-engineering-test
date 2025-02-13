'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderList from '@/app/components/shared/OrderList';

export default function UserDashboardPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Your Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderList />
        </CardContent>
      </Card>
    </div>
  );
}

