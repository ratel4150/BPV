import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swaggerOptions.js';
import morganMiddleware from './api/middleware/MorganMiddleware.js';
import routes from './api/routes/index.js'; // Importa el archivo de rutas principal
/* import rateLimit from 'express-rate-limit'; */
import morgan from 'morgan';
import helmet from 'helmet';
const app = express();
const port = process.env.PORT || 10010;

// Middleware de seguridad
 app.use(helmet(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trustedscripts.com"], // Permite solo scripts desde el propio dominio y un dominio confiable
      styleSrc: ["'self'", "https://trustedstyles.com"], // Permite estilos desde el propio dominio y un dominio confiable
      imgSrc: ["'self'", "data:", "https://trustedimages.com"], // Permite imágenes desde el propio dominio, datos en base64 y un dominio confiable
      connectSrc: ["'self'", "https://api.trustedsource.com"], // Permite conexiones a API externas confiables
      objectSrc: ["'none'"], // Bloquea el uso de `<object>`, que puede ser un vector de ataque
      upgradeInsecureRequests: [], // Activa la actualización de solicitudes HTTP a HTTPS automáticamente
    },
  },
  referrerPolicy: { policy: 'no-referrer' }, // Política para no enviar el encabezado `Referer` en solicitudes
  crossOriginEmbedderPolicy: true, // Política de incrustación de contenido de origen cruzado
  crossOriginResourcePolicy: { policy: 'same-origin' }, // Bloquea recursos externos a menos que estén en el mismo origen
  crossOriginOpenerPolicy: { policy: 'same-origin' }, // Asegura que la ventana sea propiedad del mismo origen
  dnsPrefetchControl: { allow: false }, // Deshabilita prefetching de DNS
  frameguard: { action: 'deny' }, // Previene que la aplicación sea incrustada en iframes
  hidePoweredBy: true, // Oculta el encabezado `X-Powered-By` para no revelar información del servidor
  hsts: {
    maxAge: 63072000, // Fuerza HTTPS por dos años
    includeSubDomains: true, // Aplica a todos los subdominios
    preload: true, // Incluye en la lista de precarga HSTS
  },
  ieNoOpen: true, // Bloquea descarga automática de archivos en IE
  noSniff: true, // Evita la detección de tipo MIME de navegador
  xssFilter: true, // Activa el filtro de protección contra XSS
})));  
app.set('trust proxy', true);
// Limitar tasas de solicitudes
/*  const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 solicitudes por ventana
  message: 'Demasiadas solicitudes, inténtalo de nuevo más tarde.',
});
app.use(limiter);  */

// Middleware de Morgan para log de solicitudes
 app.use(morgan('combined')); 
// Middleware para parsear JSON
app.use(express.json()); // Para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Para manejar solicitudes URL-encoded

// Inicializar Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
// Rutas principales
app.use('/', routes); // Usa todas las rutas desde `api/routes/index.js`
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
});
