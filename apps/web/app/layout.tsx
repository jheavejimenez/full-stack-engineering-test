import "./globals.css"
import { Inter } from "next/font/google"
import Layout from "./components/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import type React from "react"
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-commerce Platform",
  description: "A comprehensive e-commerce platform with customer store and merchant dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'