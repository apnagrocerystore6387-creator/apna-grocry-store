import path from 'path'
import fs from 'fs'
import bwipjs from 'bwip-js'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../models/productModel.js'

export async function listProducts(req, res, next) {
  try {
    const products = await getAllProducts()
    res.json({ products })
  } catch (error) {
    next(error)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (error) {
    next(error)
  }
}

export async function createProductHandler(req, res, next) {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
    const product = await createProduct({ ...req.body, image_url: imageUrl })
    res.status(201).json({ product })
  } catch (error) {
    next(error)
  }
}

export async function updateProductHandler(req, res, next) {
  try {
    const product = await getProductById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    let imageUrl = product.image_url
    if (req.file) {
      if (imageUrl) {
        const existingPath = path.join(process.cwd(), 'backend', imageUrl)
        if (fs.existsSync(existingPath)) fs.unlinkSync(existingPath)
      }
      imageUrl = `/uploads/${req.file.filename}`
    }

    const updated = await updateProduct(req.params.id, { ...req.body, image_url: imageUrl })
    res.json({ product: updated })
  } catch (error) {
    next(error)
  }
}

export async function deleteProductHandler(req, res, next) {
  try {
    const product = await getProductById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (product.image_url) {
      const existingPath = path.join(process.cwd(), 'backend', product.image_url)
      if (fs.existsSync(existingPath)) fs.unlinkSync(existingPath)
    }

    const removed = await deleteProduct(req.params.id)
    if (!removed) return res.status(404).json({ message: 'Product not found' })

    res.json({ message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
}

export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' })
    res.json({ imageUrl: `/uploads/${req.file.filename}` })
  } catch (error) {
    next(error)
  }
}

export async function generateBarcode(req, res, next) {
  try {
    const { barcode } = req.body
    if (!barcode) return res.status(400).json({ message: 'Barcode value is required' })

    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: barcode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center'
    })

    res.type('image/png')
    res.send(png)
  } catch (error) {
    next(error)
  }
}
