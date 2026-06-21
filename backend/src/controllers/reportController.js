import {
  getSalesSummary,
  getTopProducts,
  getLowStockProducts,
  getCustomerPointsSummary
} from '../models/reportModel.js'

export async function getReportSummary(req, res, next) {
  try {
    const [salesSummary, topProducts, lowStockProducts, customerPoints] = await Promise.all([
      getSalesSummary(),
      getTopProducts(),
      getLowStockProducts(),
      getCustomerPointsSummary()
    ])

    res.json({ salesSummary, topProducts, lowStockProducts, customerPoints })
  } catch (error) {
    next(error)
  }
}
