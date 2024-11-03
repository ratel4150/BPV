// api/routes/index.js
import express from 'express';
import productRoutes from './productRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import ticketDetailRoutes from './ticketDetailRoutes.js'
import cashierRoutes from './cashierRoutes.js'
import auditRoutes from './auditRoutes.js'
import cashclosureRoutes from './cashclosureRoutes.js'
import customerHistoryRoutes from './customHistoryRoutes.js'
import customRoutes from './customRoutes.js'
import discountHistoryRoutes from './customHistoryRoutes.js'
import generalConfigurationRoutes from './generalConfigurationRoutes.js'
import inventoryRoutes from './inventoryRoutes.js'
const router = express.Router();

// Rutas
router.use('/products', productRoutes); // Endpoint para productos
router.use('/departments', departmentRoutes); // Endpoint para departamentos
router.use('/ticketdetails', ticketDetailRoutes); // Endpoint para detalles de ticket
router.use('/cashiers', cashierRoutes); // Endpoint para detalles de cajeros
router.use('/audits', auditRoutes); // Endpoint para detalles de auditorias
router.use('/cashclousures', cashclosureRoutes); // Endpoint para detalles de auditorias
router.use('/customerhistories', customerHistoryRoutes); // Endpoint para detalles de historial de clientes
router.use('/customers', customRoutes); // Endpoint para clientes
router.use('/discount-histories', discountHistoryRoutes); // Endpoint para clientes
router.use('/general-configurations', generalConfigurationRoutes); // Endpoint para clientes
router.use('/inventory', inventoryRoutes); // Endpoint para clientes
export default router;