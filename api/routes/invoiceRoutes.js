// routes/invoiceRoutes.js
import express from 'express';
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from '../controllers/InvoiceController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Gestión de facturas
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
router.post('/', createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Obtiene todas las facturas
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lista de facturas
 *       500:
 *         description: Error al obtener las facturas
 */
router.get('/', getAllInvoices);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Obtiene una factura por ID
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
router.get('/:id', getInvoiceById);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Actualiza una factura por ID
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
 *             type: object
 *             properties:
 *               ticket:
 *                 type: string
 *                 description: ID del ticket asociado
 *               amount:
 *                 type: number
 *                 description: Monto de la factura
 *     responses:
 *       200:
 *         description: Factura actualizada
 *       404:
 *         description: Factura no encontrada
 *       400:
 *         description: Error de validación
 */
router.put('/:id', updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Elimina una factura por ID
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
 *         description: Error al eliminar la factura
 */
router.delete('/:id', deleteInvoice);

export default router;
