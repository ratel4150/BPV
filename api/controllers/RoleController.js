// api/controllers/RoleController.js
import Joi from 'joi';
import Role from '../models/Role.js';
import logger from '../logger.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del rol.
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de permisos asignados al rol.
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol.
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error en el servidor.
 */
export const createRole = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newRole = new Role(req.body);
    await newRole.save();
    logger.info('Role created successfully');
    res.status(201).json(newRole);
  } catch (err) {
    logger.error(`Error creating role: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene todos los roles.
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Error en el servidor.
 */
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    logger.info('Fetched all roles');
    res.status(200).json(roles);
  } catch (err) {
    logger.error(`Error fetching roles: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Obtiene un rol por ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del rol.
 *     responses:
 *       200:
 *         description: Rol obtenido exitosamente.
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      logger.warn(`Role with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Role not found' });
    }
    logger.info(`Fetched role with ID ${req.params.id}`);
    res.status(200).json(role);
  } catch (err) {
    logger.error(`Error fetching role: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Actualiza un rol por ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del rol.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente.
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const updateRole = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) {
      logger.warn(`Role with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Role not found' });
    }
    logger.info(`Role with ID ${req.params.id} updated`);
    res.status(200).json(role);
  } catch (err) {
    logger.error(`Error updating role: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Elimina un rol por ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del rol.
 *     responses:
 *       204:
 *         description: Rol eliminado exitosamente.
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      logger.warn(`Role with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Role not found' });
    }
    logger.info(`Role with ID ${req.params.id} deleted`);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting role: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};
