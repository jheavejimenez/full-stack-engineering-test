"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Product } from "@/app/utils/types"

export async function addToCart(formData: FormData) {
  const productJson = formData.get("product") as string
  const product: Product = JSON.parse(productJson)

  const cartCookie = (await cookies()).get("cart")
  const cart: Product[] = cartCookie ? JSON.parse(cartCookie.value) : []

  cart.push(product)

  (await cookies()).set("cart", JSON.stringify(cart), { httpOnly: true })

  revalidatePath("/")
}

export async function getCart(): Promise<Product[]> {
  const cartCookie = (await cookies()).get("cart")
  return cartCookie ? JSON.parse(cartCookie.value) : []
}

export async function removeFromCart(formData: FormData) {
  const productId = formData.get("productId") as string

  const cartCookie = (await cookies()).get("cart")
  let cart: Product[] = cartCookie ? JSON.parse(cartCookie.value) : []

  cart = cart.filter((item) => item.id !== productId)

  (await cookies()).set("cart", JSON.stringify(cart), { httpOnly: true })

  revalidatePath("/")
}

