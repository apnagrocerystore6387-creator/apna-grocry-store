import { apiRequest } from './apiClient'

export function fetchReportSummary() {
  return apiRequest('/reports/summary')
}
