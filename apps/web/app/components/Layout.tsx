import type React from "react"
import Navbar from "./Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-100 py-4 text-center">
        <p>&copy; 2025 Our E-commerce Platform. Modulus lab.</p>
      </footer>
    </div>
  )
}

