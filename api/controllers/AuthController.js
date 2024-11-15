/* import { signupService, loginService, logoutService } from '../service/authService.js'; */
import authServices from '../service/authService.js';
import logger from '../logger.js';
import Session from '../models/Session.js';

import useragent from 'useragent';
import geoip from 'geoip-lite';

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
    const { username, password } = req.body;

    // Llamada al servicio de login para autenticar al usuario
    const { token, user, error } = await authServices.loginService(username, password);

    if (error) {
      logger.warn(error);
      return res.status(400).json({ message: error });
    }

    if (!user) {
      logger.warn(`Credenciales incorrectas para el usuario: ${username}`);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar si el usuario ya tiene una sesión activa
    const existingSession = await Session.findOne({
      user: user._id,
      status: 'Active'
    });

    if (existingSession) {
      logger.warn(`Sesión ya activa para el usuario: ${username}`);
      return res.status(409).json({ message: 'Ya existe una sesión activa para este usuario' });
    }

    // Información del dispositivo y navegador
    const agent = useragent.parse(req.headers['user-agent']);
    const deviceDetails = {
      deviceType: agent.device.toString() === 'Other' ? 'Desktop' : 'Mobile',
      model: agent.device.toString(),
      os: agent.os.toString(),
      osVersion: agent.os.toVersion(),
      browser: agent.family,
      browserVersion: agent.toVersion()
    };

    // Información de ubicación basada en IP
    const geo = geoip.lookup(req.ip) || {};
    const location = {
      country: geo.country || 'Unknown',
      city: geo.city || 'Unknown',
      latitude: geo.ll ? geo.ll[0] : null,
      longitude: geo.ll ? geo.ll[1] : null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Crear una nueva sesión con todos los detalles
    const session = new Session({
      user: user._id,
      email: user.email,
      store: user.store,
      token,
      ipAddress: req.ip,
      device: deviceDetails,
      location,
      metadata: {
        loginMethod: 'Password', // Ejemplo, cambiar si hay múltiples métodos
        loginAttempts: 1, // Registro inicial de intentos de inicio de sesión
      },
      expiresAt: new Date(Date.now() + 3600000) // Expira en 1 hora
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