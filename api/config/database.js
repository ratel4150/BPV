// config/database.js

import mongoose from "mongoose";
/* import {logger, dbConfigLogger } from "../lib/logger.js";
// Crear un child logger específico para la configuración de la base de datos
const dbLogger = dbConfigLogger.child({ module: 'database-connection' }); */
// Configura la conexión a la base de datos MongoDB
const dbURI = 'mongodb+srv://prueba:1@cluster0.buo0t.mongodb.net/PuntoVenta?retryWrites=true&w=majority'; // Cambia esto por la URL de tu base de datos MongoDB
mongoose.connect(dbURI);

// config/database.js

// Evento que se dispara cuando la conexión a la base de datos se establece con éxito
mongoose.connection.on('connected', () => {
    console.log(`Conexión a MongoDB establecida en ${dbURI}`);
    
/*   dbLogger.info(`Conexión a MongoDB establecida en ${dbURI}`); */
  });
  
  // Evento que se dispara en caso de error de conexión a la base de datos
  mongoose.connection.on('error', (err) => {
    console.log(`Error de conexión a MongoDB: ${err}`);
    
  /*   dbLogger.error(`Error de conexión a MongoDB: ${err}`); */
  
  });
  
  // Evento que se dispara cuando se cierra la conexión a la base de datos
  mongoose.connection.on('disconnected', () => {
    console.log('Conexión a MongoDB cerrada');
    
   /*  dbLogger.info('Conexión a MongoDB cerrada'); */
  });
  

// ... (resto de la configuración de la base de datos)

export default mongoose
