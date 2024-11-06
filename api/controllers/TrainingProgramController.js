import TrainingProgram from "../models/TrainingProgram.js";
import Joi from "joi";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const trainingProgramSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  duration: Joi.number().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingProgram:
 *       type: object
 *       required:
 *         - name
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         name:
 *           type: string
 *           description: Nombre del programa de entrenamiento
 *         description:
 *           type: string
 *           description: Descripción del programa de entrenamiento
 *         duration:
 *           type: number
 *           description: Duración del programa en horas
 *       example:
 *         id: 123abc
 *         name: "Programa de Entrenamiento Avanzado"
 *         description: "Un programa de entrenamiento para habilidades avanzadas."
 *         duration: 40
 */

/**
 * @swagger
 * /api/training-programs:
 *   post:
 *     summary: Crear un nuevo programa de entrenamiento
 *     tags: [TrainingProgram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainingProgram'
 *     responses:
 *       201:
 *         description: Programa de entrenamiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingProgram'
 *       400:
 *         description: Error de validación
 */
export const createTrainingProgram = async (req, res) => {
  try {
    const { error, value } = trainingProgramSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const trainingProgram = new TrainingProgram(value);
    await trainingProgram.save();
    logger.info("Nuevo programa de entrenamiento creado");
    res.status(201).json(trainingProgram);
  } catch (err) {
    logger.error(`Error al crear el programa de entrenamiento: ${err.message}`);
    res.status(500).json({ error: "Error al crear el programa de entrenamiento" });
  }
};

/**
 * @swagger
 * /api/training-programs:
 *   get:
 *     summary: Obtener todos los programas de entrenamiento
 *     tags: [TrainingProgram]
 *     responses:
 *       200:
 *         description: Lista de todos los programas de entrenamiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrainingProgram'
 */
export const getAllTrainingPrograms = async (req, res) => {
  try {
    const trainingPrograms = await TrainingProgram.find();
    res.status(200).json(trainingPrograms);
  } catch (err) {
    logger.error(`Error al obtener los programas de entrenamiento: ${err.message}`);
    res.status(500).json({ error: "Error al obtener los programas de entrenamiento" });
  }
};

/**
 * @swagger
 * /api/training-programs/{id}:
 *   get:
 *     summary: Obtener un programa de entrenamiento por ID
 *     tags: [TrainingProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del programa de entrenamiento
 *     responses:
 *       200:
 *         description: Programa de entrenamiento obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingProgram'
 *       404:
 *         description: Programa de entrenamiento no encontrado
 */
export const getTrainingProgramById = async (req, res) => {
  try {
    const trainingProgram = await TrainingProgram.findById(req.params.id);
    if (!trainingProgram) {
      return res.status(404).json({ error: "Programa de entrenamiento no encontrado" });
    }
    res.status(200).json(trainingProgram);
  } catch (err) {
    logger.error(`Error al obtener el programa de entrenamiento: ${err.message}`);
    res.status(500).json({ error: "Error al obtener el programa de entrenamiento" });
  }
};

/**
 * @swagger
 * /api/training-programs/{id}:
 *   put:
 *     summary: Actualizar un programa de entrenamiento por ID
 *     tags: [TrainingProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del programa de entrenamiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainingProgram'
 *     responses:
 *       200:
 *         description: Programa de entrenamiento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingProgram'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Programa de entrenamiento no encontrado
 */
export const updateTrainingProgram = async (req, res) => {
  try {
    const { error, value } = trainingProgramSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const trainingProgram = await TrainingProgram.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!trainingProgram) {
      return res.status(404).json({ error: "Programa de entrenamiento no encontrado" });
    }

    logger.info(`Programa de entrenamiento actualizado con ID: ${req.params.id}`);
    res.status(200).json(trainingProgram);
  } catch (err) {
    logger.error(`Error al actualizar el programa de entrenamiento: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar el programa de entrenamiento" });
  }
};

/**
 * @swagger
 * /api/training-programs/{id}:
 *   delete:
 *     summary: Eliminar un programa de entrenamiento por ID
 *     tags: [TrainingProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del programa de entrenamiento
 *     responses:
 *       200:
 *         description: Programa de entrenamiento eliminado exitosamente
 *       404:
 *         description: Programa de entrenamiento no encontrado
 */
export const deleteTrainingProgram = async (req, res) => {
  try {
    const trainingProgram = await TrainingProgram.findByIdAndDelete(req.params.id);
    if (!trainingProgram) {
      return res.status(404).json({ error: "Programa de entrenamiento no encontrado" });
    }

    logger.info(`Programa de entrenamiento eliminado con ID: ${req.params.id}`);
    res.status(200).json({ message: "Programa de entrenamiento eliminado" });
  } catch (err) {
    logger.error(`Error al eliminar el programa de entrenamiento: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar el programa de entrenamiento" });
  }
};
