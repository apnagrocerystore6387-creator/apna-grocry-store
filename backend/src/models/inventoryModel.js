import { getDb } from '../config/db.js'

export async function getInventoryTransactions() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT it.id, it.product_id, p.name AS product_name, it.transaction_type, it.quantity, it.reference, it.created_by, u.username AS created_by_username, it.created_at
     FROM inventory_transactions it
     LEFT JOIN products p ON p.id = it.product_id
     LEFT JOIN users u ON u.id = it.created_by
     ORDER BY it.created_at DESC`
  )
  return rows
}

export async function createInventoryTransaction(transaction) {
  const db = getDb()
  const [result] = await db.query(
    `INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reference, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [transaction.product_id, transaction.transaction_type, transaction.quantity, transaction.reference, transaction.created_by]
  )
  return { id: result.insertId, ...transaction }
}

export async function getPurchaseOrders() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT po.id, po.purchase_number, po.status, po.total_amount, po.supplier_id, s.name AS supplier_name, po.created_at, po.updated_at
     FROM purchase_orders po
     LEFT JOIN suppliers s ON s.id = po.supplier_id
     ORDER BY po.created_at DESC`
  )
  return rows
}

export async function getPurchaseOrderById(id) {
  const db = getDb()
  const [orders] = await db.query(
    `SELECT po.id, po.purchase_number, po.status, po.total_amount, po.supplier_id, s.name AS supplier_name, po.created_at, po.updated_at
     FROM purchase_orders po
     LEFT JOIN suppliers s ON s.id = po.supplier_id
     WHERE po.id = ?`,
    [id]
  )

  if (!orders[0]) return null

  const [items] = await db.query(
    `SELECT poi.id, poi.product_id, p.name AS product_name, poi.quantity, poi.unit_cost, poi.total_cost
     FROM purchase_order_items poi
     LEFT JOIN products p ON p.id = poi.product_id
     WHERE poi.purchase_order_id = ?`,
    [id]
  )

  return { ...orders[0], items }
}

export async function createPurchaseOrder(order) {
  const db = getDb()
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      `INSERT INTO purchase_orders (supplier_id, purchase_number, status, total_amount)
       VALUES (?, ?, ?, ?)`,
      [order.supplier_id, order.purchase_number, order.status || 'draft', order.total_amount]
    )

    const purchaseOrderId = result.insertId

    for (const item of order.items || []) {
      await connection.query(
        `INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_cost, total_cost)
         VALUES (?, ?, ?, ?, ?)`,
        [purchaseOrderId, item.product_id, item.quantity, item.unit_cost, item.total_cost]
      )
    }

    if (order.status === 'received') {
      for (const item of order.items || []) {
        await connection.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.product_id])
      }
    }

    await connection.commit()
    return await getPurchaseOrderById(purchaseOrderId)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function updatePurchaseOrder(id, order) {
  const db = getDb()
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()

    const [existingRows] = await connection.query('SELECT status FROM purchase_orders WHERE id = ?', [id])
    if (!existingRows[0]) {
      await connection.rollback()
      return null
    }

    const existingStatus = existingRows[0].status

    await connection.query(
      `UPDATE purchase_orders SET supplier_id = ?, purchase_number = ?, status = ?, total_amount = ? WHERE id = ?`,
      [order.supplier_id, order.purchase_number, order.status || existingStatus, order.total_amount, id]
    )

    await connection.query('DELETE FROM purchase_order_items WHERE purchase_order_id = ?', [id])
    for (const item of order.items || []) {
      await connection.query(
        `INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_cost, total_cost)
         VALUES (?, ?, ?, ?, ?)`,
        [id, item.product_id, item.quantity, item.unit_cost, item.total_cost]
      )
    }

    if (existingStatus !== 'received' && order.status === 'received') {
      for (const item of order.items || []) {
        await connection.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.product_id])
      }
    }

    await connection.commit()
    return await getPurchaseOrderById(id)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function deletePurchaseOrder(id) {
  const db = getDb()
  const [result] = await db.query('DELETE FROM purchase_orders WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function adjustProductQuantity(productId, quantityChange) {
  const db = getDb()
  const [result] = await db.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [quantityChange, productId])
  return result.affectedRows > 0
}

export async function getProductStockLevels() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, sku, name, quantity, reorder_level, status FROM products ORDER BY quantity ASC`
  )
  return rows
}
