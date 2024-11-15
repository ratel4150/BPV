import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import Role from '../models/Role.js';


// Define la clave secreta directamente
const JWT_SECRET = 'yourSuperSecretKey';

// Middleware para verificar si el usuario está autenticado
export const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Obtener el token después de "Bearer"

  

  if (!token) {
    logger.warn('Acceso denegado. No se encontró el token en la cabecera Authorization.');
    return res.status(403).json({ message: 'Acceso denegado. No se encontró el token.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn(`Token inválido o expirado: ${err.message}`);
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    
    req.user = decoded;
    next();
  });
};

// Middleware para verificar que el usuario tiene un rol específico
export const authorizeRole = async (req, res, next) => {
  try {

   
    
    
    // Asegúrate de que el usuario esté autenticado y su rol esté en req.user.role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Acceso denegado. Usuario no autenticado o sin rol asignado.' });
    }

    // Buscar el rol del usuario en la base de datos usando el ObjectId
    const userRole = await Role.findById(req.user.role);
    /* console.log(userRole);  */
     
    if (!userRole) {
      return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no encontrado.' });
    }

    // Verifica si el rol del usuario tiene permisos asignados para acceder a ciertos recursos
    if (userRole.permissions && userRole.permissions.length > 0) {
      // Aquí puedes comprobar los permisos basados en el recurso solicitado
      const requestedResource = req.originalUrl; // Ejemplo: recurso solicitado en la URL (puedes adaptarlo)
      
      
      // Verificar si el rol tiene acceso al recurso solicitado
      const permission = userRole.permissions.find(permission => permission.resource === requestedResource);
      console.log(permission);
      
      if (permission) {
        // Verifica si el usuario tiene permisos para realizar acciones sobre el recurso
        const action = req.method // Obtener el método HTTP (GET, POST, PUT, DELETE)
        /*  console.log("33333333");
        
        console.log(action,"=",permission.actions);
        console.log("33333333");  */
        const actionAllowed = permission.actions.some(a => a.method === action);
     /*    console.log(actionAllowed); */
        
        if (actionAllowed) {
          return next(); // Permitir el acceso si tiene permisos asignados
        } else {
          return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para realizar esta acción.' });
        }
      } else {
        return res.status(403).json({ message: 'Acceso denegado. Recurso no permitido.' });
      }
    } else {
      return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos adecuados.' });
    }
  } catch (error) {
    console.error(`Error en authorizeRole: ${error.message}`);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};