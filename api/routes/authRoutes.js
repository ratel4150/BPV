import express from 'express';
import { signup, login, logout } from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/signup', signup);

// Ruta para iniciar sesión (requiere autenticación)
router.post('/login', login);

// Ruta para cerrar sesión (requiere autenticación)
router.post('/logout', authenticateToken, logout);

export default router;
