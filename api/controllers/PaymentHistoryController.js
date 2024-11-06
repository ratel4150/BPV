// api/controllers/PaymentHistoryController.js
import Joi from 'joi';
import PaymentHistory from '../models/PaymentHistory.js';
import logger from '../logger.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentHistory:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario asociado con el pago.
 *         amount:
 *           type: number
 *           description: Monto del pago.
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha del pago.
 */

/**
 * @swagger
 * /payment-history:
 *   post:
 *     summary: Crea un nuevo historial de pago.
 *     tags: [Payment History]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentHistory'
 *     responses:
 *       201:
 *         description: Historial de pago creado exitosamente.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error en el servidor.
 */
export const createPaymentHistory = async (req, res) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    amount: Joi.number().required(),
    date: Joi.date().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newPayment = new PaymentHistory(req.body);
    await newPayment.save();
    logger.info('Payment history created successfully');
    res.status(201).json(newPayment);
  } catch (err) {
    logger.error(`Error creating payment history: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /payment-history:
 *   get:
 *     summary: Obtiene todos los historiales de pago.
 *     tags: [Payment History]
 *     responses:
 *       200:
 *         description: Lista de historiales de pago.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentHistory'
 *       500:
 *         description: Error en el servidor.
 */
export const getAllPaymentHistory = async (req, res) => {
  try {
    const payments = await PaymentHistory.find().populate('user');
    logger.info('Fetched all payment histories');
    res.status(200).json(payments);
  } catch (err) {
    logger.error(`Error fetching payment histories: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /payment-history/{id}:
 *   get:
 *     summary: Obtiene un historial de pago por ID.
 *     tags: [Payment History]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del historial de pago.
 *     responses:
 *       200:
 *         description: Historial de pago obtenido exitosamente.
 *       404:
 *         description: Historial de pago no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const getPaymentHistoryById = async (req, res) => {
  try {
    const payment = await PaymentHistory.findById(req.params.id).populate('user');
    if (!payment) {
      logger.warn(`Payment history with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Payment history not found' });
    }
    logger.info(`Fetched payment history with ID ${req.params.id}`);
    res.status(200).json(payment);
  } catch (err) {
    logger.error(`Error fetching payment history: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /payment-history/{id}:
 *   put:
 *     summary: Actualiza un historial de pago por ID.
 *     tags: [Payment History]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del historial de pago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentHistory'
 *     responses:
 *       200:
 *         description: Historial de pago actualizado exitosamente.
 *       404:
 *         description: Historial de pago no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const updatePaymentHistory = async (req, res) => {
  const schema = Joi.object({
    user: Joi.string().optional(),
    amount: Joi.number().optional(),
    date: Joi.date().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const payment = await PaymentHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user');
    if (!payment) {
      logger.warn(`Payment history with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Payment history not found' });
    }
    logger.info(`Payment history with ID ${req.params.id} updated`);
    res.status(200).json(payment);
  } catch (err) {
    logger.error(`Error updating payment history: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /payment-history/{id}:
 *   delete:
 *     summary: Elimina un historial de pago por ID.
 *     tags: [Payment History]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del historial de pago.
 *     responses:
 *       204:
 *         description: Historial de pago eliminado exitosamente.
 *       404:
 *         description: Historial de pago no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const deletePaymentHistory = async (req, res) => {
  try {
    const payment = await PaymentHistory.findByIdAndDelete(req.params.id);
    if (!payment) {
      logger.warn(`Payment history with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Payment history not found' });
    }
    logger.info(`Payment history with ID ${req.params.id} deleted`);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting payment history: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};
