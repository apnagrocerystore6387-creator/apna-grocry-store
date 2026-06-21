import { getDeliveryOrders } from '../models/orderModel.js'

export async function listDeliveryOrders(req, res, next) {
  try {
    const orders = await getDeliveryOrders()
    res.json({ orders })
  } catch (error) {
    next(error)
  }
}
