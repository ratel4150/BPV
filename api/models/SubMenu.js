import database from "../config/index.js";


const {Schema} = database
const subMenuSchema = new Schema({
    name: { type: String, required: true },               // Nombre del submenú
    route: { type: String, required: true },              // Ruta del submenú
    icon: { type: String },                               // Ícono asociado
    visibilityRules: [/*  */
      {
        condition: { type: String },                      // Condición para visibilidad dinámica (ej., "isAdmin", "location == 'US'")
        isVisible: { type: Boolean, default: true },      // Visibilidad según condición
      },
    ],
    privacyPolicy: {                                      // Control de privacidad de acceso al submenú
      sensitivityLevel: { type: String, enum: ["low", "medium", "high", "confidential"], default: "low" },
      dataMasking: { type: Boolean, default: false },     // Si se debe enmascarar los datos en este submenú
    },
    actions: [
      {
        name: { type: String, enum: ["create", "read", "update", "delete"], required: true },
        quotaLimits: {                                    // Límite de acciones permitidas
          maxRequestsPerMinute: { type: Number, default: 10 },
          maxRequestsPerDay: { type: Number, default: 100 },
        },
        accessControl: {                                  // Control de acceso detallado
          minRoleLevel: { type: Number, default: 1 },     // Nivel de rol mínimo requerido
          geoRestrictions: [String],                      // Restricciones geográficas
          timeRestrictions: {                             // Restricciones horarias
            startHour: { type: Number, min: 0, max: 23 },
            endHour: { type: Number, min: 0, max: 23 },
          },
        },
        auditTrail: [                                     // Historial de auditoría para cambios en el acceso
          {
            actionBy: { type: Schema.Types.ObjectId, ref: 'User' },
            actionDate: { type: Date, default: Date.now },
            actionType: { type: String, enum: ["granted", "revoked", "modified"] },
            details: { type: String },
          },
        ],
      },
    ],
  });

const SubMenu = database.model('SubMenu', subMenuSchema);
export default SubMenu