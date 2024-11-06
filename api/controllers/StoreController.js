import Store from '../models/Store.js';
import Joi from 'joi';
import logger from '../logger.js'; // Asegúrate de tener configurado un logger

// Esquema de validación de Joi para la tienda
const storeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'any.required': 'El nombre es obligatorio.',
    'string.empty': 'El nombre no puede estar vacío.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
  }),
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
  metrics: Joi.object({
    totalSales: Joi.number().optional(),
    totalCustomers: Joi.number().optional(),
    totalProducts: Joi.number().optional(),
    inventoryValue: Joi.number().optional(),
    customerSatisfactionScore: Joi.number().optional(),
  }).optional(),
  securitySettings: Joi.object({
    isTwoFactorEnabled: Joi.boolean().optional(),
    accessRoles: Joi.array().items(Joi.string().valid('Admin', 'Manager', 'Staff', 'Viewer')).optional(),
  }).optional(),
  inventoryPolicy: Joi.object({
    reOrderThreshold: Joi.number().required(),
    reOrderQuantity: Joi.number().required(),
    isAutomaticReorder: Joi.boolean().required(),
  }).optional(),
});

// Función para crear una tienda
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

// Función para obtener una tienda por ID
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      logger.warn('Tienda no encontrada', { storeId: req.params.id });
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    logger.info('Tienda obtenida exitosamente', { storeId: store._id });
    res.status(200).json(store);
  } catch (err) {
    logger.error('Error al obtener la tienda', { error: err.message });
    res.status(500).json({ message: 'Error al obtener la tienda' });
  }
};

// Función para actualizar una tienda
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

// Función para eliminar una tienda
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      logger.warn('Tienda no encontrada para eliminar', { storeId: req.params.id });
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }

    logger.info('Tienda eliminada exitosamente', { storeId: req.params.id });
    res.status(200).json({ message: 'Tienda eliminada exitosamente' });
  } catch (err) {
    logger.error('Error al eliminar la tienda', { error: err.message });
    res.status(500).json({ message: 'Error al eliminar la tienda' });
  }
};

// Función para obtener todas las tiendas
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    logger.info(`Obtenidas ${stores.length} tiendas`);
    res.status(200).json(stores);
  } catch (err) {
    logger.error('Error al obtener las tiendas', { error: err.message });
    res.status(500).json({ message: 'Error al obtener las tiendas' });
  }
};
