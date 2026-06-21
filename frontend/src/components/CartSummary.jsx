import { useCart } from '../hooks/useCart'

export default function CartSummary() {
  const { items, total, removeItem, updateQuantity } = useCart()

  if (items.length === 0) {
    return <div className="text-slate-400">Cart is empty</div>
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.product_id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-white">{item.product_name}</div>
              <div className="text-slate-400">₹{item.unit_price.toFixed(2)} each</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                className="rounded-lg border border-slate-700 px-2 py-1"
              >
                -
              </button>
              <span className="text-white">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                className="rounded-lg border border-slate-700 px-2 py-1"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-slate-300">
            <span>Total</span>
            <span>₹{(item.quantity * item.unit_price).toFixed(2)}</span>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.product_id)}
            className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-500"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <div className="flex justify-between text-white">
          <span>Grand Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
