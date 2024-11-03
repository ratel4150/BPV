import express from 'express';
import {
  getAudits,
  getAuditById,
  createAudit,
  updateAudit,
  deleteAudit
} from '../controllers/AuditController.js';

const router = express.Router();

// Ruta para obtener todas las auditorías
router.get('/', getAudits);

// Ruta para obtener una auditoría por ID
router.get('/:id', getAuditById);

// Ruta para crear una nueva auditoría
router.post('/', createAudit);

// Ruta para actualizar una auditoría por ID
router.put('/:id', updateAudit);

// Ruta para eliminar una auditoría por ID
router.delete('/:id', deleteAudit);

export default router;
