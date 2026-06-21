import { getDb } from '../config/db.js'

export async function getAllProducts() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, sku, name, brand, category, purchase_price, selling_price, mrp, gst, barcode, quantity, image_url, status
     FROM products ORDER BY id DESC`
  )
  return rows
}

export async function getProductById(id) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, sku, name, brand, category, purchase_price, selling_price, mrp, gst, barcode, quantity, image_url, status
     FROM products WHERE id = ?`,
    [id]
  )
  return rows[0]
}

export async function createProduct(product) {
  const db = getDb()
  const [result] = await db.query(
    `INSERT INTO products (sku, name, brand, category, purchase_price, selling_price, mrp, gst, barcode, quantity, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.sku,
      product.name,
      product.brand,
      product.category,
      product.purchase_price,
      product.selling_price,
      product.mrp,
      product.gst,
      product.barcode,
      product.quantity,
      product.image_url,
      product.status || 'active'
    ]
  )
  return { id: result.insertId, ...product }
}

export async function updateProduct(id, product) {
  const db = getDb()
  await db.query(
    `UPDATE products SET sku = ?, name = ?, brand = ?, category = ?, purchase_price = ?, selling_price = ?, mrp = ?, gst = ?, barcode = ?, quantity = ?, image_url = ?, status = ?
     WHERE id = ?`,
    [
      product.sku,
      product.name,
      product.brand,
      product.category,
      product.purchase_price,
      product.selling_price,
      product.mrp,
      product.gst,
      product.barcode,
      product.quantity,
      product.image_url,
      product.status || 'active',
      id
    ]
  )
  return getProductById(id)
}

export async function deleteProduct(id) {
  const db = getDb()
  const [result] = await db.query('DELETE FROM products WHERE id = ?', [id])
  return result.affectedRows > 0
}
