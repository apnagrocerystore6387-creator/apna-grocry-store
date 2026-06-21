import { useCart } from '../hooks/useCart'

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>
        <p className="mt-2 text-slate-400">Review items and update quantities before checkout.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        {items.length === 0 ? (
          <p className="text-slate-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product_id} className="rounded-2xl border border-slate-800 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.product_name}</h3>
                    <p className="text-slate-400">Price: ₹{item.unit_price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="rounded-lg border border-rose-500 px-3 py-1 text-sm text-rose-300 hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="rounded-lg border border-slate-700 px-3 py-2"
                  >
                    -
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="rounded-lg border border-slate-700 px-3 py-2"
                  >
                    +
                  </button>
                  <span className="ml-auto text-white">₹{(item.quantity * item.unit_price).toFixed(2)}</span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between text-white">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={clearCart}
                  className="w-full rounded-2xl bg-slate-700 px-4 py-3 text-white hover:bg-slate-600"
                >
                  Clear Cart
                </button>
                <a
                  href="/checkout"
                  className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-3 text-center text-white hover:bg-blue-500"
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
