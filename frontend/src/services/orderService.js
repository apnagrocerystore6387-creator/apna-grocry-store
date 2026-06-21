import { apiRequest } from './apiClient'

export function fetchOrders() {
  return apiRequest('/orders')
}

export function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}

export function trackOrder(orderNumber) {
  return apiRequest(`/orders/track?order_number=${encodeURIComponent(orderNumber)}`)
}
