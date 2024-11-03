import morgan from 'morgan';
import logger from '../logger.js';

// Formato de log para Morgan
const format = morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim()); // Registra la solicitud en Winston
    },
  },
});

// Middleware de Morgan
export default format;
