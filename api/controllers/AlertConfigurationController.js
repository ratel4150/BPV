// controllers/departmentController.js
import AlertConfiguration from '../models/AlertConfiguration.js';

/**
 * @swagger
 * tags:
 *   name: AlertConfiguration
 *   description: API para la gestión de alertas
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
export const createDepartment = async (req, res) => {
    try {
      console.log(req.body); // Esto te mostrará lo que estás enviando en el cuerpo
      const department = new Department(req.body);
      console.log(department);  
      
      await department.save();
      res.status(201).json(department);
    } catch (error) {
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
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
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
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json(department);
  } catch (error) {
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
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json(department);
  } catch (error) {
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
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
