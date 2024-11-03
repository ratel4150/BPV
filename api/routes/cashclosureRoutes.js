import express from 'express';
import {
  getCashClosures,
  getCashClosureById,
  createCashClosure,
  updateCashClosure,
  deleteCashClosure
} from '../controllers/CashClosureController.js';

const router = express.Router();

// Ruta para obtener todos los cierres de caja
router.get('/', getCashClosures);

// Ruta para obtener un cierre de caja por ID
router.get('/:id', getCashClosureById);

// Ruta para crear un nuevo cierre de caja
router.post('/', createCashClosure);

// Ruta para actualizar un cierre de caja por ID
router.put('/:id', updateCashClosure);

// Ruta para eliminar un cierre de caja por ID
router.delete('/:id', deleteCashClosure);

export default router;
