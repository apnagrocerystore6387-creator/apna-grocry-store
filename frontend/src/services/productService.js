import { apiRequest } from './apiClient'

export function fetchProducts() {
  return apiRequest('/products')
}

export function fetchProduct(id) {
  return apiRequest(`/products/${id}`)
}
