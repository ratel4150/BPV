import SalesReport from "../models/SalesReport.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener el archivo logger.js en config

// Esquema de validación con Joi
const salesReportSchema = Joi.object({
  date: Joi.date().default(Date.now),
  totalSales: Joi.number().required(),
  itemsSold: Joi.number().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SalesReport:
 *       type: object
 *       required:
 *         - totalSales
 *         - itemsSold
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha del reporte
 *         totalSales:
 *           type: number
 *           description: Total de ventas en el reporte
 *         itemsSold:
 *           type: number
 *           description: Número de artículos vendidos en el reporte
 *       example:
 *         id: 123abc
 *         date: 2023-08-15T00:00:00.000Z
 *         totalSales: 5000
 *         itemsSold: 120
 */

/**
 * @swagger
 * /api/sales-reports:
 *   post:
 *     summary: Crear un nuevo reporte de ventas
 *     tags: [SalesReports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesReport'
 *     responses:
 *       201:
 *         description: Reporte de ventas creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesReport'
 *       400:
 *         description: Error de validación
 */
export const createSalesReport = async (req, res) => {
  try {
    const { error, value } = salesReportSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const salesReport = new SalesReport(value);
    await salesReport.save();
    logger.info("Nuevo reporte de ventas creado");
    res.status(201).json(salesReport);
  } catch (err) {
    logger.error(`Error al crear el reporte de ventas: ${err.message}`);
    res.status(500).json({ error: "Error al crear el reporte de ventas" });
  }
};

/**
 * @swagger
 * /api/sales-reports:
 *   get:
 *     summary: Obtener todos los reportes de ventas
 *     tags: [SalesReports]
 *     responses:
 *       200:
 *         description: Lista de todos los reportes de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesReport'
 */
export const getAllSalesReports = async (req, res) => {
  try {
    const salesReports = await SalesReport.find();
    res.status(200).json(salesReports);
  } catch (err) {
    logger.error(`Error al obtener los reportes de ventas: ${err.message}`);
    res.status(500).json({ error: "Error al obtener los reportes de ventas" });
  }
};

/**
 * @swagger
 * /api/sales-reports/{id}:
 *   get:
 *     summary: Obtener un reporte de ventas por ID
 *     tags: [SalesReports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del reporte de ventas
 *     responses:
 *       200:
 *         description: Reporte de ventas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesReport'
 *       404:
 *         description: Reporte de ventas no encontrado
 */
export const getSalesReportById = async (req, res) => {
  try {
    const salesReport = await SalesReport.findById(req.params.id);
    if (!salesReport) {
      return res.status(404).json({ error: "Reporte de ventas no encontrado" });
    }
    res.status(200).json(salesReport);
  } catch (err) {
    logger.error(`Error al obtener el reporte de ventas: ${err.message}`);
    res.status(500).json({ error: "Error al obtener el reporte de ventas" });
  }
};

/**
 * @swagger
 * /api/sales-reports/{id}:
 *   put:
 *     summary: Actualizar un reporte de ventas por ID
 *     tags: [SalesReports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del reporte de ventas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesReport'
 *     responses:
 *       200:
 *         description: Reporte de ventas actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesReport'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reporte de ventas no encontrado
 */
export const updateSalesReport = async (req, res) => {
  try {
    const { error, value } = salesReportSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const salesReport = await SalesReport.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!salesReport) {
      return res.status(404).json({ error: "Reporte de ventas no encontrado" });
    }

    logger.info(`Reporte de ventas actualizado con ID: ${req.params.id}`);
    res.status(200).json(salesReport);
  } catch (err) {
    logger.error(`Error al actualizar el reporte de ventas: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar el reporte de ventas" });
  }
};

/**
 * @swagger
 * /api/sales-reports/{id}:
 *   delete:
 *     summary: Eliminar un reporte de ventas por ID
 *     tags: [SalesReports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del reporte de ventas
 *     responses:
 *       200:
 *         description: Reporte de ventas eliminado exitosamente
 *       404:
 *         description: Reporte de ventas no encontrado
 */
export const deleteSalesReport = async (req, res) => {
  try {
    const salesReport = await SalesReport.findByIdAndDelete(req.params.id);
    if (!salesReport) {
      return res.status(404).json({ error: "Reporte de ventas no encontrado" });
    }

    logger.info(`Reporte de ventas eliminado con ID: ${req.params.id}`);
    res.status(200).json({ message: "Reporte de ventas eliminado" });
  } catch (err) {
    logger.error(`Error al eliminar el reporte de ventas: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar el reporte de ventas" });
  }
};
