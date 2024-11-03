// controllers/departmentController.js
import logger from '../logger.js';
import Department from '../models/Department.js';

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API para la gestión de departamentos
 */

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Crea un nuevo departamento
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del departamento
 *                 example: Electrónica
 *               description:
 *                 type: string
 *                 description: Descripción del departamento
 *                 example: Sección de electrónicos y electrodomésticos
 *     responses:
 *       201:
 *         description: Departamento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del departamento
 *                 name:
 *                   type: string
 *                   description: Nombre del departamento
 *                 description:
 *                   type: string
 *                   description: Descripción del departamento
 *       400:
 *         description: Error en la solicitud
 */
// Función para crear un nuevo departamento
export const createDepartment = async (req, res) => {
    try {
      logger.info('Creando departamento con datos: ', req.body); // Usando el logger
      const department = new Department(req.body);
      
      await department.save();
      logger.info('Departamento creado exitosamente: ', department);
      res.status(201).json(department);
    } catch (error) {
      logger.error('Error al crear departamento: ', error.message); // Usando el logger
      res.status(400).json({ message: error.message });
    }
  };

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Obtener todos los departamentos
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Error al obtener los departamentos
 */
// Función para obtener todos los departamentos
export const getAllDepartments = async (req, res) => {
    try {
      const departments = await Department.find();
      logger.info('Lista de departamentos obtenida exitosamente');
      res.status(200).json(departments);
    } catch (error) {
      logger.error('Error al obtener departamentos: ', error.message); // Usando el logger
      res.status(500).json({ message: error.message });
    }
  };

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Obtener un departamento por ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Departamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error al obtener el departamento
 */
// Función para obtener un departamento por ID
export const getDepartmentById = async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        logger.warn(`Departamento no encontrado: ID ${req.params.id}`); // Usando el logger
        return res.status(404).json({ message: 'Department not found' });
      }
      logger.info(`Departamento encontrado: ${department.name}`);
      res.status(200).json(department);
    } catch (error) {
      logger.error('Error al obtener departamento: ', error.message); // Usando el logger
      res.status(500).json({ message: error.message });
    }
  };

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Actualizar un departamento por ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: Departamento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Departamento no encontrado
 *       400:
 *         description: Error en la actualización
 */
// Función para actualizar un departamento por ID
export const updateDepartment = async (req, res) => {
    try {
      const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!department) {
        logger.warn(`Departamento no encontrado para actualización: ID ${req.params.id}`); // Usando el logger
        return res.status(404).json({ message: 'Department not found' });
      }
      logger.info(`Departamento actualizado: ${department.name}`);
      res.status(200).json(department);
    } catch (error) {
      logger.error('Error al actualizar departamento: ', error.message); // Usando el logger
      res.status(400).json({ message: error.message });
    }
  };

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Eliminar un departamento por ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Departamento eliminado exitosamente
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error en la eliminación
 */
// Función para eliminar un departamento por ID
export const deleteDepartment = async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);
      if (!department) {
        logger.warn(`Departamento no encontrado para eliminar: ID ${req.params.id}`); // Usando el logger
        return res.status(404).json({ message: 'Department not found' });
      }
      logger.info(`Departamento eliminado: ${department.name}`);
      res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
      logger.error('Error al eliminar departamento: ', error.message); // Usando el logger
      res.status(500).json({ message: error.message });
    }
  };