import { createContext, useState } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product) => {
    setItems((current) => {
      const existing = current.find((item) => item.product_id === product.product_id)
      if (existing) {
        return current.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      }
      return [...current, product]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setItems((current) =>
      current
        .map((item) => (item.product_id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.product_id !== productId))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}
