'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import ProductList from './components/store/ProductList';
import Cart from './components/store/Cart';

export default function StorePage() {
  const { user, role } = useAuth();

  return (
    <div className='container mx-auto px-4 py-8'>
      {role !== 'merchant' ? (
         <h1 className='text-3xl font-bold mb-8'>Welcome to Our Store</h1>
      ) : (
        <h1 className='text-3xl font-bold mb-8'>Your Products</h1>
      )}
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='md:w-3/4'>
          <ProductList />
        </div>
        {user && role === 'customer' && (
          <div className='md:w-1/4'>
            <Cart />
          </div>
        )}
      </div>
    </div>
  );
}

