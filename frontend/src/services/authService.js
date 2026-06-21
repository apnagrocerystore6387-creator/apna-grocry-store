import { apiRequest } from './apiClient'

export function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export function register(credentials) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export function fetchProfile() {
  return apiRequest('/auth/me')
}
