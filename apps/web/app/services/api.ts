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
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json()
}
