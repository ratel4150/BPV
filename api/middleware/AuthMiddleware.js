import jwt from 'jsonwebtoken';
import logger from '../logger.js';

// Middleware para verificar si el usuario está autenticado
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Asumimos que el token se envía como Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No se encontró el token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn(`Token inválido: ${err.message}`);
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar que el usuario tiene un rol específico
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos adecuados.' });
    }
    next();
  };
};
