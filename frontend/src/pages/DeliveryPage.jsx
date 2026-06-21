import { useEffect, useState } from 'react'
import { fetchDeliveryOrders } from '../services/deliveryService'

export default function DeliveryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDeliveryOrders = async () => {
      setLoading(true)
      setError('')
      const response = await fetchDeliveryOrders()
      if (response?.orders) {
        setOrders(response.orders)
      } else {
        setError(response?.error || 'Unable to load delivery orders')
      }
      setLoading(false)
    }

    loadDeliveryOrders()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Home Delivery</h2>
        <p className="mt-2 text-slate-400">View and manage orders ready for home delivery.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">Loading delivery orders...</div>
      ) : error ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-rose-400">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">No delivery orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">Order {order.order_number}</div>
                  <p className="mt-1 text-slate-400">{order.customer_name || 'Walk-in customer'}</p>
                </div>
                <span className="inline-flex rounded-full bg-indigo-700 px-3 py-1 text-sm font-medium text-white">
                  {order.status.replaceAll('_', ' ')}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-900 p-4">
                  <p className="text-slate-500 text-sm">Delivery Address</p>
                  <p className="text-white">{order.delivery_address || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4">
                  <p className="text-slate-500 text-sm">Instructions</p>
                  <p className="text-white">{order.delivery_instructions || 'None'}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4">
                  <p className="text-slate-500 text-sm">Total</p>
                  <p className="text-white">₹{order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
