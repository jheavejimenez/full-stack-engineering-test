"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import type React from "react"

export default function CustomerRoute({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (role !== "customer") {
      router.push("/dashboard")
    }
  }, [user, role, router])

  if (!user || role !== "customer") {
    return null
  }

  return <>{children}</>
}

