import database from "../config/index.js";

// Esquema de la Tienda
const storeSchema = new database.Schema({
  name: { type: String, required: true },
  location: String,
  departments: [{ type: database.Schema.Types.ObjectId, ref: 'Department' }],
  products: [{ type: database.Schema.Types.ObjectId, ref: 'Product' }],
  customers: [{ type: database.Schema.Types.ObjectId, ref: 'Customer' }],
  tickets: [{ type: database.Schema.Types.ObjectId, ref: 'Ticket' }],
  invoices: [{ type: database.Schema.Types.ObjectId, ref: 'Invoice' }],
  cashClosures: [{ type: database.Schema.Types.ObjectId, ref: 'CashClosure' }],
  promotions: [{ type: database.Schema.Types.ObjectId, ref: 'Promotion' }],
  inventory: { type: database.Schema.Types.ObjectId, ref: 'Inventory' },
  generalConfiguration: { type: database.Schema.Types.ObjectId, ref: 'GeneralConfiguration' },
  loyaltyProgram: { type: database.Schema.Types.ObjectId, ref: 'LoyaltyProgram' },
  taxConfiguration: { type: database.Schema.Types.ObjectId, ref: 'TaxConfiguration' },
  alertConfiguration: { type: database.Schema.Types.ObjectId, ref: 'AlertConfiguration' },
  trainingProgram: { type: database.Schema.Types.ObjectId, ref: 'TrainingProgram' },
  createdAt: { type: Date, default: Date.now }
});

// Esquemas Secundarios

const productSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: true },
  department: { type: database.Schema.Types.ObjectId, ref: 'Department' },
  price: Number,
  stock: Number,
  promotions: [{ type: database.Schema.Types.ObjectId, ref: 'Promotion' }],
  inventoryMovements: [{ type: database.Schema.Types.ObjectId, ref: 'InventoryMovement' }],
});

const departmentSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: true },
  description: String,
});

const customerSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: true },
  email: String,
  phone: String,
  loyaltyPoints: Number,
  transactions: [{ type: database.Schema.Types.ObjectId, ref: 'LoyaltyTransaction' }],
  history: [{ type: database.Schema.Types.ObjectId, ref: 'CustomerHistory' }],
});

const ticketSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  cashier: { type: database.Schema.Types.ObjectId, ref: 'Cashier', required: true },
  customer: { type: database.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{ type: database.Schema.Types.ObjectId, ref: 'TicketDetail' }],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

const ticketDetailSchema = new database.Schema({
  product: { type: database.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: Number,
  price: Number,
  subtotal: Number
});

const invoiceSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  ticket: { type: database.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  customer: { type: database.Schema.Types.ObjectId, ref: 'Customer' },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

const cashClosureSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  cashier: { type: database.Schema.Types.ObjectId, ref: 'Cashier', required: true },
  totalSales: Number,
  date: { type: Date, default: Date.now }
});

const userSchema = new database.Schema({
  store: { type: database.Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: true },
  role: { type: database.Schema.Types.ObjectId, ref: 'Role', required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const cashierSchema = new database.Schema({ /* Información del cajero */ });
const inventorySchema = new database.Schema({ /* Información de inventario */ });
const promotionSchema = new database.Schema({ /* Información de promociones */ });
const loyaltyProgramSchema = new database.Schema({ /* Información del programa de lealtad */ });
const auditSchema = new database.Schema({
  action: { type: String, required: true },
  user: { type: database.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

// Exportar los modelos
export const Store = database.model('Store', storeSchema);
export const Product = database.model('Product', productSchema);
export const Department = database.model('Department', departmentSchema);
export const Customer = database.model('Customer', customerSchema);
export const Ticket = database.model('Ticket', ticketSchema);
export const TicketDetail = database.model('TicketDetail', ticketDetailSchema);
export const Invoice = database.model('Invoice', invoiceSchema);
export const CashClosure = database.model('CashClosure', cashClosureSchema);
export const User = database.model('User', userSchema);
export const Cashier = database.model('Cashier', cashierSchema);
export const Inventory = database.model('Inventory', inventorySchema);
export const Promotion = database.model('Promotion', promotionSchema);
export const LoyaltyProgram = database.model('LoyaltyProgram', loyaltyProgramSchema);
export const Audit = database.model('Audit', auditSchema);

export default Audit;
