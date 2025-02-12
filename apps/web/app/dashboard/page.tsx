'use client';

import ProductManager from '../components/dashboard/ProductManager';
import OrderList from '../components/dashboard/OrderList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Merchant Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductManager />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customers Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}