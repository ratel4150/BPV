import express from 'express';
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
  } from '../controllers/departmentController.js';

const router = express.Router();


// Rutas CRUD para Department
router.post('/', createDepartment); // Crear un departamento
router.get('/', getAllDepartments); // Obtener todos los departamentos
router.get('/:id', getDepartmentById); // Obtener un departamento por ID
router.put('/:id', updateDepartment); // Actualizar un departamento por ID
router.delete('/:id', deleteDepartment); // Eliminar un departamento por ID

export default router;
