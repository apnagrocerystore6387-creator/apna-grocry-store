import { getDb } from '../config/db.js'

export async function findUserByLogin(login) {
  const db = getDb()
  const [rows] = await db.query(
    'SELECT id, username, name, email, password, role_id FROM users WHERE email = ? OR username = ?',
    [login, login]
  )
  return rows[0]
}

export async function findUserById(id) {
  const db = getDb()
  const [rows] = await db.query(
    'SELECT id, username, name, email, role_id FROM users WHERE id = ?',
    [id]
  )
  return rows[0]
}

export async function createUser(user) {
  const db = getDb()
  const [result] = await db.query(
    'INSERT INTO users (username, name, email, password, role_id) VALUES (?, ?, ?, ?, ?)',
    [user.username, user.name, user.email, user.password, user.role_id || 3]
  )
  return { id: result.insertId, ...user }
}
