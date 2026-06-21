import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartSummary from '../components/CartSummary'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!customer.name || !customer.email || items.length === 0) {
      setError('Please complete customer details and add items to the cart.')
      return
    }

    setLoading(true)
    try {
      const orderNumber = `AGS-${Date.now()}`
      const response = await fetch('http://localhost:4000/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ags_token')}`
        },
        body: JSON.stringify({
          customer,
          items,
          order_number: orderNumber,
          payment_status: 'paid',
          total_amount: total
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Checkout failed')

      setSuccess(`Checkout completed successfully. You earned ${data.pointsEarned} loyalty points.`)
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Checkout</h2>
        <p className="mt-2 text-slate-400">Enter customer details and submit the order.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Customer Details</h3>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Customer name"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
            />
            <input
              type="email"
              value={customer.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Customer email"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
            />
            <input
              type="text"
              value={customer.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
            />
            <textarea
              value={customer.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows="4"
              placeholder="Address"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Order Summary</h3>
          <div className="mt-4">
            <CartSummary />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white">
            <div className="flex justify-between">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-400">{success}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            className="mt-6 w-full rounded-2xl bg-accent px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Complete Checkout'}
          </button>
        </div>
      </div>
    </div>
  )
}
