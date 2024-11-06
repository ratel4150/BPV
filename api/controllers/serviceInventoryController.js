import ServiceInventory from "../models/ServiceInventory.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const inventorySchema = Joi.object({
  service: Joi.string().required(),
  quantity: Joi.number().default(0),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceInventory:
 *       type: object
 *       required:
 *         - service
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         service:
 *           type: string
 *           description: ID del servicio asociado
 *         quantity:
 *           type: number
 *           description: Cantidad disponible del servicio
 *       example:
 *         id: 123abc
 *         service: 456def
 *         quantity: 10
 */

/**
 * @swagger
 * /api/service-inventory:
 *   post:
 *     summary: Crear un nuevo registro de inventario de servicio
 *     tags: [ServiceInventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInventory'
 *     responses:
 *       201:
 *         description: Registro de inventario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceInventory'
 *       400:
 *         description: Error de validación
 */
export const createServiceInventory = async (req, res) => {
  try {
    const { error, value } = inventorySchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const inventory = new ServiceInventory(value);
    await inventory.save();
    logger.info("Nuevo registro de inventario de servicio creado");
    res.status(201).json(inventory);
  } catch (err) {
    logger.error(`Error al crear el inventario de servicio: ${err.message}`);
    res.status(500).json({ error: "Error al crear el inventario de servicio" });
  }
};

/**
 * @swagger
 * /api/service-inventory:
 *   get:
 *     summary: Obtener todos los registros de inventario de servicio
 *     tags: [ServiceInventory]
 *     responses:
 *       200:
 *         description: Lista de todos los registros de inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceInventory'
 */
export const getAllServiceInventories = async (req, res) => {
  try {
    const inventories = await ServiceInventory.find().populate("service");
    res.status(200).json(inventories);
  } catch (err) {
    logger.error(`Error al obtener los registros de inventario: ${err.message}`);
    res.status(500).json({ error: "Error al obtener los registros de inventario" });
  }
};

/**
 * @swagger
 * /api/service-inventory/{id}:
 *   get:
 *     summary: Obtener un registro de inventario por ID
 *     tags: [ServiceInventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro de inventario
 *     responses:
 *       200:
 *         description: Registro de inventario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceInventory'
 *       404:
 *         description: Registro de inventario no encontrado
 */
export const getServiceInventoryById = async (req, res) => {
  try {
    const inventory = await ServiceInventory.findById(req.params.id).populate("service");
    if (!inventory) {
      return res.status(404).json({ error: "Registro de inventario no encontrado" });
    }
    res.status(200).json(inventory);
  } catch (err) {
    logger.error(`Error al obtener el registro de inventario: ${err.message}`);
    res.status(500).json({ error: "Error al obtener el registro de inventario" });
  }
};

/**
 * @swagger
 * /api/service-inventory/{id}:
 *   put:
 *     summary: Actualizar un registro de inventario por ID
 *     tags: [ServiceInventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro de inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInventory'
 *     responses:
 *       200:
 *         description: Registro de inventario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceInventory'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Registro de inventario no encontrado
 */
export const updateServiceInventory = async (req, res) => {
  try {
    const { error, value } = inventorySchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const inventory = await ServiceInventory.findByIdAndUpdate(req.params.id, value, { new: true }).populate("service");
    if (!inventory) {
      return res.status(404).json({ error: "Registro de inventario no encontrado" });
    }

    logger.info(`Registro de inventario actualizado con ID: ${req.params.id}`);
    res.status(200).json(inventory);
  } catch (err) {
    logger.error(`Error al actualizar el registro de inventario: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar el registro de inventario" });
  }
};

/**
 * @swagger
 * /api/service-inventory/{id}:
 *   delete:
 *     summary: Eliminar un registro de inventario por ID
 *     tags: [ServiceInventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro de inventario
 *     responses:
 *       200:
 *         description: Registro de inventario eliminado exitosamente
 *       404:
 *         description: Registro de inventario no encontrado
 */
export const deleteServiceInventory = async (req, res) => {
  try {
    const inventory = await ServiceInventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: "Registro de inventario no encontrado" });
    }

    logger.info(`Registro de inventario eliminado con ID: ${req.params.id}`);
    res.status(200).json({ message: "Registro de inventario eliminado" });
  } catch (err) {
    logger.error(`Error al eliminar el registro de inventario: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar el registro de inventario" });
  }
};
