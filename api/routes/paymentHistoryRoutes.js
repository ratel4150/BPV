// api/routes/paymentHistoryRoutes.js
import express from 'express';
import {
  createPaymentHistory,
  getAllPaymentHistory,
  getPaymentHistoryById,
  updatePaymentHistory,
  deletePaymentHistory,
} from '../controllers/PaymentHistoryController.js';

const router = express.Router();

router.post('/', createPaymentHistory);
router.get('/', getAllPaymentHistory);
router.get('/:id', getPaymentHistoryById);
router.put('/:id', updatePaymentHistory);
router.delete('/:id', deletePaymentHistory);

export default router;
