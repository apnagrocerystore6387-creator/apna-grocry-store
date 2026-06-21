import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productService'
import { useCart } from '../hooks/useCart'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const response = await fetchProducts()
      setProducts(response?.products || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Customer Shopping Portal</h2>
        <p className="mt-2 text-slate-400">Browse products and add items to your shopping cart.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {loading && <div className="text-slate-400">Loading products...</div>}
        {products.map((product) => (
          <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 h-44 overflow-hidden rounded-2xl bg-slate-950">
              <img
                src={product.image_url || 'https://via.placeholder.com/400x300?text=Product'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
            <p className="mt-1 text-slate-400">Brand: {product.brand || 'N/A'}</p>
            <p className="text-slate-400">Price: ₹{product.selling_price?.toFixed(2) ?? '0.00'}</p>
            <p className="text-slate-400">Stock: {product.quantity}</p>
            <button
              onClick={() => addItem({
                product_id: product.id,
                product_name: product.name,
                unit_price: Number(product.selling_price),
                quantity: 1
              })}
              className="mt-4 w-full rounded-2xl bg-accent px-4 py-3 text-white hover:bg-blue-500"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
