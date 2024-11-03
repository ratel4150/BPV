import express from 'express';
import {
  createDiscountHistory,
  getAllDiscountHistories,
  getDiscountHistoryById,
  updateDiscountHistoryById,
  deleteDiscountHistoryById,
} from '../controllers/DiscountHistoryController.js';

const router = express.Router();

router.post('/', createDiscountHistory);
router.get('/', getAllDiscountHistories);
router.get('/:id', getDiscountHistoryById);
router.put('/:id', updateDiscountHistoryById);
router.delete('/:id', deleteDiscountHistoryById);

export default router;
