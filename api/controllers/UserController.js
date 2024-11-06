import User from "../models/User.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import logger from "../logger.js"; // Asegúrate de tener un archivo de logger configurado

// Esquema de validación con Joi
const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().optional(),
  active: Joi.boolean().default(true),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         role:
 *           type: string
 *           description: ID del rol asociado al usuario
 *         active:
 *           type: boolean
 *           description: Estado de actividad del usuario
 *       example:
 *         id: 123abc
 *         username: "john_doe"
 *         password: "securepassword"
 *         role: "609e12ef1b2c4b001f40f87c"
 *         active: true
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación
 */
export const createUser = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const user = new User({ ...value, password: hashedPassword });
    await user.save();
    
    logger.info("Nuevo usuario creado");
    res.status(201).json(user);
  } catch (err) {
    logger.error(`Error al crear el usuario: ${err.message}`);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json(users);
  } catch (err) {
    logger.error(`Error al obtener los usuarios: ${err.message}`);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    logger.error(`Error al obtener el usuario: ${err.message}`);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */
export const updateUser = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      logger.error(`Error de validación: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(req.params.id, value, { new: true }).populate('role');
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    logger.info(`Usuario actualizado con ID: ${req.params.id}`);
    res.status(200).json(user);
  } catch (err) {
    logger.error(`Error al actualizar el usuario: ${err.message}`);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    logger.info(`Usuario eliminado con ID: ${req.params.id}`);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (err) {
    logger.error(`Error al eliminar el usuario: ${err.message}`);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};
