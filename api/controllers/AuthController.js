/* import { signupService, loginService, logoutService } from '../service/authService.js'; */
import authServices from '../service/authService.js';
import logger from '../logger.js';

// @swagger
// /auth/signup:
//   post:
//     summary: Registro de un nuevo usuario
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Llamar al servicio para registrar un nuevo usuario
    const result = await authServices.signupService(username, password);
    
    if (result.error) {
      logger.warn(`Error al registrar el usuario ${username}: ${result.error}`);
      return res.status(400).json({ message: result.error });
    }

    logger.info(`Usuario registrado exitosamente: ${username}`);
    return res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    logger.error(`Error al registrar usuario: ${err.message}`);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Llamar al servicio para autenticar al usuario
    const result = await authServices.loginService(username, password, req);
    
    if (result.error) {
      logger.warn(`Error al iniciar sesión: ${result.error}`);
      return res.status(400).json({ message: result.error });
    }

    logger.info(`Inicio de sesión exitoso para: ${username}`);
    return res.json({ token: result.token, sessionId: result.session._id });
  } catch (err) {
    logger.error(`Error al iniciar sesión: ${err.message}`);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const logout = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Llamar al servicio para cerrar sesión
    const result = await authServices.logoutService(sessionId);
    
    if (result.error) {
      logger.warn(`Error al cerrar sesión: ${result.error}`);
      return res.status(400).json({ message: result.error });
    }

    logger.info(`Cierre de sesión exitoso para sessionId: ${sessionId}`);
    return res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    logger.error(`Error al cerrar sesión: ${err.message}`);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
