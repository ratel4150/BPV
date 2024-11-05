import InventoryMovement from '../models/InventoryMovement.js';
import Inventory from '../models/Inventory.js';
import logger from '../logger.js';
import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       required:
 *         - inventory
 *         - type
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the inventory movement
 *         inventory:
 *           type: string
 *           description: The ID of the related inventory
 *         type:
 *           type: string
 *           enum: [IN, OUT]
 *           description: The type of movement (IN or OUT)
 *         quantity:
 *           type: integer
 *           description: The quantity of the movement
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the movement
 *       example:
 *         _id: 609e9b1283b2f23c8c4b4d10
 *         inventory: 609e9a1b3b2f23c8c4b4cdef
 *         type: IN
 *         quantity: 50
 *         date: 2024-10-31T15:21:54.000Z
 */

/**
 * @swagger
 * tags:
 *   name: InventoryMovement
 *   description: API for managing inventory movements
 */

/**
 * @swagger
 * /inventory-movement:
 *   post:
 *     summary: Create a new inventory movement
 *     tags: [InventoryMovement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryMovement'
 *     responses:
 *       201:
 *         description: Inventory movement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryMovement'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createInventoryMovement = async (req, res) => {
  try {
    const movementSchema = Joi.object({
      inventory: Joi.string().required(),
      type: Joi.string().valid('IN', 'OUT').required(),
      quantity: Joi.number().integer().positive().required(),
    });

    await movementSchema.validateAsync(req.body);

    const { inventory, type, quantity } = req.body;
    const movement = new InventoryMovement({ inventory, type, quantity });
    await movement.save();

    logger.info(`Inventory movement created: ${movement._id}`);
    res.status(201).json(movement);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error creating inventory movement: ${error.message}`);
    res.status(500).json({ error: 'Error creating inventory movement' });
  }
};

/**
 * @swagger
 * /inventory-movement/{inventoryId}:
 *   get:
 *     summary: Get all movements for a specific inventory
 *     tags: [InventoryMovement]
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the inventory
 *     responses:
 *       200:
 *         description: List of inventory movements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryMovement'
 *       404:
 *         description: No movements found
 *       500:
 *         description: Internal server error
 */
export const getInventoryMovementsByInventoryId = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const movements = await InventoryMovement.find({ inventory: inventoryId }).populate('inventory');

    if (!movements.length) {
      logger.warn(`No movements found for inventory: ${inventoryId}`);
      return res.status(404).json({ error: 'No movements found for the specified inventory' });
    }

    logger.info(`Fetched ${movements.length} movements for inventory: ${inventoryId}`);
    res.status(200).json(movements);
  } catch (error) {
    logger.error(`Error fetching movements: ${error.message}`);
    res.status(500).json({ error: 'Error fetching movements' });
  }
};

/**
 * @swagger
 * /inventory-movement/{id}:
 *   delete:
 *     summary: Delete an inventory movement by ID
 *     tags: [InventoryMovement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the inventory movement to delete
 *     responses:
 *       200:
 *         description: Inventory movement deleted successfully
 *       404:
 *         description: Inventory movement not found
 *       500:
 *         description: Internal server error
 */
export const deleteInventoryMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const movement = await InventoryMovement.findByIdAndDelete(id);

    if (!movement) {
      logger.warn(`Inventory movement not found: ${id}`);
      return res.status(404).json({ error: 'Inventory movement not found' });
    }

    logger.info(`Inventory movement deleted: ${id}`);
    res.status(200).json({ message: 'Inventory movement deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting inventory movement: ${error.message}`);
    res.status(500).json({ error: 'Error deleting inventory movement' });
  }
};

/**
 * @swagger
 * /inventory-movement/{id}:
 *   put:
 *     summary: Update an inventory movement by ID
 *     tags: [InventoryMovement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the inventory movement to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryMovement'
 *     responses:
 *       200:
 *         description: Inventory movement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryMovement'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Inventory movement not found
 *       500:
 *         description: Internal server error
 */
export const updateInventoryMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const movementSchema = Joi.object({
      inventory: Joi.string().optional(),
      type: Joi.string().valid('IN', 'OUT').optional(),
      quantity: Joi.number().integer().positive().optional(),
    });

    await movementSchema.validateAsync(req.body);

    const movement = await InventoryMovement.findByIdAndUpdate(id, req.body, { new: true });

    if (!movement) {
      logger.warn(`Inventory movement not found: ${id}`);
      return res.status(404).json({ error: 'Inventory movement not found' });
    }

    logger.info(`Inventory movement updated: ${id}`);
    res.status(200).json(movement);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error updating inventory movement: ${error.message}`);
    res.status(500).json({ error: 'Error updating inventory movement' });
  }
};
