/* import { signupService, loginService, logoutService } from '../service/authService.js'; */
import authServices from '../service/authService.js';
import logger from '../logger.js';
import Session from '../models/Session.js';
import { generateJWT } from '../utils/jwtUtils.js';

// @swagger
// /auth/signup:
//   post:
//     summary: Registro de un nuevo usuario
export const signup = async (req, res) => {
  try {
    console.log(req.body);
    
    const { username, password,email,storeName,roleName } = req.body;

    // Llamar al servicio para registrar un nuevo usuario
    const result = await authServices.signupService(username, password,email,storeName,roleName);
    
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
    const { username, password, email, storeName, roleName } = req.body;

    // Validar las credenciales del usuario
    const user = await authServices.loginService(username, password, email, storeName, roleName);
    if (!user) {
      logger.warn(`Credenciales incorrectas para el usuario: ${username}`);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verifica que el usuario tenga email y store asociados
    if (!user.email || !user.store) {
      logger.warn(`El usuario ${username} no tiene email o tienda configurada.`);
      return res.status(400).json({ message: 'Usuario incompleto, falta email o tienda' });
    }

    // Generar el token JWT
    const token = generateJWT(user);

    // Crear una nueva sesión con email y store
    const session = new Session({
      user: user._id,
      email: user.email,   // Asegúrate de que 'user.email' esté definido
      store: user.store,   // Asegúrate de que 'user.store' esté definido
      token,
      ipAddress: req.ip,
      device: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 3600000), // Expira en 1 hora
    });

    await session.save();
    logger.info(`Inicio de sesión exitoso para el usuario: ${username}`);

    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    logger.error(`Error en el servicio de login: ${err.message}`);
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
