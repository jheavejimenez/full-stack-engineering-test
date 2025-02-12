'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/app/utils/types';
import { deleteProduct, getMerchantProducts, updateProduct, createProduct } from '@/app/services/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getMerchantProducts();
    setProducts(fetchedProducts);
  };

  const addNewProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = await createProduct(product);
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const updateExistingProduct = async (product: Product) => {
    const updatedProduct = await updateProduct(product.id, product);
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteExistingProduct = async (productId: string) => {
    await deleteProduct(productId);
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
  };

  return {
    products,
    addProduct: addNewProduct,
    updateProduct: updateExistingProduct,
    deleteProduct: deleteExistingProduct,
  };
}