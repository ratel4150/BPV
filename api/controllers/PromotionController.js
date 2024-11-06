// api/controllers/PromotionController.js
import Joi from 'joi';
import Promotion from '../models/Promotion.js';
import logger from '../logger.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la promoción.
 *         description:
 *           type: string
 *           description: Descripción de la promoción.
 *         discount:
 *           type: number
 *           description: Descuento de la promoción.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio de la promoción.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de fin de la promoción.
 */

/**
 * @swagger
 * /promotions:
 *   post:
 *     summary: Crea una nueva promoción.
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promotion'
 *     responses:
 *       201:
 *         description: Promoción creada exitosamente.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error en el servidor.
 */
export const createPromotion = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    discount: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newPromotion = new Promotion(req.body);
    await newPromotion.save();
    logger.info('Promotion created successfully');
    res.status(201).json(newPromotion);
  } catch (err) {
    logger.error(`Error creating promotion: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Obtiene todas las promociones.
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: Lista de promociones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 *       500:
 *         description: Error en el servidor.
 */
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    logger.info('Fetched all promotions');
    res.status(200).json(promotions);
  } catch (err) {
    logger.error(`Error fetching promotions: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /promotions/{id}:
 *   get:
 *     summary: Obtiene una promoción por ID.
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción.
 *     responses:
 *       200:
 *         description: Promoción obtenida exitosamente.
 *       404:
 *         description: Promoción no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      logger.warn(`Promotion with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Promotion not found' });
    }
    logger.info(`Fetched promotion with ID ${req.params.id}`);
    res.status(200).json(promotion);
  } catch (err) {
    logger.error(`Error fetching promotion: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /promotions/{id}:
 *   put:
 *     summary: Actualiza una promoción por ID.
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promotion'
 *     responses:
 *       200:
 *         description: Promoción actualizada exitosamente.
 *       404:
 *         description: Promoción no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
export const updatePromotion = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    discount: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) {
      logger.warn(`Promotion with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Promotion not found' });
    }
    logger.info(`Promotion with ID ${req.params.id} updated`);
    res.status(200).json(promotion);
  } catch (err) {
    logger.error(`Error updating promotion: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Elimina una promoción por ID.
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción.
 *     responses:
 *       204:
 *         description: Promoción eliminada exitosamente.
 *       404:
 *         description: Promoción no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      logger.warn(`Promotion with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Promotion not found' });
    }
    logger.info(`Promotion with ID ${req.params.id} deleted`);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting promotion: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};
