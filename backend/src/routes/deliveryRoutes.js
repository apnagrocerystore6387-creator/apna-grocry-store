import { Router } from 'express'
import { listDeliveryOrders } from '../controllers/deliveryController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', authenticate, listDeliveryOrders)

export default router
