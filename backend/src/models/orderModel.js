import { getDb } from '../config/db.js'

export async function getOrders() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.points_earned, o.delivery_address, o.delivery_instructions, o.created_at,
            c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     ORDER BY o.created_at DESC`
  )
  return rows
}

export async function getOrderById(id) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.points_earned, o.delivery_address, o.delivery_instructions, o.created_at,
            c.id AS customer_id, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone, c.points AS customer_points
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
    [id]
  )
  return rows[0]
}

export async function getOrderItems(orderId) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT oi.id, oi.product_id, p.name AS product_name, p.barcode, oi.quantity, oi.unit_price, oi.total_price
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  )
  return rows
}

export async function createOrder(order, items) {
  const db = getDb()
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      `INSERT INTO orders (customer_id, order_number, status, payment_status, total_amount, points_earned, delivery_address, delivery_instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.customer_id,
        order.order_number,
        order.status,
        order.payment_status,
        order.total_amount,
        order.points_earned || 0,
        order.delivery_address || null,
        order.delivery_instructions || null
      ]
    )

    const orderId = result.insertId

    for (const item of items) {
      if (!item?.product_id || !item?.quantity || item.quantity <= 0) {
        throw new Error('Invalid order item data')
      }

      const [productRows] = await connection.query('SELECT quantity FROM products WHERE id = ?', [item.product_id])
      if (!productRows[0]) {
        throw new Error(`Product not found: ${item.product_id}`)
      }
      if (productRows[0].quantity < item.quantity) {
        throw new Error(`Insufficient stock for product id ${item.product_id}`)
      }

      const totalPrice = item.total_price ?? item.unit_price * item.quantity

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.unit_price, totalPrice]
      )

      await connection.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [item.quantity, item.product_id])
    }

    await connection.commit()
    return orderId
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function updateOrderStatus(id, status) {
  const db = getDb()
  const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id])
  return result.affectedRows > 0
}

export async function findOrderByNumber(orderNumber) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.points_earned, o.delivery_address, o.delivery_instructions, o.created_at,
            c.id AS customer_id, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone, c.address AS customer_address, c.points AS customer_points
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     WHERE o.order_number = ?`,
    [orderNumber]
  )
  return rows[0]
}

export async function deleteOrder(id) {
  const db = getDb()
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()

    const [items] = await connection.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id])
    for (const item of items) {
      await connection.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.product_id])
    }

    await connection.query('DELETE FROM order_items WHERE order_id = ?', [id])
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id])

    await connection.commit()
    return result.affectedRows > 0
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
