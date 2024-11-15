import database from "../config/index.js";


const {Schema} = database
const roleSchema = new Schema({
  name: { type: String, required: true },                    // Nombre del rol
  description: { type: String },                             // Descripción del rol
  inheritFrom: { type: Schema.Types.ObjectId, ref: 'Role' }, // Rol del cual se heredan permisos
  permissions: [
    {
      resource: { type: String, required: true },            // Nombre del recurso, ej., "/departments"
      actions: [
        {
          name: { type: String, enum: ["create", "read", "update", "delete"], required: true },
          method:{ type: String }, 
          conditionals: [                                    // Condiciones para acceso
            {
              
              attribute: { type: String },                   // Atributo condicional, ej., "location"
              condition: { type: String, enum: ["==", "!=", "<", ">", "in", "not_in"] },
              value: { type: Schema.Types.Mixed },
            },
          ],
          usageLimits: {                                     // Límites de uso de acciones
            maxPerMinute: { type: Number, default: 10 },
            maxPerDay: { type: Number, default: 100 },
          },
        },
      ],
    },
  ],
  menusAccess: [                                             // Acceso a menús
    {
      menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
      accessLevel: { type: String, enum: ["view_only", "edit", "admin"], default: "view_only" },
      subMenuPermissions: [
        {
          subMenu: { type: Schema.Types.ObjectId, ref: 'SubMenu' },
          accessType: { type: String, enum: ["view", "edit", "delete"], default: "view" },
        },
      ],
    },
  ],
  roleHierarchy: {                                           // Nivel jerárquico del rol
    level: { type: Number, default: 1 },                     // Nivel de rol, ej., 1 para admin, 5 para básico
    inheritsPermissions: { type: Boolean, default: false },  // Si hereda permisos de un rol padre
  },
  auditLog: [                                                // Historial de cambios
    {
      action: { type: String, enum: ["created", "updated", "deleted"] },
      performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      performedAt: { type: Date, default: Date.now },
      details: { type: String },
    },
  ],
  privacyPolicySettings: {                                   // Configuración de privacidad
    accessToSensitiveData: { type: Boolean, default: false },
    restrictedAccessHours: {
      startHour: { type: Number, min: 0, max: 23 },
      endHour: { type: Number, min: 0, max: 23 },
    },
    geoAccessRestrictions: [                                 // Restricciones de acceso basadas en geolocalización
      {
        country: { type: String },
        region: { type: String },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Role = database.model('Role', roleSchema);
export default Role;