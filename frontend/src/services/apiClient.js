const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('ags_token')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    return { error: data?.message || 'Request failed' }
  }

  return data
}
