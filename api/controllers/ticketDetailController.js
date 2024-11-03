// controllers/ticketDetailController.js

import TicketDetail from '../models/TicketDetail.js';
import logger from '../logger.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketDetail:
 *       type: object
 *       required:
 *         - ticket
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the TicketDetail
 *           example: 605c5f4b4f4c4f3c8c9c9c9d
 *         ticket:
 *           type: string
 *           description: ObjectId of the associated ticket
 *           example: 605c5f4b4f4c4f3c8c9c9c9b
 *         product:
 *           type: string
 *           description: ObjectId of the associated product
 *           example: 605c5f4b4f4c4f3c8c9c9c9c
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 *           example: 2
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 100.0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the TicketDetail was created
 *           example: 2024-01-01T00:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the TicketDetail was last updated
 *           example: 2024-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: TicketDetails
 *   description: Ticket Detail management API
 */

/**
 * @swagger
 * /ticketdetails:
 *   post:
 *     summary: Create a new TicketDetail
 *     tags: [TicketDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketDetail'
 *           example:
 *             ticket: "605c5f4b4f4c4f3c8c9c9c9b"
 *             product: "605c5f4b4f4c4f3c8c9c9c9c"
 *             quantity: 3
 *             price: 150.0
 *     responses:
 *       201:
 *         description: TicketDetail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketDetail'
 *       409:
 *         description: Duplicate TicketDetail exists for the provided ticket and product
 *       500:
 *         description: Server error
 */
export const createTicketDetail = async (req, res) => {
  try {
    const { ticket, product, quantity, price } = req.body;
    const existingDetail = await TicketDetail.findOne({ ticket, product });

    if (existingDetail) {
      return res.status(409).json({ message: 'Duplicate TicketDetail exists' });
    }

    const newDetail = new TicketDetail({ ticket, product, quantity, price });
    await newDetail.save();
    logger.info('TicketDetail created successfully', newDetail);
    res.status(201).json(newDetail);
  } catch (error) {
    logger.error('Error creating TicketDetail', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /ticketdetails:
 *   get:
 *     summary: Get all TicketDetails
 *     tags: [TicketDetails]
 *     responses:
 *       200:
 *         description: List of TicketDetails
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketDetail'
 *               example:
 *                 - _id: "605c5f4b4f4c4f3c8c9c9c9d"
 *                   ticket: "605c5f4b4f4c4f3c8c9c9c9b"
 *                   product: "605c5f4b4f4c4f3c8c9c9c9c"
 *                   quantity: 3
 *                   price: 150.0
 *                   createdAt: "2024-01-01T00:00:00Z"
 *                   updatedAt: "2024-01-01T00:00:00Z"
 *       404:
 *         description: No TicketDetails found
 *       500:
 *         description: Server error
 */
export const getAllTicketDetails = async (req, res) => {
  try {
    const details = await TicketDetail.find();
    if (!details.length) {
      return res.status(404).json({ message: 'No TicketDetails found' });
    }
    logger.info('TicketDetails retrieved successfully');
    res.status(200).json(details);
  } catch (error) {
    logger.error('Error retrieving TicketDetails', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /ticketdetails/{id}:
 *   get:
 *     summary: Get a TicketDetail by ID
 *     tags: [TicketDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: TicketDetail ID
 *         example: 605c5f4b4f4c4f3c8c9c9c9d
 *     responses:
 *       200:
 *         description: TicketDetail data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketDetail'
 *       404:
 *         description: TicketDetail not found
 *       500:
 *         description: Server error
 */
export const getTicketDetailById = async (req, res) => {
  try {
    const detail = await TicketDetail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: 'TicketDetail not found' });
    }
    logger.info(`TicketDetail ${req.params.id} retrieved successfully`);
    res.status(200).json(detail);
  } catch (error) {
    logger.error('Error retrieving TicketDetail', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /ticketdetails/{id}:
 *   delete:
 *     summary: Delete a TicketDetail by ID
 *     tags: [TicketDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: TicketDetail ID
 *         example: 605c5f4b4f4c4f3c8c9c9c9d
 *     responses:
 *       200:
 *         description: TicketDetail deleted successfully
 *       404:
 *         description: TicketDetail not found
 *       500:
 *         description: Server error
 */
export const deleteTicketDetailById = async (req, res) => {
  try {
    const deletedDetail = await TicketDetail.findByIdAndDelete(req.params.id);
    if (!deletedDetail) {
      return res.status(404).json({ message: 'TicketDetail not found' });
    }
    logger.info(`TicketDetail ${req.params.id} deleted successfully`);
    res.status(200).json({ message: 'TicketDetail deleted successfully' });
  } catch (error) {
    logger.error('Error deleting TicketDetail', error);
    res.status(500).json({ message: 'Server error' });
  }
};
