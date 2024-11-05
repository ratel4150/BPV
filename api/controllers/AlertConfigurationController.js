// controllers/alertConfigurationController.js
import AlertConfiguration from '../models/AlertConfiguration.js';

/**
 * @swagger
 * tags:
 *   name: AlertConfiguration
 *   description: API para la gestión de configuraciones de alerta
 */

/**
 * @swagger
 * /alert-configurations:
 *   post:
 *     summary: Crea una nueva configuración de alerta
 *     tags: [AlertConfiguration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alertType:
 *                 type: string
 *                 description: Tipo de alerta
 *                 example: "Error"
 *               message:
 *                 type: string
 *                 description: Mensaje de la alerta
 *                 example: "El sistema ha detectado un error crítico"
 *     responses:
 *       201:
 *         description: Configuración de alerta creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
export const createAlertConfiguration = async (req, res) => {
  try {
    const alertConfig = new AlertConfiguration(req.body);
    await alertConfig.save();
    res.status(201).json(alertConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /alert-configurations:
 *   get:
 *     summary: Obtener todas las configuraciones de alerta
 *     tags: [AlertConfiguration]
 *     responses:
 *       200:
 *         description: Lista de configuraciones de alerta
 *       500:
 *         description: Error al obtener las configuraciones de alerta
 */
export const getAllAlertConfigurations = async (req, res) => {
  try {
    const alertConfigs = await AlertConfiguration.find();
    res.status(200).json(alertConfigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /alert-configurations/{id}:
 *   get:
 *     summary: Obtener una configuración de alerta por ID
 *     tags: [AlertConfiguration]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la configuración de alerta
 *     responses:
 *       200:
 *         description: Configuración de alerta encontrada
 *       404:
 *         description: Configuración de alerta no encontrada
 *       500:
 *         description: Error al obtener la configuración de alerta
 */
export const getAlertConfigurationById = async (req, res) => {
  try {
    const alertConfig = await AlertConfiguration.findById(req.params.id);
    if (!alertConfig) return res.status(404).json({ message: 'Alert configuration not found' });
    res.status(200).json(alertConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /alert-configurations/{id}:
 *   put:
 *     summary: Actualizar una configuración de alerta por ID
 *     tags: [AlertConfiguration]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la configuración de alerta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alertType:
 *                 type: string
 *                 description: Tipo de alerta
 *               message:
 *                 type: string
 *                 description: Mensaje de la alerta
 *     responses:
 *       200:
 *         description: Configuración de alerta actualizada
 *       404:
 *         description: Configuración de alerta no encontrada
 *       400:
 *         description: Error en la actualización
 */
export const updateAlertConfiguration = async (req, res) => {
  try {
    const alertConfig = await AlertConfiguration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alertConfig) return res.status(404).json({ message: 'Alert configuration not found' });
    res.status(200).json(alertConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /alert-configurations/{id}:
 *   delete:
 *     summary: Eliminar una configuración de alerta por ID
 *     tags: [AlertConfiguration]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la configuración de alerta
 *     responses:
 *       200:
 *         description: Configuración de alerta eliminada exitosamente
 *       404:
 *         description: Configuración de alerta no encontrada
 *       500:
 *         description: Error en la eliminación
 */
export const deleteAlertConfiguration = async (req, res) => {
  try {
    const alertConfig = await AlertConfiguration.findByIdAndDelete(req.params.id);
    if (!alertConfig) return res.status(404).json({ message: 'Alert configuration not found' });
    res.status(200).json({ message: 'Alert configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
