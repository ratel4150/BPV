import CustomerHistory from '../models/CustomHistory.js';
import logger from '../logger.js';

/**
 * @swagger
 * tags:
 *   name: CustomerHistories
 *   description: API para gestionar historiales de clientes
 */

/**
 * @swagger
 * /customerhistories:
 *   get:
 *     summary: Obtiene todos los historiales de clientes
 *     tags: [CustomerHistories]
 *     responses:
 *       200:
 *         description: Lista de historiales de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerHistory'
 */
export const getCustomerHistories = async (req, res) => {
  try {
    const histories = await CustomerHistory.find().populate('customer');
    logger.info('Fetched all customer histories');
    res.status(200).json(histories);
  } catch (error) {
    logger.error('Error fetching customer histories:', error);
    res.status(500).json({ message: 'Error al obtener historiales de clientes' });
  }
};

/**
 * @swagger
 * /customerhistories/{id}:
 *   get:
 *     summary: Obtiene un historial de cliente por ID
 *     tags: [CustomerHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del historial de cliente
 *     responses:
 *       200:
 *         description: Detalles de un historial de cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerHistory'
 *       404:
 *         description: Historial de cliente no encontrado
 */
export const getCustomerHistoryById = async (req, res) => {
  try {
    const history = await CustomerHistory.findById(req.params.id).populate('customer');
    if (!history) {
      logger.warn(`Customer history with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Historial de cliente no encontrado' });
    }
    logger.info(`Fetched customer history with id ${req.params.id}`);
    res.status(200).json(history);
  } catch (error) {
    logger.error('Error fetching customer history by ID:', error);
    res.status(500).json({ message: 'Error al obtener historial de cliente' });
  }
};

/**
 * @swagger
 * /customerhistories:
 *   post:
 *     summary: Crea un nuevo historial de cliente
 *     tags: [CustomerHistories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerHistory'
 *     responses:
 *       201:
 *         description: Historial de cliente creado exitosamente
 *       500:
 *         description: Error al crear historial de cliente
 */
export const createCustomerHistory = async (req, res) => {
  try {
    const newHistory = new CustomerHistory(req.body);
    await newHistory.save();
    logger.info('Created a new customer history');
    res.status(201).json(newHistory);
  } catch (error) {
    logger.error('Error creating customer history:', error);
    res.status(500).json({ message: 'Error al crear historial de cliente' });
  }
};

/**
 * @swagger
 * /customerhistories/{id}:
 *   put:
 *     summary: Actualiza un historial de cliente por ID
 *     tags: [CustomerHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del historial de cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerHistory'
 *     responses:
 *       200:
 *         description: Historial de cliente actualizado exitosamente
 *       404:
 *         description: Historial de cliente no encontrado
 */
export const updateCustomerHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await CustomerHistory.findByIdAndUpdate(id, req.body, { new: true }).populate('customer');
    if (!history) {
      logger.warn(`Customer history with id ${id} not found`);
      return res.status(404).json({ message: 'Historial de cliente no encontrado' });
    }
    logger.info(`Updated customer history with id ${id}`);
    res.status(200).json(history);
  } catch (error) {
    logger.error('Error updating customer history:', error);
    res.status(500).json({ message: 'Error al actualizar historial de cliente' });
  }
};

/**
 * @swagger
 * /customerhistories/{id}:
 *   delete:
 *     summary: Elimina un historial de cliente por ID
 *     tags: [CustomerHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del historial de cliente
 *     responses:
 *       204:
 *         description: Historial de cliente eliminado exitosamente
 *       404:
 *         description: Historial de cliente no encontrado
 */
export const deleteCustomerHistory = async (req, res) => {
  try {
    const history = await CustomerHistory.findByIdAndDelete(req.params.id);
    if (!history) {
      logger.warn(`Customer history with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Historial de cliente no encontrado' });
    }
    logger.info(`Deleted customer history with id ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting customer history:', error);
    res.status(500).json({ message: 'Error al eliminar historial de cliente' });
  }
};
