import GeneralConfiguration from '../models/GeneralConfiguration.js';
import logger from '../logger.js';
import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     GeneralConfiguration:
 *       type: object
 *       required:
 *         - key
 *         - value
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the general configuration
 *         key:
 *           type: string
 *           description: The key for the configuration
 *         value:
 *           type: object
 *           description: The value for the configuration (mixed type)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the configuration was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the configuration was last updated
 *     GeneralConfigurationInput:
 *       type: object
 *       required:
 *         - key
 *         - value
 *       properties:
 *         key:
 *           type: string
 *           description: The key for the configuration
 *         value:
 *           type: object
 *           description: The value for the configuration (mixed type)
 */

/**
 * @swagger
 * tags:
 *   name: GeneralConfigurations
 *   description: Management of general configurations
 */

/**
 * @swagger
 * /general-configurations:
 *   post:
 *     summary: Create a new general configuration
 *     tags: [GeneralConfigurations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralConfigurationInput'
 *     responses:
 *       201:
 *         description: General configuration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralConfiguration'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createGeneralConfiguration = async (req, res) => {
  try {
    const generalConfigSchema = Joi.object({
      key: Joi.string().required(),
      value: Joi.any().required(),
    });

    await generalConfigSchema.validateAsync(req.body);

    const { key, value } = req.body;
    const generalConfiguration = new GeneralConfiguration({ key, value });
    await generalConfiguration.save();

    logger.info(`General configuration created: ${generalConfiguration._id}`);
    res.status(201).json(generalConfiguration);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error creating general configuration: ${error.message}`);
    res.status(500).json({ error: 'Error creating general configuration' });
  }
};

/**
 * @swagger
 * /general-configurations:
 *   get:
 *     summary: Get all general configurations
 *     tags: [GeneralConfigurations]
 *     responses:
 *       200:
 *         description: List of general configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GeneralConfiguration'
 *       500:
 *         description: Internal server error
 */
export const getAllGeneralConfigurations = async (req, res) => {
  try {
    const configurations = await GeneralConfiguration.find();
    logger.info(`Fetched ${configurations.length} general configurations`);
    res.status(200).json(configurations);
  } catch (error) {
    logger.error(`Error fetching general configurations: ${error.message}`);
    res.status(500).json({ error: 'Error fetching general configurations' });
  }
};

/**
 * @swagger
 * /general-configurations/{id}:
 *   get:
 *     summary: Get general configuration by ID
 *     tags: [GeneralConfigurations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The general configuration ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: General configuration found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralConfiguration'
 *       404:
 *         description: General configuration not found
 *       500:
 *         description: Internal server error
 */
export const getGeneralConfigurationById = async (req, res) => {
  try {
    const configuration = await GeneralConfiguration.findById(req.params.id);
    if (!configuration) {
      logger.warn(`General configuration not found: ${req.params.id}`);
      return res.status(404).json({ error: 'General configuration not found' });
    }
    logger.info(`Fetched general configuration: ${configuration._id}`);
    res.status(200).json(configuration);
  } catch (error) {
    logger.error(`Error fetching general configuration: ${error.message}`);
    res.status(500).json({ error: 'Error fetching general configuration' });
  }
};

/**
 * @swagger
 * /general-configurations/{id}:
 *   put:
 *     summary: Update general configuration by ID
 *     tags: [GeneralConfigurations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The general configuration ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralConfigurationInput'
 *     responses:
 *       200:
 *         description: General configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralConfiguration'
 *       404:
 *         description: General configuration not found
 *       500:
 *         description: Internal server error
 */
export const updateGeneralConfigurationById = async (req, res) => {
  try {
    const generalConfigSchema = Joi.object({
      key: Joi.string().required(),
      value: Joi.any().required(),
    });

    await generalConfigSchema.validateAsync(req.body);

    const { key, value } = req.body;
    const configuration = await GeneralConfiguration.findByIdAndUpdate(
      req.params.id,
      { key, value },
      { new: true, runValidators: true }
    );
    if (!configuration) {
      logger.warn(`General configuration not found: ${req.params.id}`);
      return res.status(404).json({ error: 'General configuration not found' });
    }
    logger.info(`General configuration updated: ${configuration._id}`);
    res.status(200).json(configuration);
  } catch (error) {
    if (error.isJoi) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
    logger.error(`Error updating general configuration: ${error.message}`);
    res.status(500).json({ error: 'Error updating general configuration' });
  }
};

/**
 * @swagger
 * /general-configurations/{id}:
 *   delete:
 *     summary: Delete general configuration by ID
 *     tags: [GeneralConfigurations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The general configuration ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: General configuration deleted successfully
 *       404:
 *         description: General configuration not found
 *       500:
 *         description: Internal server error
 */
export const deleteGeneralConfigurationById = async (req, res) => {
  try {
    const configuration = await GeneralConfiguration.findByIdAndDelete(req.params.id);
    if (!configuration) {
      logger.warn(`General configuration not found: ${req.params.id}`);
      return res.status(404).json({ error: 'General configuration not found' });
    }
    logger.info(`General configuration deleted: ${configuration._id}`);
    res.status(200).json({ message: 'General configuration deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting general configuration: ${error.message}`);
    res.status(500).json({ error: 'Error deleting general configuration' });
  }
};
