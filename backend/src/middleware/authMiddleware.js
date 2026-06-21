import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.userId }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
