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
import InventoryMovementRoutes from './inventoryMovementRoutes.js';
import alertConfigurationRoutes from './alertConfigurationRoutes.js'
import invoicesRoutes from './invoiceRoutes.js'
import loyaltyProgramRoutes from './loyaltyProgramRoutes.js'
import loyaltyTransactionRoutes from './loyaltyTransactionRoutes.js'
import paymentHistoryRoutes from './paymentHistoryRoutes.js'
import promotionRoutes from './promotionRoutes.js'
import roleRoutes from './roleRoutes.js'
import salesReportRoutes from './salesReportRoutes.js'
import serviceRoute from './serviceRoutes.js'
import serviceInventoryRoutes from './serviceInventoryRoutes.js';
import sessionRoutes from './sessionRoutes.js'
import taxConfigurationRoutes from './taxConfigurationRoutes.js'
import ticketRoutes from './ticketRoutes.js'
import trainingProgramRoutes from './trainingProgramRoutes.js'
import userRoutes from './userRoutes.js'
import storeRoutes from './storeRoutes.js'
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
router.use('/inventory-movement', InventoryMovementRoutes); // Endpoint para clientes
router.use('/alert-configurations', alertConfigurationRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/loyalty-programs', loyaltyProgramRoutes);
router.use('/loyalty-transactions', loyaltyTransactionRoutes);
router.use('/payment-history', paymentHistoryRoutes);
router.use('/promotions', promotionRoutes);
router.use('/roles', roleRoutes);
router.use('/sales-reports', salesReportRoutes);
router.use('/services', serviceRoute);
router.use('/service-inventory', serviceInventoryRoutes);
router.use('/sessions', sessionRoutes);
router.use('/tax-configurations', taxConfigurationRoutes);
router.use('/tickets', ticketRoutes);
router.use('/training-programs', trainingProgramRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
export default router;