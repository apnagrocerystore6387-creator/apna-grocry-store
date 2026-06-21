import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findUserByLogin, createUser, findUserById } from '../models/userModel.js'

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  })
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    roleId: user.role_id
  }
}

export async function login(req, res, next) {
  try {
    const { login, password } = req.body
    const user = await findUserByLogin(login)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user.id)
    res.json({ token, user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function register(req, res, next) {
  try {
    const { username, name, email, password } = req.body
    const existingUser = await findUserByLogin(username) || await findUserByLogin(email)
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser({ username, name, email, password: hashedPassword })
    const token = createToken(user.id)

    res.status(201).json({ token, user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}
