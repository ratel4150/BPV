import database from "../config/index.js";
import seedRoles from './seedRoles.js';

const seedAll = async () => {
    try {
        const dbURI = 'mongodb+srv://prueba:1@cluster0.buo0t.mongodb.net/PuntoVenta?retryWrites=true&w=majority'; // Cambia esto por la URL de tu base de datos MongoDB
      await database.connect(dbURI, { 
        serverSelectionTimeoutMS: 30000 // 30 seconds timeout
      });
  
      console.log('Seeding data...');
      await seedRoles();
      /* await seedDepartments();
      await seedProducts(); */
  
      console.log('All data seeded successfully');
      await database.connection.close();
    } catch (error) {
      console.error('Error in seedAll:', error);
      process.exit(1);
    }
  };
  
  seedAll();