import express from 'express';
import {
  getCustomerHistories,
  getCustomerHistoryById,
  createCustomerHistory,
  updateCustomerHistory,
  deleteCustomerHistory
} from '../controllers/CustomHistoryController.js';

const router = express.Router();

// Ruta para obtener todos los historiales de cliente
router.get('/', getCustomerHistories);

// Ruta para obtener un historial de cliente por ID
router.get('/:id', getCustomerHistoryById);

// Ruta para crear un nuevo historial de cliente
router.post('/', createCustomerHistory);

// Ruta para actualizar un historial de cliente por ID
router.put('/:id', updateCustomerHistory);

// Ruta para eliminar un historial de cliente por ID
router.delete('/:id', deleteCustomerHistory);

export default router;
