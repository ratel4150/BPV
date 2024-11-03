import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);           // GET /products
router.get('/:id', getProductById);      // GET /products/:id
router.post('/', createProduct);         // POST /products
router.put('/:id', updateProduct);       // PUT /products/:id
router.delete('/:id', deleteProduct);    // DELETE /products/:id

export default router;
