import "./globals.css"
import { Inter } from "next/font/google"
import Layout from "./components/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-commerce Platform",
  description: "A comprehensive e-commerce platform with customer store and merchant dashboard",
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
        </AuthProvider>
      </body>
    </html>
  )
}

