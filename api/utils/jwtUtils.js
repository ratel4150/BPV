import jwt from 'jsonwebtoken';

// Función para generar un token JWT
export const generateJWT = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Función para verificar la validez de un token JWT
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
