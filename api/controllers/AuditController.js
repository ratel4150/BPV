import Audit from '../models/Audit.js';
import logger from '../logger.js';

/**
 * @swagger
 * tags:
 *   name: Audits
 *   description: API para gestionar auditorías
 */

/**
 * @swagger
 * /audits:
 *   get:
 *     summary: Obtiene todas las auditorías
 *     tags: [Audits]
 *     responses:
 *       200:
 *         description: Lista de auditorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 */
export const getAudits = async (req, res) => {
  try {
    const audits = await Audit.find().populate('user');
    logger.info('Fetched all audits');
    res.status(200).json(audits);
  } catch (error) {
    logger.error('Error fetching audits:', error);
    res.status(500).json({ message: 'Error al obtener auditorías' });
  }
};

/**
 * @swagger
 * /audits/{id}:
 *   get:
 *     summary: Obtiene una auditoría por ID
 *     tags: [Audits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la auditoría
 *     responses:
 *       200:
 *         description: Detalles de una auditoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audit'
 *       404:
 *         description: Auditoría no encontrada
 */
export const getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id).populate('user');
    if (!audit) {
      logger.warn(`Audit with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Auditoría no encontrada' });
    }
    logger.info(`Fetched audit with id ${req.params.id}`);
    res.status(200).json(audit);
  } catch (error) {
    logger.error('Error fetching audit by ID:', error);
    res.status(500).json({ message: 'Error al obtener auditoría' });
  }
};

/**
 * @swagger
 * /audits:
 *   post:
 *     summary: Crea una nueva auditoría
 *     tags: [Audits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audit'
 *     responses:
 *       201:
 *         description: Auditoría creada exitosamente
 *       500:
 *         description: Error al crear auditoría
 */
export const createAudit = async (req, res) => {
  try {
    const newAudit = new Audit(req.body);
    await newAudit.save();
    logger.info('Created a new audit');
    res.status(201).json(newAudit);
  } catch (error) {
    logger.error('Error creating audit:', error);
    res.status(500).json({ message: 'Error al crear auditoría' });
  }
};

/**
 * @swagger
 * /audits/{id}:
 *   delete:
 *     summary: Elimina una auditoría por ID
 *     tags: [Audits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la auditoría
 *     responses:
 *       204:
 *         description: Auditoría eliminada exitosamente
 *       404:
 *         description: Auditoría no encontrada
 */
export const deleteAudit = async (req, res) => {
  try {
    const audit = await Audit.findByIdAndDelete(req.params.id);
    if (!audit) {
      logger.warn(`Audit with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Auditoría no encontrada' });
    }
    logger.info(`Deleted audit with id ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting audit:', error);
    res.status(500).json({ message: 'Error al eliminar auditoría' });
  }
};
/**
 * @swagger
 * /audits/{id}:
 *   put:
 *     summary: Actualiza una auditoría por ID
 *     tags: [Audits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la auditoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audit'
 *     responses:
 *       200:
 *         description: Auditoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audit'
 *       404:
 *         description: Auditoría no encontrada
 */
export const updateAudit = async (req, res) => {
    try {
      const { id } = req.params;
      const audit = await Audit.findByIdAndUpdate(id, req.body, { new: true }).populate('user');
      if (!audit) {
        logger.warn(`Audit with id ${id} not found`);
        return res.status(404).json({ message: 'Auditoría no encontrada' });
      }
      logger.info(`Updated audit with id ${id}`);
      res.status(200).json(audit);
    } catch (error) {
      logger.error('Error updating audit:', error);
      res.status(500).json({ message: 'Error al actualizar auditoría' });
    }
  };