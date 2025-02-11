import { fetchWithAuth } from '@/app/services/api';

export async function getPayments(): Promise<any[]> {
  return fetchWithAuth("/payments")
}

export async function getPayment(id: string): Promise<any> {
  return fetchWithAuth(`/payments/${id}`)
}

export async function createPayment(payment: any): Promise<any> {
  return fetchWithAuth("/payments", {
    method: "POST",
    body: JSON.stringify(payment),
  })
}

export async function updatePayment(id: string, payment: any): Promise<any> {
  return fetchWithAuth(`/payments/${id}`, {
    method: "PUT",
    body: JSON.stringify(payment),
  })
}
