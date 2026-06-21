import {
  getOrders,
  getOrderById,
  getOrderItems,
  createOrder,
  deleteOrder,
  updateOrderStatus as updateOrderStatusModel,
  findOrderByNumber
} from '../models/orderModel.js'

export async function listOrders(req, res, next) {
  try {
    const orders = await getOrders()
    res.json({ orders })
  } catch (error) {
    next(error)
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    const items = await getOrderItems(order.id)
    res.json({ order: { ...order, items } })
  } catch (error) {
    next(error)
  }
}

export async function createOrderHandler(req, res, next) {
  try {
    const { customer_id, order_number, status, payment_status, total_amount, items } = req.body
    const orderId = await createOrder(
      { customer_id, order_number, status, payment_status, total_amount },
      items
    )
    res.status(201).json({ orderId })
  } catch (error) {
    next(error)
  }
}

export async function deleteOrderHandler(req, res, next) {
  try {
    const deleted = await deleteOrder(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Order not found' })
    res.json({ message: 'Order deleted' })
  } catch (error) {
    next(error)
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body
    const allowedStatuses = ['pending', 'packed', 'out_for_delivery', 'delivered', 'cancelled']
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' })
    }

    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot update a completed or cancelled order' })
    }

    const nextStatusFlow = {
      pending: ['packed', 'cancelled'],
      packed: ['out_for_delivery', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled']
    }

    const validNext = nextStatusFlow[order.status] || []
    if (!validNext.includes(status)) {
      return res.status(400).json({ message: `Invalid next status for ${order.status}` })
    }

    const updated = await updateOrderStatusModel(req.params.id, status)
    if (!updated) return res.status(500).json({ message: 'Unable to update order status' })
    res.json({ message: 'Order status updated successfully', status })
  } catch (error) {
    next(error)
  }
}

export async function trackOrder(req, res, next) {
  try {
    const { order_number } = req.query
    if (!order_number) {
      return res.status(400).json({ message: 'Order number is required' })
    }

    const order = await findOrderByNumber(order_number)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const items = await getOrderItems(order.id)
    res.json({ order: { ...order, items } })
  } catch (error) {
    next(error)
  }
}

export async function printOrderBill(req, res, next) {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const items = await getOrderItems(order.id)
    const billHtml = `
      <html>
      <head>
        <title>Bill #${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f4f4f4; }
          .invoice { max-width: 900px; margin: auto; background: #fff; padding: 24px; border-radius: 12px; }
          h1 { margin-bottom: 0.5rem; }
          .company { color: #334155; }
          .section { margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
          th { background: #f8fafc; }
          .right { text-align: right; }
          .total-line { font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="company">
            <h1>AGS Grocery Store</h1>
            <p>Billing Invoice</p>
          </div>
          <div class="section">
            <strong>Bill Number:</strong> ${order.order_number}<br />
            <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br />
            <strong>Customer:</strong> ${order.customer_name || 'Walk-in customer'}<br />
            <strong>Payment Status:</strong> ${order.payment_status}
          </div>
          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th class="right">Qty</th>
                  <th class="right">Rate</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${item.product_name}</td>
                        <td class="right">${item.quantity}</td>
                        <td class="right">${item.unit_price.toFixed(2)}</td>
                        <td class="right">${item.total_price.toFixed(2)}</td>
                      </tr>`
                  )
                  .join('')}
              </tbody>
              <tfoot>
                <tr class="total-line">
                  <td colspan="4" class="right">Total Amount</td>
                  <td class="right">${order.total_amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="section">
            <p>Thank you for shopping with AGS Grocery Store.</p>
          </div>
        </div>
      </body>
      </html>
    `

    res.type('text/html').send(billHtml)
  } catch (error) {
    next(error)
  }
}
