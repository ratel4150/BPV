import InventoryKardex from '../models/InventoryKardex.js';
import InventoryMovement from '../models/InventoryMovement.js';
import logger from '../logger.js';
import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryKardex:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the inventory kardex
 *         inventory:
 *           type: string
 *           description: The ID of the associated inventory
 *         movements:
 *           type: array
 *           items:
 *             type: string
 *           description: List of movement IDs related to the inventory
 */

/**
 * @swagger
 * tags:
 *   name: InventoryKardex
 *   description: Inventory kardex management
 */

/**
 * @swagger
 * /inventoryKardex:
 *   post:
 *     summary: Create a new inventory kardex
 *     tags: [InventoryKardex]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inventory:
 *                 type: string
 *               movements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Inventory kardex created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createInventoryKardex = async (req, res) => {
  try {
    const kardexSchema = Joi.object({
      inventory: Joi.string().required(),
      movements: Joi.array().items(Joi.string()).optional(),
    });

    await kardexSchema.validateAsync(req.body);

    const { inventory, movements = [] } = req.body;
    const kardex = new InventoryKardex({ inventory, movements });
    await kardex.save();

    logger.info(`Inventory kardex created: ${kardex._id}`);
    res.status(201).json(kardex);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error creating inventory kardex: ${error.message}`);
    res.status(500).json({ error: 'Error creating inventory kardex' });
  }
};

/**
 * @swagger
 * /inventoryKardex:
 *   get:
 *     summary: Retrieve all inventory kardex records
 *     tags: [InventoryKardex]
 *     responses:
 *       200:
 *         description: List of inventory kardex records
 *       500:
 *         description: Internal server error
 */
export const getAllInventoryKardex = async (req, res) => {
  try {
    const kardexRecords = await InventoryKardex.find().populate('inventory movements');
    logger.info(`Fetched ${kardexRecords.length} inventory kardex records`);
    res.status(200).json(kardexRecords);
  } catch (error) {
    logger.error(`Error fetching inventory kardex records: ${error.message}`);
    res.status(500).json({ error: 'Error fetching inventory kardex records' });
  }
};

/**
 * @swagger
 * /inventoryKardex/{id}:
 *   get:
 *     summary: Retrieve an inventory kardex by ID
 *     tags: [InventoryKardex]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory kardex ID
 *     responses:
 *       200:
 *         description: Inventory kardex found
 *       404:
 *         description: Inventory kardex not found
 *       500:
 *         description: Internal server error
 */
export const getInventoryKardexById = async (req, res) => {
  try {
    const kardex = await InventoryKardex.findById(req.params.id).populate('inventory movements');
    if (!kardex) {
      logger.warn(`Inventory kardex not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Inventory kardex not found' });
    }
    logger.info(`Fetched inventory kardex: ${kardex._id}`);
    res.status(200).json(kardex);
  } catch (error) {
    logger.error(`Error fetching inventory kardex: ${error.message}`);
    res.status(500).json({ error: 'Error fetching inventory kardex' });
  }
};

/**
 * @swagger
 * /inventoryKardex/{id}:
 *   put:
 *     summary: Update an inventory kardex by ID
 *     tags: [InventoryKardex]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory kardex ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Inventory kardex updated successfully
 *       404:
 *         description: Inventory kardex not found
 *       500:
 *         description: Internal server error
 */
export const updateInventoryKardexById = async (req, res) => {
  try {
    const { movements } = req.body;
    const kardex = await InventoryKardex.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { movements: { $each: movements } } },
      { new: true, runValidators: true }
    );
    if (!kardex) {
      logger.warn(`Inventory kardex not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Inventory kardex not found' });
    }
    logger.info(`Inventory kardex updated: ${kardex._id}`);
    res.status(200).json(kardex);
  } catch (error) {
    logger.error(`Error updating inventory kardex: ${error.message}`);
    res.status(500).json({ error: 'Error updating inventory kardex' });
  }
};

/**
 * @swagger
 * /inventoryKardex/{id}:
 *   delete:
 *     summary: Delete an inventory kardex by ID
 *     tags: [InventoryKardex]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory kardex ID
 *     responses:
 *       200:
 *         description: Inventory kardex deleted successfully
 *       404:
 *         description: Inventory kardex not found
 *       500:
 *         description: Internal server error
 */
export const deleteInventoryKardexById = async (req, res) => {
  try {
    const kardex = await InventoryKardex.findByIdAndDelete(req.params.id);
    if (!kardex) {
      logger.warn(`Inventory kardex not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Inventory kardex not found' });
    }
    logger.info(`Inventory kardex deleted: ${kardex._id}`);
    res.status(200).json({ message: 'Inventory kardex deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting inventory kardex: ${error.message}`);
    res.status(500).json({ error: 'Error deleting inventory kardex' });
  }
};
