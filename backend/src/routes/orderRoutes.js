import { Router } from 'express'
import {
  listOrders,
  getOrder,
  createOrderHandler,
  deleteOrderHandler,
  updateOrderStatus,
  trackOrder,
  printOrderBill
} from '../controllers/orderController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', authenticate, listOrders)
router.get('/track', trackOrder)
router.get('/:id', authenticate, getOrder)
router.put('/:id/status', authenticate, updateOrderStatus)
router.post('/', authenticate, createOrderHandler)
router.delete('/:id', authenticate, deleteOrderHandler)
router.get('/:id/bill', authenticate, printOrderBill)

export default router
