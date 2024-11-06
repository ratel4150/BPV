// routes/loyaltyProgramRoutes.js
import express from 'express';
import {
  createLoyaltyProgram,
  getAllLoyaltyPrograms,
  getLoyaltyProgramById,
  updateLoyaltyProgram,
  deleteLoyaltyProgram,
} from '../controllers/LoyaltyProgramController.js';

const router = express.Router();


router.post('/', createLoyaltyProgram);


router.get('/', getAllLoyaltyPrograms);

router.get('/:id', getLoyaltyProgramById);


router.put('/:id', updateLoyaltyProgram);

router.delete('/:id', deleteLoyaltyProgram);

export default router;
