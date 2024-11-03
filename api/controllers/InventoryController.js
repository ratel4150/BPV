import Inventory from '../models/Inventory.js';
import logger from '../logger.js';
import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the inventory item
 *         product:
 *           type: string
 *           description: The ID of the associated product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in inventory
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     InventoryInput:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           description: The ID of the product to be added to inventory
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in inventory
 */

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add a new item to inventory
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryInput'
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createInventoryItem = async (req, res) => {
  try {
    const inventorySchema = Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().required(),
    });

    await inventorySchema.validateAsync(req.body);

    const { product, quantity } = req.body;
    const inventoryItem = new Inventory({ product, quantity });
    await inventoryItem.save();

    logger.info(`Inventory item created: ${inventoryItem._id}`);
    res.status(201).json(inventoryItem);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error creating inventory item: ${error.message}`);
    res.status(500).json({ error: 'Error creating inventory item' });
  }
};

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Retrieve all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Internal server error
 */
export const getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().populate('product');
    logger.info(`Fetched ${inventoryItems.length} inventory items`);
    res.status(200).json(inventoryItems);
  } catch (error) {
    logger.error(`Error fetching inventory items: ${error.message}`);
    res.status(500).json({ error: 'Error fetching inventory items' });
  }
};

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Retrieve an inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The inventory item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
export const getInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id).populate('product');
    if (!inventoryItem) {
      logger.warn(`Inventory item not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    logger.info(`Fetched inventory item: ${inventoryItem._id}`);
    res.status(200).json(inventoryItem);
  } catch (error) {
    logger.error(`Error fetching inventory item: ${error.message}`);
    res.status(500).json({ error: 'Error fetching inventory item' });
  }
};

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update an inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The inventory item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryInput'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
export const updateInventoryItemById = async (req, res) => {
  try {
    const inventorySchema = Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().required(),
    });

    await inventorySchema.validateAsync(req.body);

    const { product, quantity } = req.body;
    const inventoryItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { product, quantity },
      { new: true, runValidators: true }
    );
    if (!inventoryItem) {
      logger.warn(`Inventory item not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    logger.info(`Inventory item updated: ${inventoryItem._id}`);
    res.status(200).json(inventoryItem);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error updating inventory item: ${error.message}`);
    res.status(500).json({ error: 'Error updating inventory item' });
  }
};

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The inventory item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
export const deleteInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventoryItem) {
      logger.warn(`Inventory item not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    logger.info(`Inventory item deleted: ${inventoryItem._id}`);
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting inventory item: ${error.message}`);
    res.status(500).json({ error: 'Error deleting inventory item' });
  }
};
