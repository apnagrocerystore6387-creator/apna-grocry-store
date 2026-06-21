import { Router } from 'express'
import { getReportSummary } from '../controllers/reportController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/summary', authenticate, getReportSummary)

export default router
