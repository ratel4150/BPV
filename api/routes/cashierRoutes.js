// routes/cashierRoutes.js
import express from 'express';
import {
  createCashier,
  getAllCashiers,
  getCashierById,
  deleteCashierById,
} from '../controllers/CashierController.js';

const router = express.Router();

// Ruta para crear un nuevo cajero
router.post('/', createCashier);

// Ruta para obtener todos los cajeros
router.get('/', getAllCashiers);

// Ruta para obtener un cajero por ID
router.get('/:id', getCashierById);

// Ruta para eliminar un cajero por ID
router.delete('/:id', deleteCashierById);

export default router;
