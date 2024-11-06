import Session from "../models/Session.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const sessionSchema = Joi.object({
  user: Joi.string().required(),
  token: Joi.string().required(),
  expiresAt: Joi.date().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - user
 *         - token
 *         - expiresAt
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         user:
 *           type: string
 *           description: ID del usuario asociado
 *         token:
 *           type: string
 *           description: Token de sesión
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la sesión
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de expiración de la sesión
 *       example:
 *         id: 123abc
 *         user: 456def
 *         token: "jwt.token.here"
 *         createdAt: "2024-11-05T12:34:56Z"
 *         expiresAt: "2024-11-06T12:34:56Z"
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Crear una nueva sesión
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       201:
 *         description: Sesión creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Error de validación
 */
export const createSession = async (req, res) => {
  try {
    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const session = new Session(value);
    await session.save();
    logger.info("Nueva sesión creada");
    res.status(201).json(session);
  } catch (err) {
    logger.error(`Error al crear la sesión: ${err.message}`);
    res.status(500).json({ error: "Error al crear la sesión" });
  }
};

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Obtener todas las sesiones
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Lista de todas las sesiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 */
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate("user");
    res.status(200).json(sessions);
  } catch (err) {
    logger.error(`Error al obtener las sesiones: ${err.message}`);
    res.status(500).json({ error: "Error al obtener las sesiones" });
  }
};

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Obtener una sesión por ID
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la sesión
 *     responses:
 *       200:
 *         description: Sesión obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       404:
 *         description: Sesión no encontrada
 */
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("user");
    if (!session) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }
    res.status(200).json(session);
  } catch (err) {
    logger.error(`Error al obtener la sesión: ${err.message}`);
    res.status(500).json({ error: "Error al obtener la sesión" });
  }
};

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Actualizar una sesión por ID
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       200:
 *         description: Sesión actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Sesión no encontrada
 */
export const updateSession = async (req, res) => {
  try {
    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const session = await Session.findByIdAndUpdate(req.params.id, value, { new: true }).populate("user");
    if (!session) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    logger.info(`Sesión actualizada con ID: ${req.params.id}`);
    res.status(200).json(session);
  } catch (err) {
    logger.error(`Error al actualizar la sesión: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar la sesión" });
  }
};

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Eliminar una sesión por ID
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la sesión
 *     responses:
 *       200:
 *         description: Sesión eliminada exitosamente
 *       404:
 *         description: Sesión no encontrada
 */
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    logger.info(`Sesión eliminada con ID: ${req.params.id}`);
    res.status(200).json({ message: "Sesión eliminada" });
  } catch (err) {
    logger.error(`Error al eliminar la sesión: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar la sesión" });
  }
};
