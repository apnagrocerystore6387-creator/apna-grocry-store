import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let pool

export async function initDb() {
  if (pool) return pool

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

  try {
    await pool.getConnection()
    console.log('Connected to MySQL database')
  } catch (error) {
    console.error('MySQL connection failed:', error)
  }

  return pool
}

export function getDb() {
  if (!pool) throw new Error('Database not initialized')
  return pool
}
