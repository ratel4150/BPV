import database from "../config/index.js";
import subMenuSchema from "./SubMenu.js";

const {Schema} = database
const MenuSchema = new Schema({
    name: { type: String, required: true },                  // Nombre del menú
    route: { type: String, required: true },                 // Ruta principal del menú
    icon: { type: String },                                  // Ícono asociado al menú
    subMenus: [subMenuSchema],                               // Lista de submenús
    visibilityConditions: [                                  // Condiciones de visibilidad avanzada
      {
        userAttribute: { type: String },                     // Atributo de usuario, ej. "role", "department"
        operator: { type: String, enum: ["==", "!=", "<=", ">=", "in"] },
        value: { type: Schema.Types.Mixed },
      },
    ],
    accessControls: [                                        // Controles de acceso avanzados
      {
        minRoleLevel: { type: Number, required: true },      // Nivel de rol mínimo para acceder al menú
        allowedDepartments: [String],                        // Lista de departamentos con acceso
        geoLocationAccess: [                                 // Control de acceso basado en geolocalización
          {
            country: { type: String },
            region: { type: String },
          },
        ],
      },
    ],
    metrics: {                                               // Métricas de uso para seguimiento
      usageCount: { type: Number, default: 0 },
      lastAccessed: { type: Date },
    },
    auditLog: [                                              // Historial de auditoría
      {
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        changeDate: { type: Date, default: Date.now },
        changeDetails: { type: String },
      },
    ],
  });
const Menu = database.model('Menu', MenuSchema);
export default Menu