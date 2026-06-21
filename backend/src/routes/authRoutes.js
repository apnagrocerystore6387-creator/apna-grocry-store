import { Router } from 'express'
import { login, register, getProfile } from '../controllers/authController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/me', authenticate, getProfile)

export default router
