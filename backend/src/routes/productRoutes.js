import { Router } from 'express'
import multer from 'multer'
import {
  listProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  uploadProductImage,
  generateBarcode
} from '../controllers/productController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()
const upload = multer({ dest: 'backend/uploads/' })

router.get('/', authenticate, listProducts)
router.get('/:id', authenticate, getProduct)
router.post('/', authenticate, upload.single('image'), createProductHandler)
router.put('/:id', authenticate, upload.single('image'), updateProductHandler)
router.delete('/:id', authenticate, deleteProductHandler)
router.post('/upload', authenticate, upload.single('image'), uploadProductImage)
router.post('/barcode', authenticate, generateBarcode)

export default router
