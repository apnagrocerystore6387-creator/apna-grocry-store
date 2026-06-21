import { useEffect, useState } from 'react'
import { fetchReportSummary } from '../services/reportService'

export default function ReportingPage() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true)
      setError('')
      const response = await fetchReportSummary()
      if (response?.salesSummary) {
        setReport(response)
      } else {
        setError(response?.error || 'Unable to load report data')
      }
      setLoading(false)
    }

    loadReport()
  }, [])

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">Loading reporting data...</div>
  }

  if (error) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-rose-400">{error}</div>
  }

  if (!report) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Store Reports</h2>
        <p className="mt-2 text-slate-400">Sales, top products, stock alerts, and customer loyalty metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Sales Summary</h3>
          <div className="mt-4 space-y-3 text-slate-300">
            <p>Total orders: <strong className="text-white">{report.salesSummary.orderCount}</strong></p>
            <p>Total revenue: <strong className="text-white">₹{report.salesSummary.totalRevenue.toFixed(2)}</strong></p>
            <p>Average order value: <strong className="text-white">₹{report.salesSummary.averageOrderValue.toFixed(2)}</strong></p>
            <p>Delivered orders: <strong className="text-white">{report.salesSummary.deliveredOrders}</strong></p>
            <p>Cancelled orders: <strong className="text-white">{report.salesSummary.cancelledOrders}</strong></p>
            <p>Total loyalty points awarded: <strong className="text-white">{report.salesSummary.totalPointsAwarded}</strong></p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Customer Loyalty</h3>
          <div className="mt-4 space-y-3 text-slate-300">
            <p>Total customers: <strong className="text-white">{report.customerPoints.customerCount}</strong></p>
            <p>Total loyalty points balance: <strong className="text-white">{report.customerPoints.totalPoints}</strong></p>
            <p>Top customer points: <strong className="text-white">{report.customerPoints.topPoints}</strong></p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Top Products</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Sold</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {report.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 text-slate-200">{product.sku}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.totalSold}</td>
                    <td className="px-4 py-3">₹{product.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Low Stock</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {report.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 text-slate-200">{product.sku}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Top Customer Points</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
            <thead>
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {report.customerPoints.topCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 text-slate-200">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
