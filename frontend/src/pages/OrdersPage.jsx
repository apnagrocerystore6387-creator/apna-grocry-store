import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fetchOrders, updateOrderStatus, trackOrder } from '../services/orderService'

const statusLabels = {
  pending: 'Pending',
  packed: 'Packed',
  out_for_delivery: 'Out For Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
}

const statusColors = {
  pending: 'bg-slate-700 text-slate-200',
  packed: 'bg-blue-700 text-white',
  out_for_delivery: 'bg-indigo-700 text-white',
  delivered: 'bg-emerald-600 text-white',
  cancelled: 'bg-rose-600 text-white'
}

const nextActions = {
  pending: [
    { label: 'Pack Order', status: 'packed' },
    { label: 'Cancel Order', status: 'cancelled' }
  ],
  packed: [
    { label: 'Out For Delivery', status: 'out_for_delivery' },
    { label: 'Cancel Order', status: 'cancelled' }
  ],
  out_for_delivery: [
    { label: 'Mark Delivered', status: 'delivered' }
  ]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  const [trackingError, setTrackingError] = useState('')

  const canManageOrders = user?.roleId !== 3

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    const response = await fetchOrders()
    if (response?.orders) {
      setOrders(response.orders)
    } else {
      setError(response?.error || 'Unable to load orders')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (canManageOrders) {
      loadOrders()
    }
  }, [canManageOrders])

  const handleStatusChange = async (orderId, status) => {
    setActionLoading(orderId)
    setError('')
    const response = await updateOrderStatus(orderId, status)
    if (response?.error) {
      setError(response.error)
    } else {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      )
    }
    setActionLoading(null)
  }

  const handleTrackSubmit = async (event) => {
    event.preventDefault()
    setTrackingResult(null)
    setTrackingError('')
    if (!trackingCode.trim()) {
      setTrackingError('Please enter an order number.')
      return
    }

    const response = await trackOrder(trackingCode.trim())
    if (response?.order) {
      setTrackingResult(response.order)
    } else {
      setTrackingError(response?.error || 'Order not found')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Order Management</h2>
        <p className="mt-2 text-slate-400">Manage order status and let customers track delivery progress.</p>
      </div>

      {canManageOrders && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-slate-400">Pending orders are shown here for cash counter staff.</p>
              <p className="mt-1 text-sm text-slate-500">Use the action buttons to move orders through the packing and delivery workflow.</p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
              Pending orders: {orders.filter((order) => order.status === 'pending').length}
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-slate-400">Loading orders...</p>
          ) : error ? (
            <p className="mt-6 text-rose-400">{error}</p>
          ) : orders.length === 0 ? (
            <p className="mt-6 text-slate-400">No orders available.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">Order {order.order_number}</div>
                      <p className="text-slate-400">{order.customer_name || 'Walk-in customer'}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColors[order.status] || 'bg-slate-700 text-slate-200'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-5">
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-slate-500 text-sm">Total</p>
                      <p className="text-white">₹{order.total_amount.toFixed(2)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-slate-500 text-sm">Points Earned</p>
                      <p className="text-white">{order.points_earned ?? 0}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-slate-500 text-sm">Delivery</p>
                      <p className="text-white truncate max-w-[12rem]">{order.delivery_address || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-slate-500 text-sm">Payment</p>
                      <p className="text-white capitalize">{order.payment_status}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-slate-500 text-sm">Created</p>
                      <p className="text-white">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:flex sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      {nextActions[order.status]?.map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          onClick={() => handleStatusChange(order.id, action.status)}
                          disabled={actionLoading === order.id}
                          className="rounded-2xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                        >
                          {actionLoading === order.id ? 'Updating…' : action.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {order.status === 'cancelled' && 'Order has been cancelled.'}
                      {order.status === 'delivered' && 'Order delivered to customer.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Customer Order Tracking</h3>
        <p className="mt-2 text-slate-400">Enter your order number to track the delivery status.</p>

        <form className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={handleTrackSubmit}>
          <input
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
            placeholder="Order number"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
          />
          <button
            type="submit"
            className="rounded-2xl bg-accent px-6 py-3 text-white hover:bg-blue-500"
          >
            Track
          </button>
        </form>

        {trackingError && <p className="mt-4 text-rose-400">{trackingError}</p>}
        {trackingResult && (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-white text-lg font-semibold">Order {trackingResult.order_number}</div>
                <p className="text-slate-400">{trackingResult.customer_name || 'Walk-in customer'}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColors[trackingResult.status] || 'bg-slate-700 text-slate-200'}`}>
                {statusLabels[trackingResult.status] || trackingResult.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-slate-500 text-sm">Total</p>
                <p className="text-white">₹{trackingResult.total_amount.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-slate-500 text-sm">Payment</p>
                <p className="text-white capitalize">{trackingResult.payment_status}</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-slate-500 text-sm">Placed</p>
                <p className="text-white">{new Date(trackingResult.created_at).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-slate-500 text-sm">Loyalty Points</p>
                <p className="text-white">{trackingResult.customer_points ?? '0'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-900 p-4">
              <p className="text-slate-400 text-sm">Items:</p>
              <ul className="mt-3 space-y-2">
                {trackingResult.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <span className="text-slate-100">{item.product_name} x {item.quantity}</span>
                    <span className="text-slate-400">₹{item.total_price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
