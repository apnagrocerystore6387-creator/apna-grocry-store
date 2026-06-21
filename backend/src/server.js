import path from 'path'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import deliveryRoutes from './routes/deliveryRoutes.js'
import { initDb } from './config/db.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')))

initDb()

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/delivery', deliveryRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
