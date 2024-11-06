import Ticket from "../models/Ticket.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const ticketSchema = Joi.object({
  customer: Joi.string().required(),
  cashier: Joi.string().required(),
  details: Joi.array().items(Joi.string()).required(),
  totalAmount: Joi.number().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - customer
 *         - cashier
 *         - details
 *         - totalAmount
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         customer:
 *           type: string
 *           description: ID del cliente
 *         cashier:
 *           type: string
 *           description: ID del cajero
 *         details:
 *           type: array
 *           items:
 *             type: string
 *           description: Detalles del ticket
 *         totalAmount:
 *           type: number
 *           description: Monto total del ticket
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del ticket
 *       example:
 *         id: 123abc
 *         customer: "customerId123"
 *         cashier: "cashierId456"
 *         details: ["detailId1", "detailId2"]
 *         totalAmount: 150.00
 *         createdAt: "2024-11-05T12:00:00Z"
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error de validación
 */
export const createTicket = async (req, res) => {
  try {
    const { error, value } = ticketSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const ticket = new Ticket(value);
    await ticket.save();
    logger.info("Nuevo ticket creado");
    res.status(201).json(ticket);
  } catch (err) {
    logger.error(`Error al crear el ticket: ${err.message}`);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Ticket]
 *     responses:
 *       200:
 *         description: Lista de todos los tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('customer cashier details');
    res.status(200).json(tickets);
  } catch (err) {
    logger.error(`Error al obtener los tickets: ${err.message}`);
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
};

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtener un ticket por ID
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket no encontrado
 */
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('customer cashier details');
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.status(200).json(ticket);
  } catch (err) {
    logger.error(`Error al obtener el ticket: ${err.message}`);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket por ID
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Ticket no encontrado
 */
export const updateTicket = async (req, res) => {
  try {
    const { error, value } = ticketSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, value, { new: true }).populate('customer cashier details');
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    logger.info(`Ticket actualizado con ID: ${req.params.id}`);
    res.status(200).json(ticket);
  } catch (err) {
    logger.error(`Error al actualizar el ticket: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar el ticket" });
  }
};

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Eliminar un ticket por ID
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket eliminado exitosamente
 *       404:
 *         description: Ticket no encontrado
 */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    logger.info(`Ticket eliminado con ID: ${req.params.id}`);
    res.status(200).json({ message: "Ticket eliminado" });
  } catch (err) {
    logger.error(`Error al eliminar el ticket: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar el ticket" });
  }
};
