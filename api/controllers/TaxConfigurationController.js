import TaxConfiguration from "../models/TaxConfiguration.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const taxConfigurationSchema = Joi.object({
  name: Joi.string().required(),
  rate: Joi.number().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     TaxConfiguration:
 *       type: object
 *       required:
 *         - name
 *         - rate
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         name:
 *           type: string
 *           description: Nombre de la configuración de impuesto
 *         rate:
 *           type: number
 *           description: Tasa de impuesto
 *       example:
 *         id: 123abc
 *         name: "IVA"
 *         rate: 21
 */

/**
 * @swagger
 * /api/tax-configurations:
 *   post:
 *     summary: Crear una nueva configuración de impuesto
 *     tags: [TaxConfiguration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxConfiguration'
 *     responses:
 *       201:
 *         description: Configuración de impuesto creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxConfiguration'
 *       400:
 *         description: Error de validación
 */
export const createTaxConfiguration = async (req, res) => {
  try {
    const { error, value } = taxConfigurationSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const taxConfiguration = new TaxConfiguration(value);
    await taxConfiguration.save();
    logger.info("Nueva configuración de impuesto creada");
    res.status(201).json(taxConfiguration);
  } catch (err) {
    logger.error(`Error al crear la configuración de impuesto: ${err.message}`);
    res.status(500).json({ error: "Error al crear la configuración de impuesto" });
  }
};

/**
 * @swagger
 * /api/tax-configurations:
 *   get:
 *     summary: Obtener todas las configuraciones de impuesto
 *     tags: [TaxConfiguration]
 *     responses:
 *       200:
 *         description: Lista de todas las configuraciones de impuesto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaxConfiguration'
 */
export const getAllTaxConfigurations = async (req, res) => {
  try {
    const taxConfigurations = await TaxConfiguration.find();
    res.status(200).json(taxConfigurations);
  } catch (err) {
    logger.error(`Error al obtener las configuraciones de impuesto: ${err.message}`);
    res.status(500).json({ error: "Error al obtener las configuraciones de impuesto" });
  }
};

/**
 * @swagger
 * /api/tax-configurations/{id}:
 *   get:
 *     summary: Obtener una configuración de impuesto por ID
 *     tags: [TaxConfiguration]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la configuración de impuesto
 *     responses:
 *       200:
 *         description: Configuración de impuesto obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxConfiguration'
 *       404:
 *         description: Configuración de impuesto no encontrada
 */
export const getTaxConfigurationById = async (req, res) => {
  try {
    const taxConfiguration = await TaxConfiguration.findById(req.params.id);
    if (!taxConfiguration) {
      return res.status(404).json({ error: "Configuración de impuesto no encontrada" });
    }
    res.status(200).json(taxConfiguration);
  } catch (err) {
    logger.error(`Error al obtener la configuración de impuesto: ${err.message}`);
    res.status(500).json({ error: "Error al obtener la configuración de impuesto" });
  }
};

/**
 * @swagger
 * /api/tax-configurations/{id}:
 *   put:
 *     summary: Actualizar una configuración de impuesto por ID
 *     tags: [TaxConfiguration]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la configuración de impuesto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxConfiguration'
 *     responses:
 *       200:
 *         description: Configuración de impuesto actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxConfiguration'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Configuración de impuesto no encontrada
 */
export const updateTaxConfiguration = async (req, res) => {
  try {
    const { error, value } = taxConfigurationSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const taxConfiguration = await TaxConfiguration.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!taxConfiguration) {
      return res.status(404).json({ error: "Configuración de impuesto no encontrada" });
    }

    logger.info(`Configuración de impuesto actualizada con ID: ${req.params.id}`);
    res.status(200).json(taxConfiguration);
  } catch (err) {
    logger.error(`Error al actualizar la configuración de impuesto: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar la configuración de impuesto" });
  }
};

/**
 * @swagger
 * /api/tax-configurations/{id}:
 *   delete:
 *     summary: Eliminar una configuración de impuesto por ID
 *     tags: [TaxConfiguration]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la configuración de impuesto
 *     responses:
 *       200:
 *         description: Configuración de impuesto eliminada exitosamente
 *       404:
 *         description: Configuración de impuesto no encontrada
 */
export const deleteTaxConfiguration = async (req, res) => {
  try {
    const taxConfiguration = await TaxConfiguration.findByIdAndDelete(req.params.id);
    if (!taxConfiguration) {
      return res.status(404).json({ error: "Configuración de impuesto no encontrada" });
    }

    logger.info(`Configuración de impuesto eliminada con ID: ${req.params.id}`);
    res.status(200).json({ message: "Configuración de impuesto eliminada" });
  } catch (err) {
    logger.error(`Error al eliminar la configuración de impuesto: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar la configuración de impuesto" });
  }
};
