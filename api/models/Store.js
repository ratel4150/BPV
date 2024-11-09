import database from "../config/index.js";

const { Schema } = database;

// Subdocumentos para estructuras adicionales

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
}, { _id: false });

const contactInfoSchema = new Schema({
  phone: String,
  email: String,
  website: String,
}, { _id: false });

const hoursSchema = new Schema({
  day: { type: String, required: true },
  openTime: String,
  closeTime: String,
}, { _id: false });

const metricsSchema = new Schema({
  totalSales: { type: Number, default: 0 },
  totalCustomers: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
  inventoryValue: { type: Number, default: 0 },  // Valor total de inventario
  customerSatisfactionScore: { type: Number, default: 0 }, // Puntaje de satisfacción de clientes
}, { _id: false });

const userPermissionsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  canEdit: { type: Boolean, default: false },
  canViewReports: { type: Boolean, default: false },
  canManageInventory: { type: Boolean, default: false },
  canConfigureSettings: { type: Boolean, default: false },
}, { _id: false });

const auditSchema = new Schema({
  action: { type: String, required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  changes: { type: Schema.Types.Mixed }, // Detalles de los cambios realizados
}, { _id: false });

// Esquema principal de la tienda

const storeSchema = new Schema({
  name: { type: String, required: true },
  location: { type: addressSchema, required: true },
  contactInfo: { type: contactInfoSchema, required: true },
  hours: [hoursSchema], // Horarios de operación

  /* Quien la creo*/
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, // Relación con el usuario propietario
  
  // Referencias a otros esquemas
  departments: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
  tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
  cashClosures: [{ type: Schema.Types.ObjectId, ref: 'CashClosure' }],
  promotions: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }],
  
  // Referencias a documentos únicos de configuraciones y otros recursos
  inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  generalConfiguration: { type: Schema.Types.ObjectId, ref: 'GeneralConfiguration' },
  loyaltyProgram: { type: Schema.Types.ObjectId, ref: 'LoyaltyProgram' },
  taxConfiguration: { type: Schema.Types.ObjectId, ref: 'TaxConfiguration' },
  alertConfiguration: { type: Schema.Types.ObjectId, ref: 'AlertConfiguration' },
  trainingProgram: { type: Schema.Types.ObjectId, ref: 'TrainingProgram' },
  
  // Configuraciones y datos adicionales
  metrics: { type: metricsSchema },
  userPermissions: [userPermissionsSchema], // Permisos específicos por usuario
  auditLog: [auditSchema], // Historial de auditoría de cambios en la tienda
  inventoryPolicy: {
    reOrderThreshold: { type: Number, default: 10 }, // Umbral de reorden
    reOrderQuantity: { type: Number, default: 50 },   // Cantidad a reordenar
    isAutomaticReorder: { type: Boolean, default: false }, // Reorden automático
  },
  securitySettings: {
    isTwoFactorEnabled: { type: Boolean, default: false },
    accessRoles: [{ type: String, enum: ['Admin', 'Manager', 'Staff', 'Viewer'] }], // Roles de acceso
  },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para actualizar `updatedAt` en cada modificación
storeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Store = database.model('Store', storeSchema);

export default Store;
