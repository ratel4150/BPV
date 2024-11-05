// controllers/invoiceController.js
import Invoice from '../models/Invoice.js';
import Joi from 'joi';
import logger from '../logger.js';

/**
 * Validación de datos con Joi
 */
const invoiceSchema = Joi.object({
  ticket: Joi.string().required().messages({
    'string.base': 'El ticket debe ser un ObjectId válido',
    'string.empty': 'El ticket es obligatorio',
  }),
  amount: Joi.number().required().messages({
    'number.base': 'El monto debe ser un número',
    'number.empty': 'El monto es obligatorio',
  }),
});

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: API para la gestión de facturas
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Crea una nueva factura
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket:
 *                 type: string
 *                 description: ID del ticket asociado a la factura
 *               amount:
 *                 type: number
 *                 description: Monto de la factura
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *       400:
 *         description: Error de validación en los datos de la factura
 */
export const createInvoice = async (req, res) => {
  try {
    const { error } = invoiceSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const invoice = new Invoice(req.body);
    await invoice.save();
    logger.info(`Factura creada con ID: ${invoice._id}`);
    res.status(201).json(invoice);
  } catch (err) {
    logger.error(`Error al crear la factura: ${err.message}`);
    res.status(500).json({ message: 'Error al crear la factura' });
  }
};

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Obtener todas las facturas
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lista de facturas
 *       500:
 *         description: Error al obtener las facturas
 */
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('ticket');
    logger.info('Se han obtenido todas las facturas');
    res.status(200).json(invoices);
  } catch (err) {
    logger.error(`Error al obtener las facturas: ${err.message}`);
    res.status(500).json({ message: 'Error al obtener las facturas' });
  }
};

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error al obtener la factura
 */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('ticket');
    if (!invoice) {
      logger.warn(`Factura con ID ${req.params.id} no encontrada`);
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    logger.info(`Factura obtenida con ID: ${invoice._id}`);
    res.status(200).json(invoice);
  } catch (err) {
    logger.error(`Error al obtener la factura: ${err.message}`);
    res.status(500).json({ message: 'Error al obtener la factura' });
  }
};

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Actualizar una factura por ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Factura actualizada
 *       404:
 *         description: Factura no encontrada
 *       400:
 *         description: Error en la actualización
 */
export const updateInvoice = async (req, res) => {
  try {
    const { error } = invoiceSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) {
      logger.warn(`Factura con ID ${req.params.id} no encontrada para actualizar`);
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    logger.info(`Factura actualizada con ID: ${invoice._id}`);
    res.status(200).json(invoice);
  } catch (err) {
    logger.error(`Error al actualizar la factura: ${err.message}`);
    res.status(500).json({ message: 'Error al actualizar la factura' });
  }
};

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Eliminar una factura por ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada exitosamente
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error en la eliminación
 */
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      logger.warn(`Factura con ID ${req.params.id} no encontrada para eliminar`);
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    logger.info(`Factura eliminada con ID: ${req.params.id}`);
    res.status(200).json({ message: 'Factura eliminada exitosamente' });
  } catch (err) {
    logger.error(`Error al eliminar la factura: ${err.message}`);
    res.status(500).json({ message: 'Error al eliminar la factura' });
  }
};
