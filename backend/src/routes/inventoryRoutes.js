import { Router } from 'express'
import {
  listInventoryTransactions,
  addInventoryTransaction,
  listPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrderHandler,
  updatePurchaseOrderHandler,
  deletePurchaseOrderHandler,
  listStockLevels
} from '../controllers/inventoryController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/transactions', authenticate, listInventoryTransactions)
router.post('/transactions', authenticate, addInventoryTransaction)

router.get('/purchase-orders', authenticate, listPurchaseOrders)
router.get('/purchase-orders/:id', authenticate, getPurchaseOrder)
router.post('/purchase-orders', authenticate, createPurchaseOrderHandler)
router.put('/purchase-orders/:id', authenticate, updatePurchaseOrderHandler)
router.delete('/purchase-orders/:id', authenticate, deletePurchaseOrderHandler)

router.get('/stock-levels', authenticate, listStockLevels)

export default router
