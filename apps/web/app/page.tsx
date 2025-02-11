import ProductList from "./components/store/ProductList"
import Cart from "./components/store/Cart"

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Our Store</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <ProductList />
        </div>
        <div className="md:w-1/4">
          <Cart />
        </div>
      </div>
    </div>
  )
}

