import express from 'express';
import {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItemById,
  deleteInventoryItemById,
} from '../controllers/InventoryController.js';

const router = express.Router();

router.post('/inventory', createInventoryItem);
router.get('/inventory', getAllInventoryItems);
router.get('/inventory/:id', getInventoryItemById);
router.put('/inventory/:id', updateInventoryItemById);
router.delete('/inventory/:id', deleteInventoryItemById);

export default router;
