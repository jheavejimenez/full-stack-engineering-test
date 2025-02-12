"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const cardElement = elements.getElement(CardElement)

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (error) {
        setError(error.message ?? "An unknown error occurred")
        setProcessing(false)
      } else {
        setProcessing(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your card information to complete the purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="border rounded p-3">
              <CardElement />
            </div>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={!stripe || processing} className="w-full" onClick={handleSubmit}>
          {processing ? "Processing..." : "Pay"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

