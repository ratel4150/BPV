import CashClosure from '../models/CashClosure.js';
import logger from '../logger.js';

/**
 * @swagger
 * tags:
 *   name: CashClosures
 *   description: API para gestionar cierres de caja
 */

/**
 * @swagger
 * /cashclosures:
 *   get:
 *     summary: Obtiene todos los cierres de caja
 *     tags: [CashClosures]
 *     responses:
 *       200:
 *         description: Lista de cierres de caja
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CashClosure'
 */
export const getCashClosures = async (req, res) => {
  try {
    const cashClosures = await CashClosure.find().populate('cashier');
    logger.info('Fetched all cash closures');
    res.status(200).json(cashClosures);
  } catch (error) {
    logger.error('Error fetching cash closures:', error);
    res.status(500).json({ message: 'Error al obtener cierres de caja' });
  }
};

/**
 * @swagger
 * /cashclosures/{id}:
 *   get:
 *     summary: Obtiene un cierre de caja por ID
 *     tags: [CashClosures]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cierre de caja
 *     responses:
 *       200:
 *         description: Detalles de un cierre de caja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashClosure'
 *       404:
 *         description: Cierre de caja no encontrado
 */
export const getCashClosureById = async (req, res) => {
  try {
    const cashClosure = await CashClosure.findById(req.params.id).populate('cashier');
    if (!cashClosure) {
      logger.warn(`Cash closure with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Cierre de caja no encontrado' });
    }
    logger.info(`Fetched cash closure with id ${req.params.id}`);
    res.status(200).json(cashClosure);
  } catch (error) {
    logger.error('Error fetching cash closure by ID:', error);
    res.status(500).json({ message: 'Error al obtener cierre de caja' });
  }
};

/**
 * @swagger
 * /cashclosures:
 *   post:
 *     summary: Crea un nuevo cierre de caja
 *     tags: [CashClosures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashClosure'
 *     responses:
 *       201:
 *         description: Cierre de caja creado exitosamente
 *       500:
 *         description: Error al crear cierre de caja
 */
export const createCashClosure = async (req, res) => {
  try {
    const newCashClosure = new CashClosure(req.body);
    await newCashClosure.save();
    logger.info('Created a new cash closure');
    res.status(201).json(newCashClosure);
  } catch (error) {
    logger.error('Error creating cash closure:', error);
    res.status(500).json({ message: 'Error al crear cierre de caja' });
  }
};

/**
 * @swagger
 * /cashclosures/{id}:
 *   put:
 *     summary: Actualiza un cierre de caja por ID
 *     tags: [CashClosures]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cierre de caja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashClosure'
 *     responses:
 *       200:
 *         description: Cierre de caja actualizado exitosamente
 *       404:
 *         description: Cierre de caja no encontrado
 */
export const updateCashClosure = async (req, res) => {
  try {
    const { id } = req.params;
    const cashClosure = await CashClosure.findByIdAndUpdate(id, req.body, { new: true }).populate('cashier');
    if (!cashClosure) {
      logger.warn(`Cash closure with id ${id} not found`);
      return res.status(404).json({ message: 'Cierre de caja no encontrado' });
    }
    logger.info(`Updated cash closure with id ${id}`);
    res.status(200).json(cashClosure);
  } catch (error) {
    logger.error('Error updating cash closure:', error);
    res.status(500).json({ message: 'Error al actualizar cierre de caja' });
  }
};

/**
 * @swagger
 * /cashclosures/{id}:
 *   delete:
 *     summary: Elimina un cierre de caja por ID
 *     tags: [CashClosures]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cierre de caja
 *     responses:
 *       204:
 *         description: Cierre de caja eliminado exitosamente
 *       404:
 *         description: Cierre de caja no encontrado
 */
export const deleteCashClosure = async (req, res) => {
  try {
    const cashClosure = await CashClosure.findByIdAndDelete(req.params.id);
    if (!cashClosure) {
      logger.warn(`Cash closure with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Cierre de caja no encontrado' });
    }
    logger.info(`Deleted cash closure with id ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting cash closure:', error);
    res.status(500).json({ message: 'Error al eliminar cierre de caja' });
  }
};
