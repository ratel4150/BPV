// routes/ticketDetailRoutes.js
import express from 'express';
import {
  createTicketDetail,
  getAllTicketDetails,
  getTicketDetailById,
  deleteTicketDetailById,
} from '../controllers/ticketDetailController.js';

const router = express.Router();

// Ruta para crear un nuevo TicketDetail
router.post('/', createTicketDetail);

// Ruta para obtener todos los TicketDetails
router.get('/', getAllTicketDetails);

// Ruta para obtener un TicketDetail por su ID
router.get('/:id', getTicketDetailById);

// Ruta para eliminar un TicketDetail por su ID
router.delete('/:id', deleteTicketDetailById);

export default router;
