// api/controllers/LoyaltyTransactionController.js
import Joi from 'joi';
import LoyaltyTransaction from '../models/LoyaltyTransaction.js';
import logger from '../logger.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoyaltyTransaction:
 *       type: object
 *       properties:
 *         customer:
 *           type: string
 *           description: ID del cliente asociado con la transacción.
 *         points:
 *           type: number
 *           description: Puntos ganados o utilizados en la transacción.
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha de la transacción.
 */

/**
 * @swagger
 * /loyalty-transactions:
 *   post:
 *     summary: Crea una nueva transacción de lealtad.
 *     tags: [Loyalty Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyTransaction'
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error en el servidor.
 */
export const createLoyaltyTransaction = async (req, res) => {
  const schema = Joi.object({
    customer: Joi.string().required(),
    points: Joi.number().required(),
    date: Joi.date().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newTransaction = new LoyaltyTransaction(req.body);
    await newTransaction.save();
    logger.info('Loyalty transaction created successfully');
    res.status(201).json(newTransaction);
  } catch (err) {
    logger.error(`Error creating loyalty transaction: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /loyalty-transactions:
 *   get:
 *     summary: Obtiene todas las transacciones de lealtad.
 *     tags: [Loyalty Transactions]
 *     responses:
 *       200:
 *         description: Lista de transacciones de lealtad.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LoyaltyTransaction'
 *       500:
 *         description: Error en el servidor.
 */
export const getAllLoyaltyTransactions = async (req, res) => {
  try {
    const transactions = await LoyaltyTransaction.find().populate('customer');
    logger.info('Fetched all loyalty transactions');
    res.status(200).json(transactions);
  } catch (err) {
    logger.error(`Error fetching loyalty transactions: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /loyalty-transactions/{id}:
 *   get:
 *     summary: Obtiene una transacción de lealtad por ID.
 *     tags: [Loyalty Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la transacción de lealtad.
 *     responses:
 *       200:
 *         description: Transacción obtenida exitosamente.
 *       404:
 *         description: Transacción no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
export const getLoyaltyTransactionById = async (req, res) => {
  try {
    const transaction = await LoyaltyTransaction.findById(req.params.id).populate('customer');
    if (!transaction) {
      logger.warn(`Transaction with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Transaction not found' });
    }
    logger.info(`Fetched transaction with ID ${req.params.id}`);
    res.status(200).json(transaction);
  } catch (err) {
    logger.error(`Error fetching transaction: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /loyalty-transactions/{id}:
 *   put:
 *     summary: Actualiza una transacción de lealtad por ID.
 *     tags: [Loyalty Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la transacción de lealtad.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyTransaction'
 *     responses:
 *       200:
 *         description: Transacción actualizada exitosamente.
 *       404:
 *         description: Transacción no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
export const updateLoyaltyTransaction = async (req, res) => {
  const schema = Joi.object({
    customer: Joi.string().optional(),
    points: Joi.number().optional(),
    date: Joi.date().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const transaction = await LoyaltyTransaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('customer');
    if (!transaction) {
      logger.warn(`Transaction with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Transaction not found' });
    }
    logger.info(`Transaction with ID ${req.params.id} updated`);
    res.status(200).json(transaction);
  } catch (err) {
    logger.error(`Error updating transaction: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /loyalty-transactions/{id}:
 *   delete:
 *     summary: Elimina una transacción de lealtad por ID.
 *     tags: [Loyalty Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la transacción de lealtad.
 *     responses:
 *       204:
 *         description: Transacción eliminada exitosamente.
 *       404:
 *         description: Transacción no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
export const deleteLoyaltyTransaction = async (req, res) => {
  try {
    const transaction = await LoyaltyTransaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      logger.warn(`Transaction with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Transaction not found' });
    }
    logger.info(`Transaction with ID ${req.params.id} deleted`);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting transaction: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};
