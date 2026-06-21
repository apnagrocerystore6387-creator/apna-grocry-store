import { apiRequest } from './apiClient'

export function fetchDeliveryOrders() {
  return apiRequest('/delivery')
}
