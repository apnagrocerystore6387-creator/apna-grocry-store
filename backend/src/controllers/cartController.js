import { findCustomerByEmail, createCustomer, addCustomerPoints } from '../models/customerModel.js'
import { createOrder } from '../models/orderModel.js'

export async function checkout(req, res, next) {
  try {
    const { customer, items, order_number, payment_status, total_amount } = req.body

    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({ message: 'Customer name and email are required' })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' })
    }

    const orderNumber = order_number || `AGS-${Date.now()}`
    const subtotal = items.reduce(
      (sum, item) => sum + (item.total_price ?? item.unit_price * item.quantity),
      0
    )
    const pointsEarned = Math.floor((total_amount || subtotal) / 100)

    let customerRecord = await findCustomerByEmail(customer.email)
    if (!customerRecord) {
      customerRecord = await createCustomer({ ...customer, points: pointsEarned })
    } else if (pointsEarned > 0) {
      await addCustomerPoints(customerRecord.id, pointsEarned)
      customerRecord.points += pointsEarned
    }

    const orderId = await createOrder(
      {
        customer_id: customerRecord.id,
        order_number: orderNumber,
        status: 'pending',
        payment_status: payment_status || 'paid',
        total_amount: total_amount || subtotal,
        points_earned: pointsEarned,
        delivery_address: customer.address || customerRecord.address || null,
        delivery_instructions: customer.delivery_instructions || null
      },
      items
    )

    res.status(201).json({ orderId, pointsEarned, totalPoints: customerRecord.points, message: 'Checkout completed successfully' })
  } catch (error) {
    next(error)
  }
}
