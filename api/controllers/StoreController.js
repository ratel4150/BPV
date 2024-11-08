import Store from '../models/Store.js';
import Joi from 'joi';
import logger from '../logger.js'; // Suponiendo que tienes un logger configurado

// Esquema de validación de Joi para la tienda
const storeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  location: Joi.object({
    street: Joi.string().required().min(3).max(200),
    city: Joi.string().required().min(2).max(100),
    state: Joi.string().optional().min(2).max(100),
    zipCode: Joi.string().required().min(5).max(10),
    country: Joi.string().required().min(3).max(100),
  }).required(),
  contactInfo: Joi.object({
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    website: Joi.string().uri().optional(),
  }).optional(),
  hours: Joi.array().items(
    Joi.object({
      day: Joi.string().required(),
      openTime: Joi.string().required(),
      closeTime: Joi.string().required(),
    })
  ).optional(),
  inventoryPolicy: Joi.object({
    reOrderThreshold: Joi.number().required(),
    reOrderQuantity: Joi.number().required(),
    isAutomaticReorder: Joi.boolean().required(),
  }).optional(),
}).unknown(true);

// Controlador para crear una tienda
/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Crear una nueva tienda
 *     tags: [Store]
 *     requestBody:
 *       description: Objeto tienda que necesita ser agregado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Tienda creada exitosamente
 *       400:
 *         description: Datos de la tienda inválidos
 *       500:
 *         description: Error del servidor
 */
export const createStore = async (req, res) => {
  try {
    const { error } = storeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      logger.warn('Error de validación al crear tienda', { errors: errorMessages });
      return res.status(400).json({ message: 'Datos de la tienda no válidos', errors: errorMessages });
    }
    const store = new Store(req.body);
    const savedStore = await store.save();
    logger.info('Tienda creada exitosamente', { storeId: savedStore._id });
    res.status(201).json(savedStore);
  } catch (err) {
    logger.error('Error al crear la tienda', { error: err.message });
    res.status(500).json({ message: 'Error al crear la tienda' });
  }
};

// Controlador para actualizar una tienda
/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Actualizar una tienda por ID
 *     tags: [Store]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tienda
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto tienda que necesita ser actualizado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Tienda actualizada exitosamente
 *       400:
 *         description: Datos de la tienda inválidos
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error del servidor
 */
export const updateStore = async (req, res) => {
  try {
    const { error } = storeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      logger.warn('Error de validación al actualizar tienda', { errors: errorMessages });
      return res.status(400).json({ message: 'Datos de la tienda no válidos', errors: errorMessages });
    }
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) {
      logger.warn('Tienda no encontrada', { storeId: req.params.id });
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    logger.info('Tienda actualizada exitosamente', { storeId: store._id });
    res.status(200).json(store);
  } catch (err) {
    logger.error('Error al actualizar la tienda', { error: err.message });
    res.status(500).json({ message: 'Error al actualizar la tienda' });
  }
};

// Controlador para obtener todas las tiendas
/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Obtener todas las tiendas
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Lista de todas las tiendas
 *       500:
 *         description: Error del servidor
 */
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    logger.error('Error al obtener las tiendas', { error: err.message });
    res.status(500).json({ message: 'Error al obtener las tiendas' });
  }
};

// Controlador para obtener una tienda por ID
/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Obtener una tienda por ID
 *     tags: [Store]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tienda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tienda obtenida exitosamente
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error del servidor
 */
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    res.status(200).json(store);
  } catch (err) {
    logger.error('Error al obtener la tienda', { error: err.message });
    res.status(500).json({ message: 'Error al obtener la tienda' });
  }
};

// Controlador para eliminar una tienda
/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Eliminar una tienda por ID
 *     tags: [Store]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la tienda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tienda eliminada exitosamente
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error del servidor
 */
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    res.status(200).json({ message: 'Tienda eliminada exitosamente' });
  } catch (err) {
    logger.error('Error al eliminar la tienda', { error: err.message });
    res.status(500).json({ message: 'Error al eliminar la tienda' });
  }
};
