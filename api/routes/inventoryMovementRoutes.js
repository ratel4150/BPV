import express from 'express';
import {
  createInventoryMovement,
  getInventoryMovementsByInventoryId,
  deleteInventoryMovement,
  updateInventoryMovement
} from '../controllers/InventoryMovementController.js';

const router = express.Router();


router.post('/', createInventoryMovement);


router.get('/:inventoryId', getInventoryMovementsByInventoryId);


router.delete('/:id', deleteInventoryMovement);


router.put('/:id', updateInventoryMovement);

export default router;
