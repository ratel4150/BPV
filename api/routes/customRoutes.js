import express from 'express';
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} from '../controllers/CustomController.js';

const router = express.Router();

// Ruta para crear un nuevo cliente
router.post('/', createCustomer);

// Ruta para obtener todos los clientes
router.get('/', getAllCustomers);

// Ruta para obtener un cliente por ID
router.get('/:id', getCustomerById);

// Ruta para actualizar un cliente por ID
router.put('/:id', updateCustomerById);

// Ruta para eliminar un cliente por ID
router.delete('/:id', deleteCustomerById);

export default router;
