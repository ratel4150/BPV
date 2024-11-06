// api/routes/promotionRoutes.js
import express from 'express';
import {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from '../controllers/PromotionController.js';

const router = express.Router();

router.post('/', createPromotion);
router.get('/', getAllPromotions);
router.get('/:id', getPromotionById);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;
