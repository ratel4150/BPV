// api/routes/loyaltyTransactionRoutes.js
import express from 'express';
import {
  createLoyaltyTransaction,
  getAllLoyaltyTransactions,
  getLoyaltyTransactionById,
  updateLoyaltyTransaction,
  deleteLoyaltyTransaction,
} from '../controllers/LoyaltyTransactionController.js';

const router = express.Router();

router.post('/', createLoyaltyTransaction);
router.get('/', getAllLoyaltyTransactions);
router.get('/:id', getLoyaltyTransactionById);
router.put('/:id', updateLoyaltyTransaction);
router.delete('/:id', deleteLoyaltyTransaction);

export default router;
