import Service from "../models/Service.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const serviceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         name:
 *           type: string
 *           description: Nombre del servicio
 *         description:
 *           type: string
 *           description: Descripción del servicio
 *         price:
 *           type: number
 *           description: Precio del servicio
 *       example:
 *         id: 123abc
 *         name: Servicio de Consultoría
 *         description: Consultoría técnica especializada
 *         price: 1500
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Error de validación
 */
export const createService = async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const service = new Service(value);
    await service.save();
    logger.info("Nuevo servicio creado");
    res.status(201).json(service);
  } catch (err) {
    logger.error(`Error al crear el servicio: ${err.message}`);
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de todos los servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    logger.error(`Error al obtener los servicios: ${err.message}`);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Servicio no encontrado
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.status(200).json(service);
  } catch (err) {
    logger.error(`Error al obtener el servicio: ${err.message}`);
    res.status(500).json({ error: "Error al obtener el servicio" });
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Actualizar un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Servicio no encontrado
 */
export const updateService = async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const service = await Service.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    logger.info(`Servicio actualizado con ID: ${req.params.id}`);
    res.status(200).json(service);
  } catch (err) {
    logger.error(`Error al actualizar el servicio: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Eliminar un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    logger.info(`Servicio eliminado con ID: ${req.params.id}`);
    res.status(200).json({ message: "Servicio eliminado" });
  } catch (err) {
    logger.error(`Error al eliminar el servicio: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};
