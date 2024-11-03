// controllers/cashierController.js
import Cashier from '../models/Cashier.js';
import logger from '../logger.js';

/**
 * @swagger
 * tags:
 *   name: Cashiers
 *   description: Operaciones relacionadas con los cajeros
 */

/**
 * @swagger
 * /cashiers:
 *   post:
 *     summary: Crea un nuevo cajero
 *     tags: [Cashiers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del cajero
 *                 example: "John Doe"
 *               shiftStart:
 *                 type: string
 *                 format: date-time
 *                 description: Inicio del turno
 *                 example: "2024-10-29T08:00:00Z"
 *     responses:
 *       201:
 *         description: Cajero creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
export const createCashier = async (req, res) => {
  try {
    const { name, shiftStart, shiftEnd } = req.body;
    const cashier = new Cashier({ name, shiftStart, shiftEnd });
    await cashier.save();
    logger.info(`Cajero creado: ${cashier.name}`);
    res.status(201).json(cashier);
  } catch (error) {
    logger.error(`Error creando cajero: ${error.message}`);
    res.status(500).json({ error: 'Error creando el cajero' });
  }
};

/**
 * @swagger
 * /cashiers:
 *   get:
 *     summary: Obtiene todos los cajeros
 *     tags: [Cashiers]
 *     responses:
 *       200:
 *         description: Lista de cajeros obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */
export const getAllCashiers = async (req, res) => {
  try {
    const cashiers = await Cashier.find();
    logger.info('Lista de cajeros obtenida');
    res.status(200).json(cashiers);
  } catch (error) {
    logger.error(`Error obteniendo lista de cajeros: ${error.message}`);
    res.status(500).json({ error: 'Error obteniendo la lista de cajeros' });
  }
};

/**
 * @swagger
 * /cashiers/{id}:
 *   get:
 *     summary: Obtiene un cajero por ID
 *     tags: [Cashiers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cajero
 *     responses:
 *       200:
 *         description: Cajero encontrado
 *       404:
 *         description: Cajero no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const getCashierById = async (req, res) => {
  try {
    const { id } = req.params;
    const cashier = await Cashier.findById(id);
    if (!cashier) {
      logger.warn(`Cajero con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Cajero no encontrado' });
    }
    logger.info(`Cajero encontrado: ${cashier.name}`);
    res.status(200).json(cashier);
  } catch (error) {
    logger.error(`Error obteniendo cajero: ${error.message}`);
    res.status(500).json({ error: 'Error obteniendo el cajero' });
  }
};

/**
 * @swagger
 * /cashiers/{id}:
 *   delete:
 *     summary: Elimina un cajero por ID
 *     tags: [Cashiers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cajero
 *     responses:
 *       200:
 *         description: Cajero eliminado
 *       404:
 *         description: Cajero no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const deleteCashierById = async (req, res) => {
  try {
    const { id } = req.params;
    const cashier = await Cashier.findByIdAndDelete(id);
    if (!cashier) {
      logger.warn(`Cajero con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Cajero no encontrado' });
    }
    logger.info(`Cajero eliminado: ${cashier.name}`);
    res.status(200).json({ message: 'Cajero eliminado' });
  } catch (error) {
    logger.error(`Error eliminando cajero: ${error.message}`);
    res.status(500).json({ error: 'Error eliminando el cajero' });
  }
};
