import DiscountHistory from '../models/DiscountHistory.js';
import logger from '../logger.js';
import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     DiscountHistory:
 *       type: object
 *       required:
 *         - user
 *         - discount
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the discount history
 *         user:
 *           type: string
 *           description: The ID of the user associated with the discount
 *         discount:
 *           type: number
 *           format: float
 *           description: The discount amount applied
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the discount was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the discount was last updated
 *     DiscountHistoryInput:
 *       type: object
 *       required:
 *         - user
 *         - discount
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user associated with the discount
 *         discount:
 *           type: number
 *           format: float
 *           description: The discount amount applied
 */

/**
 * @swagger
 * tags:
 *   name: DiscountHistories
 *   description: Management of discount histories
 */

/**
 * @swagger
 * /discount-histories:
 *   post:
 *     summary: Create a new discount history
 *     tags: [DiscountHistories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountHistoryInput'
 *     responses:
 *       201:
 *         description: Discount history created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountHistory'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createDiscountHistory = async (req, res) => {
  try {
    // Validate request body
    const discountHistorySchema = Joi.object({
      user: Joi.string().required(),
      discount: Joi.number().required(),
    });

    await discountHistorySchema.validateAsync(req.body);
    
    const { user, discount } = req.body;
    const discountHistory = new DiscountHistory({ user, discount });
    await discountHistory.save();
    
    logger.info(`Discount history created: ${discountHistory._id}`);
    res.status(201).json(discountHistory);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error creating discount history: ${error.message}`);
    res.status(500).json({ error: 'Error creating discount history' });
  }
};

/**
 * @swagger
 * /discount-histories:
 *   get:
 *     summary: Get all discount histories
 *     tags: [DiscountHistories]
 *     responses:
 *       200:
 *         description: List of discount histories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountHistory'
 *       500:
 *         description: Internal server error
 */
export const getAllDiscountHistories = async (req, res) => {
  try {
    const discountHistories = await DiscountHistory.find().populate('user', 'name email');
    logger.info(`Fetched ${discountHistories.length} discount histories`);
    res.status(200).json(discountHistories);
  } catch (error) {
    logger.error(`Error fetching discount histories: ${error.message}`);
    res.status(500).json({ error: 'Error fetching discount histories' });
  }
};

/**
 * @swagger
 * /discount-histories/{id}:
 *   get:
 *     summary: Get discount history by ID
 *     tags: [DiscountHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The discount history ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount history found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountHistory'
 *       404:
 *         description: Discount history not found
 *       500:
 *         description: Internal server error
 */
export const getDiscountHistoryById = async (req, res) => {
  try {
    const discountHistory = await DiscountHistory.findById(req.params.id).populate('user', 'name email');
    if (!discountHistory) {
      logger.warn(`Discount history not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Discount history not found' });
    }
    logger.info(`Fetched discount history: ${discountHistory._id}`);
    res.status(200).json(discountHistory);
  } catch (error) {
    logger.error(`Error fetching discount history: ${error.message}`);
    res.status(500).json({ error: 'Error fetching discount history' });
  }
};

/**
 * @swagger
 * /discount-histories/{id}:
 *   delete:
 *     summary: Delete discount history by ID
 *     tags: [DiscountHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The discount history ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount history deleted successfully
 *       404:
 *         description: Discount history not found
 *       500:
 *         description: Internal server error
 */
export const deleteDiscountHistoryById = async (req, res) => {
  try {
    const discountHistory = await DiscountHistory.findByIdAndDelete(req.params.id);
    if (!discountHistory) {
      logger.warn(`Discount history not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Discount history not found' });
    }
    logger.info(`Discount history deleted: ${discountHistory._id}`);
    res.status(200).json({ message: 'Discount history deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting discount history: ${error.message}`);
    res.status(500).json({ error: 'Error deleting discount history' });
  }
};

/**
 * @swagger
 * /discount-histories/{id}:
 *   put:
 *     summary: Update discount history by ID
 *     tags: [DiscountHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The discount history ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountHistoryInput'
 *     responses:
 *       200:
 *         description: Discount history updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountHistory'
 *       404:
 *         description: Discount history not found
 *       500:
 *         description: Internal server error
 */
export const updateDiscountHistoryById = async (req, res) => {
  try {
    // Validate request body
    const discountHistorySchema = Joi.object({
      user: Joi.string().required(),
      discount: Joi.number().required(),
    });
    
    await discountHistorySchema.validateAsync(req.body);
    
    const { user, discount } = req.body;
    const discountHistory = await DiscountHistory.findByIdAndUpdate(
      req.params.id,
      { user, discount },
      { new: true, runValidators: true }
    );
    if (!discountHistory) {
      logger.warn(`Discount history not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Discount history not found' });
    }
    logger.info(`Discount history updated: ${discountHistory._id}`);
    res.status(200).json(discountHistory);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error updating discount history: ${error.message}`);
    res.status(500).json({ error: 'Error updating discount history' });
  }
};
