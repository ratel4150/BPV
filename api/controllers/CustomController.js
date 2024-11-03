import Customer from '../models/Customer.js';
import logger from '../logger.js';

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customer = new Customer({ name, email, phone, address });
    await customer.save();
    logger.info(`Customer created: ${customer._id}`);
    res.status(201).json(customer);
  } catch (error) {
    logger.error(`Error creating customer: ${error.message}`);
    res.status(500).json({ error: 'Error creating customer' });
  }
};

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of customers
 *       500:
 *         description: Internal server error
 */
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    logger.info(`Fetched ${customers.length} customers`);
    res.status(200).json(customers);
  } catch (error) {
    logger.error(`Error fetching customers: ${error.message}`);
    res.status(500).json({ error: 'Error fetching customers' });
  }
};

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer found
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      logger.warn(`Customer not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }
    logger.info(`Fetched customer: ${customer._id}`);
    res.status(200).json(customer);
  } catch (error) {
    logger.error(`Error fetching customer: ${error.message}`);
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
export const updateCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) {
      logger.warn(`Customer not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }
    logger.info(`Customer updated: ${customer._id}`);
    res.status(200).json(customer);
  } catch (error) {
    logger.error(`Error updating customer: ${error.message}`);
    res.status(500).json({ error: 'Error updating customer' });
  }
};

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
export const deleteCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      logger.warn(`Customer not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }
    logger.info(`Customer deleted: ${customer._id}`);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting customer: ${error.message}`);
    res.status(500).json({ error: 'Error deleting customer' });
  }
};
