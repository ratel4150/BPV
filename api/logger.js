import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Crear carpeta de logs si no existe
const logDir = path.resolve('logs');
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
} catch (error) {
  console.error('Error al crear la carpeta de logs:', error);
}

// Definición de niveles de logs personalizados
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    verbose: 6,
    silly: 7,
    success: 8,
    critical: 9,
    alert: 10,
    notice: 11,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
    verbose: 'cyan',
    silly: 'white',
    success: 'green',
    critical: 'red',
    alert: 'yellow',
    notice: 'cyan',
  },
};

// Agregar colores a los niveles
winston.addColors(customLevels.colors);

// Función para formatear la marca de tiempo a la hora de CDMX
const formatTimestamp = () => {
  const date = new Date();
  const options = {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return new Intl.DateTimeFormat('es-MX', options).format(date).replace(',', '');
};

// Formato para logs
const logFormat = winston.format.printf(({ level, message, context }) => {
  return `${formatTimestamp()} [${level}]: ${message} ${context ? JSON.stringify(context) : ''}`;
});

// Transporte para logs rotativos diarios
const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, '%DATE%-results.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Transporte para errores
const errorTransport = new winston.transports.File({
  filename: path.join(logDir, 'error.log'),
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Logger con niveles personalizados
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug', // Establece el nivel de log a 'debug' de forma fija
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    transport,
    errorTransport,
    new winston.transports.Console({
      level: 'debug', // Puede ser ajustado para que se muestren diferentes niveles en consola
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
  ],
});

// Manejo de excepciones no controladas
logger.exceptions.handle(
  new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
);

// Manejo de promesas no controladas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa no manejada: ', { reason, promise });
});

// Función para agregar contexto a los logs
const logWithContext = (level, message, context = {}) => {
  if (logger.levels[level] !== undefined) {
    logger.log(level, message, { context });
  } else {
    console.error(`Nivel de log desconocido: ${level}`);
  }
};

// Ejemplo de uso de los logs con contexto
try {
  logWithContext('fatal', 'Error crítico: No se pudo conectar a la base de datos', { userId: '123', action: 'dbConnection' });
  logWithContext('error', 'Error: El sistema ha fallado', { userId: '123' });
  logWithContext('warn', 'Advertencia: El uso de memoria ha superado el 80%', { userId: '123' });
  logWithContext('info', 'Información general: El servidor ha iniciado correctamente', { userId: '123' });
  logWithContext('http', 'HTTP Request: GET /api/v1/users', { userId: '123', method: 'GET', path: '/api/v1/users' });
  logWithContext('debug', 'Depuración: El usuario tiene el ID 123 y su estado es activo', { userId: '123' });
  logWithContext('verbose', 'Detalles de la operación: Usuario actualizado correctamente', { userId: '123' });
  logWithContext('silly', 'Información detallada de depuración: Estado de la conexión a la base de datos', { userId: '123' });
  logWithContext('success', 'Éxito: El proceso se completó correctamente', { userId: '123' });
  logWithContext('critical', 'Crítico: Se ha detectado un fallo de seguridad', { userId: '123' });
  logWithContext('alert', 'Alerta: El sistema ha detectado un uso inusual de recursos', { userId: '123' });
  logWithContext('notice', 'Notificación: Se ha enviado un correo de confirmación', { userId: '123' });
} catch (error) {
  logger.error('Error en el logger:', { error });
}

export default logger;
