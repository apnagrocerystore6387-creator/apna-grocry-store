import { getDb } from '../config/db.js'

export async function findCustomerByEmail(email) {
  const db = getDb()
  const [rows] = await db.query(
    'SELECT id, name, email, phone, address, points FROM customers WHERE email = ?',
    [email]
  )
  return rows[0]
}

export async function createCustomer(customer) {
  const db = getDb()
  const [result] = await db.query(
    'INSERT INTO customers (name, email, phone, address, points) VALUES (?, ?, ?, ?, ?)',
    [customer.name, customer.email, customer.phone || null, customer.address || null, customer.points || 0]
  )
  return { id: result.insertId, ...customer, points: customer.points || 0 }
}

export async function addCustomerPoints(customerId, pointsToAdd) {
  const db = getDb()
  const [result] = await db.query(
    'UPDATE customers SET points = points + ? WHERE id = ?',
    [pointsToAdd, customerId]
  )
  return result.affectedRows > 0
}
