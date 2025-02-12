import PaymentForm from "../components/PaymentForm"

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="max-w-md mx-auto">
        <PaymentForm />
      </div>
    </div>
  )
}

