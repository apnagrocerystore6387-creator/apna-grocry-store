import { getDb } from '../config/db.js'

export async function getSalesSummary() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT
      COUNT(*) AS orderCount,
      COALESCE(SUM(total_amount), 0) AS totalRevenue,
      COALESCE(AVG(total_amount), 0) AS averageOrderValue,
      COALESCE(SUM(points_earned), 0) AS totalPointsAwarded,
      SUM(status = 'delivered') AS deliveredOrders,
      SUM(status = 'cancelled') AS cancelledOrders
     FROM orders`
  )
  return rows[0]
}

export async function getTopProducts(limit = 10) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT
      p.id,
      p.sku,
      p.name,
      SUM(oi.quantity) AS totalSold,
      COALESCE(SUM(oi.total_price), 0) AS totalRevenue
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     GROUP BY p.id, p.sku, p.name
     ORDER BY totalSold DESC
     LIMIT ?`,
    [limit]
  )
  return rows
}

export async function getLowStockProducts(limit = 10) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, sku, name, quantity, status
     FROM products
     ORDER BY quantity ASC
     LIMIT ?`,
    [limit]
  )
  return rows
}

export async function getCustomerPointsSummary(limit = 5) {
  const db = getDb()
  const [summaryRows] = await db.query(
    `SELECT
      COUNT(*) AS customerCount,
      COALESCE(SUM(points), 0) AS totalPoints,
      COALESCE(MAX(points), 0) AS topPoints
     FROM customers`
  )

  const [topCustomers] = await db.query(
    `SELECT id, name, email, points
     FROM customers
     ORDER BY points DESC
     LIMIT ?`,
    [limit]
  )

  return { ...summaryRows[0], topCustomers }
}
