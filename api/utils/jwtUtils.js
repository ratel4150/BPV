import jwt from 'jsonwebtoken';

// Define la clave secreta en el código
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey';

// Función para generar un token JWT
export const generateJWT = (user) => {
  if (!JWT_SECRET) {
    throw new Error("La clave secreta JWT no está definida");
  }
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Función para verificar la validez de un token JWT
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
