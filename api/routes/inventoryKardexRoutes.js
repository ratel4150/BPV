import express from 'express';
import {
  createInventoryKardex,
  getAllInventoryKardex,
  getInventoryKardexById,
  updateInventoryKardexById,
  deleteInventoryKardexById,
} from '../controllers/InventoryController.js';

const router = express.Router();

router.post('/', createInventoryKardex);
router.get('/', getAllInventoryKardex);
router.get('/:id', getInventoryKardexById);
router.put('/:id', updateInventoryKardexById);
router.delete('/:id', deleteInventoryKardexById);
/* inventoryKardex */
export default router;
