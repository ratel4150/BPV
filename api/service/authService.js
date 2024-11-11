import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Joi from 'joi';
import logger from '../logger.js';
import { generateJWT, verifyJWT } from '../utils/jwtUtils.js';
import Role from '../models/Role.js';
import Store from '../models/Store.js';

// Esquema de validación para registro con Joi
const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    storeName: Joi.string().required(), // Nombre de la tienda
    roleName: Joi.string().required()    // Nombre del rol
  });

// Servicio de registro de usuario
export const signupService = async (username, password, email, storeName, roleName) => {
    try {
      // Validar datos de entrada
      
      
      const { error } = signupSchema.validate({ username, password, email, storeName, roleName });
      if (error) {
        logger.warn(`Error de validación en el registro: ${error.details[0].message}`);
        return { error: error.details[0].message };
      }
  
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ username });
      if (existingUser) return { error: 'El usuario ya existe' };
  
      // Verificar si el rol existe
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        logger.warn(`Rol no encontrado: ${roleName}`);
        return { error: 'Rol especificado no existe' };
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear la tienda y asignar al usuario como propietario
      const store = new Store({
        name: storeName,
        owner: null, // Inicialmente nulo hasta que se cree el usuario
        location: {},  // Define un objeto vacío para la ubicación y otros campos obligatorios
        contactInfo: {},
      });
  
      await store.save();
  
      // Crear el usuario con la tienda y el rol asignados
      const user = new User({
        username,
        password: hashedPassword,
        email,
        role: role._id,
        store: store._id
      });
  
      await user.save();
  
      // Actualizar el campo de propietario en la tienda creada
      store.owner = user._id;
      await store.save();
  
      return { success: true };
    } catch (err) {
      logger.error(`Error en el servicio de registro: ${err.message}`);
      return { error: 'Error en el servidor' };
    }
  };

// Servicio para autenticar al usuario e iniciar sesión
export const loginService = async (username, password ,email,storeName,roleName, req) => {
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
      ipAddress: /* req.ip || req.headers['x-forwarded-for']?.split(',')[0] || */ 'IP no disponible',
      device: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 3600000), // Expira en 1 hora
    });
    await session.save();
    return { token, session ,user};
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
