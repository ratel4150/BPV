import database from "../config/index.js";


const {Schema} = database
const sessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  token: { type: String, required: true, unique: true },
  ipAddress: { type: String, required: true },
  device: {
    deviceType: { type: String },      // Ejemplo: "Mobile", "Desktop"
    model: { type: String },           // Ejemplo: "iPhone X", "Samsung Galaxy S21"
    os: { type: String },              // Sistema operativo del dispositivo
    osVersion: { type: String },       // Versión del sistema operativo
    browser: { type: String },         // Navegador utilizado
    browserVersion: { type: String }   // Versión del navegador
  },
  location: {
    country: { type: String },
    city: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    timezone: { type: String }         // Zona horaria detectada
  },
  metadata: {
    loginMethod: { type: String, enum: ['Password', 'OAuth', 'SSO'], required: true },  // Método de inicio de sesión
    loginAttempts: { type: Number, default: 0 },  // Número de intentos de inicio de sesión para esta sesión
    lastActivity: { type: Date, default: Date.now }  // Última actividad registrada en la sesión
  },
  history: [
    {
      status: { type: String, enum: ['Active', 'Expired', 'Revoked'], required: true },
      timestamp: { type: Date, default: Date.now },
      reason: { type: String },        // Motivo del cambio de estado
      changedBy: { type: Schema.Types.ObjectId, ref: 'User' } // Usuario que realizó el cambio, si aplica
    }
  ],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Revoked'], default: 'Active' },
  isActive: { type: Boolean, default: true },
});

// Método para expirar la sesión
sessionSchema.methods.expireSession = function (reason = 'Expiración automática') {
  this.isActive = false;
  this.status = 'Expired';
  this.history.push({
    status: 'Expired',
    reason,
    timestamp: new Date()
  });
  return this.save();
};

// Método para revocar la sesión
sessionSchema.methods.revokeSession = function (reason = 'Revocación por cierre de sesión') {
  this.isActive = false;
  this.status = 'Revoked';
  this.history.push({
    status: 'Revoked',
    reason,
    timestamp: new Date()
  });
  return this.save();
};

// Middleware para actualizar la última actividad
sessionSchema.pre('save', function (next) {
  this.metadata.lastActivity = new Date();
  next();
});

const Session = database.model('Session', sessionSchema);

export default Session;