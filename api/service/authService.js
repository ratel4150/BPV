import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import logger from '../logger.js';
import { generateJWT, verifyJWT } from '../utils/jwtUtils.js';

// Servicio para registrar un nuevo usuario
export const signupService = async (username, password) => {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return { error: 'El usuario ya existe' };

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword,
    });
    
    await user.save();
    return { success: true };
  } catch (err) {
    logger.error(`Error en el servicio de registro: ${err.message}`);
    return { error: 'Error en el servidor' };
  }
};

// Servicio para autenticar al usuario e iniciar sesión
export const loginService = async (username, password, req) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return { error: 'Usuario no encontrado' };

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: 'Contraseña incorrecta' };

    // Crear un token JWT
    const token = generateJWT(user);

    // Crear sesión del usuario
    const session = new Session({
      user: user._id,
      token,
      ipAddress: req.ip,
      device: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 3600000), // Expira en 1 hora
    });
    await session.save();
    return { token, session };
  } catch (err) {
    logger.error(`Error en el servicio de login: ${err.message}`);
    return { error: 'Error en el servidor' };
  }
};

// Servicio para cerrar sesión
export const logoutService = async (sessionId) => {
  try {
    const session = await Session.findById(sessionId);
    if (!session) return { error: 'Sesión no encontrada' };

    // Marcar sesión como revocada
    session.status = 'Revoked';
    await session.save();
    return { success: true };
  } catch (err) {
    logger.error(`Error en el servicio de logout: ${err.message}`);
    return { error: 'Error en el servidor' };
  }
};

export default { signupService, loginService, logoutService };
