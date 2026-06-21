import { Router } from 'express'
import { checkout } from '../controllers/cartController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/checkout', authenticate, checkout)

export default router
