// swaggerOptions.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ejemplo',
      version: '1.0.0',
      description: 'Documentación de la API usando Swagger y Express',
    },
    servers: [
      {
        url: 'http://localhost:10010',
      },
    ],
  },
  apis: [path.join(__dirname, '/api/controllers/*.js')], // Cambia esta ruta si tus archivos están en otro lugar
};
