import {
  getInventoryTransactions,
  createInventoryTransaction,
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  adjustProductQuantity,
  getProductStockLevels
} from '../models/inventoryModel.js'

export async function listInventoryTransactions(req, res, next) {
  try {
    const transactions = await getInventoryTransactions()
    res.json({ transactions })
  } catch (error) {
    next(error)
  }
}

export async function addInventoryTransaction(req, res, next) {
  try {
    const transaction = await createInventoryTransaction({
      product_id: req.body.product_id,
      transaction_type: req.body.transaction_type,
      quantity: req.body.quantity,
      reference: req.body.reference,
      created_by: req.user.id
    })

    const quantityChange = req.body.transaction_type === 'sale' ? -req.body.quantity : req.body.quantity
    await adjustProductQuantity(req.body.product_id, quantityChange)

    res.status(201).json({ transaction })
  } catch (error) {
    next(error)
  }
}

export async function listPurchaseOrders(req, res, next) {
  try {
    const orders = await getPurchaseOrders()
    res.json({ orders })
  } catch (error) {
    next(error)
  }
}

export async function getPurchaseOrder(req, res, next) {
  try {
    const order = await getPurchaseOrderById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Purchase order not found' })
    res.json({ order })
  } catch (error) {
    next(error)
  }
}

export async function createPurchaseOrderHandler(req, res, next) {
  try {
    const order = await createPurchaseOrder(req.body)
    res.status(201).json({ order })
  } catch (error) {
    next(error)
  }
}

export async function updatePurchaseOrderHandler(req, res, next) {
  try {
    const order = await updatePurchaseOrder(req.params.id, req.body)
    if (!order) return res.status(404).json({ message: 'Purchase order not found' })
    res.json({ order })
  } catch (error) {
    next(error)
  }
}

export async function deletePurchaseOrderHandler(req, res, next) {
  try {
    const deleted = await deletePurchaseOrder(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Purchase order not found' })
    res.json({ message: 'Purchase order deleted' })
  } catch (error) {
    next(error)
  }
}

export async function listStockLevels(req, res, next) {
  try {
    const stockLevels = await getProductStockLevels()
    res.json({ stockLevels })
  } catch (error) {
    next(error)
  }
}
