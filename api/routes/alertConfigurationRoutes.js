// routes/alertConfigurationRoutes.js
import express from 'express';
import {
  createAlertConfiguration,
  getAllAlertConfigurations,
  getAlertConfigurationById,
  updateAlertConfiguration,
  deleteAlertConfiguration,
} from '../controllers/AlertConfigurationController.js';

const router = express.Router();

/**
 * @route   POST /alert-configurations
 * @desc    Crear una nueva configuración de alerta
 * @access  Public
 */
router.post('/', createAlertConfiguration);

/**
 * @route   GET /alert-configurations
 * @desc    Obtener todas las configuraciones de alerta
 * @access  Public
 */
router.get('/', getAllAlertConfigurations);

/**
 * @route   GET /alert-configurations/:id
 * @desc    Obtener una configuración de alerta por ID
 * @access  Public
 */
router.get('/:id', getAlertConfigurationById);

/**
 * @route   PUT /alert-configurations/:id
 * @desc    Actualizar una configuración de alerta por ID
 * @access  Public
 */
router.put('/:id', updateAlertConfiguration);

/**
 * @route   DELETE /alert-configurations/:id
 * @desc    Eliminar una configuración de alerta por ID
 * @access  Public
 */
router.delete('/:id', deleteAlertConfiguration);

export default router;
