const API_BASE_URL = process.env.NESTJS_API_URL || 'http://localhost:8000';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const access_token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers })

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`)
  }

  const text = await response.text()
  if (text) {
    try {
      return JSON.parse(text)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      throw new Error("Invalid response from server")
    }
  }
}
