// controllers/loyaltyProgramController.js
import Joi from 'joi';
import logger from '../logger.js'; // Asegúrate de que el archivo logger.js esté configurado
import LoyaltyProgram from '../models/LoyaltyProgram.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoyaltyProgram:
 *       type: object
 *       required:
 *         - name
 *         - pointsPerDollar
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del programa de lealtad
 *         name:
 *           type: string
 *           description: Nombre del programa de lealtad
 *         pointsPerDollar:
 *           type: number
 *           description: Puntos otorgados por cada dólar gastado
 *       example:
 *         id: "603e4c8b0f1b2c001e5fbb77"
 *         name: "VIP Rewards"
 *         pointsPerDollar: 10
 */

/**
 * @swagger
 * tags:
 *   name: LoyaltyPrograms
 *   description: API para gestionar programas de lealtad
 */

// Validación con Joi
const loyaltyProgramSchema = Joi.object({
  name: Joi.string().required(),
  pointsPerDollar: Joi.number().required(),
});

/**
 * Crea un nuevo programa de lealtad
 */
export const createLoyaltyProgram = async (req, res) => {
  const { error, value } = loyaltyProgramSchema.validate(req.body);
  if (error) {
    logger.error(`Error de validación en createLoyaltyProgram: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const loyaltyProgram = new LoyaltyProgram(value);
    const savedProgram = await loyaltyProgram.save();
    logger.info('Programa de lealtad creado exitosamente', { loyaltyProgram: savedProgram });
    res.status(201).json(savedProgram);
  } catch (err) {
    logger.error('Error al crear el programa de lealtad', err);
    res.status(500).json({ error: 'Error al crear el programa de lealtad' });
  }
};

/**
 * @swagger
 * /loyalty-programs:
 *   get:
 *     summary: Obtiene todos los programas de lealtad
 *     tags: [LoyaltyPrograms]
 *     responses:
 *       200:
 *         description: Lista de programas de lealtad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LoyaltyProgram'
 *       500:
 *         description: Error al obtener los programas de lealtad
 */
export const getAllLoyaltyPrograms = async (req, res) => {
  try {
    const programs = await LoyaltyProgram.find();
    logger.info('Todos los programas de lealtad obtenidos correctamente');
    res.json(programs);
  } catch (err) {
    logger.error('Error al obtener los programas de lealtad', err);
    res.status(500).json({ error: 'Error al obtener los programas de lealtad' });
  }
};

/**
 * @swagger
 * /loyalty-programs/{id}:
 *   get:
 *     summary: Obtiene un programa de lealtad por ID
 *     tags: [LoyaltyPrograms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del programa de lealtad
 *     responses:
 *       200:
 *         description: Programa de lealtad encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyProgram'
 *       404:
 *         description: Programa de lealtad no encontrado
 *       500:
 *         description: Error al obtener el programa de lealtad
 */
export const getLoyaltyProgramById = async (req, res) => {
  try {
    const program = await LoyaltyProgram.findById(req.params.id);
    if (!program) {
      logger.warn(`Programa de lealtad con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ error: 'Programa de lealtad no encontrado' });
    }
    res.json(program);
  } catch (err) {
    logger.error('Error al obtener el programa de lealtad', err);
    res.status(500).json({ error: 'Error al obtener el programa de lealtad' });
  }
};

/**
 * @swagger
 * /loyalty-programs/{id}:
 *   put:
 *     summary: Actualiza un programa de lealtad por ID
 *     tags: [LoyaltyPrograms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del programa de lealtad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyProgram'
 *     responses:
 *       200:
 *         description: Programa de lealtad actualizado exitosamente
 *       404:
 *         description: Programa de lealtad no encontrado
 *       400:
 *         description: Error de validación
 */
export const updateLoyaltyProgram = async (req, res) => {
  const { error, value } = loyaltyProgramSchema.validate(req.body);
  if (error) {
    logger.error(`Error de validación en updateLoyaltyProgram: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const program = await LoyaltyProgram.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!program) {
      logger.warn(`Programa de lealtad con ID ${req.params.id} no encontrado para actualización`);
      return res.status(404).json({ error: 'Programa de lealtad no encontrado' });
    }
    logger.info('Programa de lealtad actualizado correctamente', { program });
    res.json(program);
  } catch (err) {
    logger.error('Error al actualizar el programa de lealtad', err);
    res.status(500).json({ error: 'Error al actualizar el programa de lealtad' });
  }
};

/**
 * @swagger
 * /loyalty-programs/{id}:
 *   delete:
 *     summary: Elimina un programa de lealtad por ID
 *     tags: [LoyaltyPrograms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del programa de lealtad
 *     responses:
 *       200:
 *         description: Programa de lealtad eliminado exitosamente
 *       404:
 *         description: Programa de lealtad no encontrado
 *       500:
 *         description: Error al eliminar el programa de lealtad
 */
export const deleteLoyaltyProgram = async (req, res) => {
  try {
    const program = await LoyaltyProgram.findByIdAndDelete(req.params.id);
    if (!program) {
      logger.warn(`Programa de lealtad con ID ${req.params.id} no encontrado para eliminación`);
      return res.status(404).json({ error: 'Programa de lealtad no encontrado' });
    }
    logger.info('Programa de lealtad eliminado correctamente', { program });
    res.json({ message: 'Programa de lealtad eliminado correctamente' });
  } catch (err) {
    logger.error('Error al eliminar el programa de lealtad', err);
    res.status(500).json({ error: 'Error al eliminar el programa de lealtad' });
  }
};
