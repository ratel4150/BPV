import Role from '../models/Role.js';
import mongoose from 'mongoose';

const seedRoles = async () => {
  const roles = [
    {
      name: 'Admin',
      description: 'Administrador general con acceso completo',
      permissions: [
        {
          resource: '/products',
          actions: [
            {
              name: 'create',
              method: 'POST',  // Se agrega el método HTTP
              conditionals: [],
              usageLimits: { maxPerMinute: 30, maxPerDay: 500 },
            },
            {
              name: 'update',
              method: 'PUT',  // Se agrega el método HTTP
              conditionals: [],
              usageLimits: { maxPerMinute: 20, maxPerDay: 300 },
            },
            {
              name: 'delete',
              method: 'DELETE',  // Se agrega el método HTTP
              conditionals: [{ attribute: 'status', condition: '!=', value: 'sold' }],
              usageLimits: { maxPerMinute: 10, maxPerDay: 100 },
            },
          ],
        },
        {
          resource: '/departments/',
          actions: [
            {
              name: 'create',
              method: 'POST',  // Se agrega el método HTTP
              conditionals: [],
              usageLimits: { maxPerMinute: 30, maxPerDay: 500 },
            },
            {
              name: 'update',
              method: 'PUT',  // Se agrega el método HTTP
              conditionals: [],
              usageLimits: { maxPerMinute: 20, maxPerDay: 300 },
            },
            {
              name: 'delete',
              method: 'DELETE',  // Se agrega el método HTTP
              conditionals: [{ attribute: 'status', condition: '!=', value: 'sold' }],
              usageLimits: { maxPerMinute: 10, maxPerDay: 100 },
            },
          ],
        },
        {
          resource: '/users',
          actions: [
            {
              name: 'create',
              method: 'POST',  // Se agrega el método HTTP
              conditionals: [{ attribute: 'role', condition: 'in', value: ['cashier', 'manager'] }],
              usageLimits: { maxPerMinute: 5, maxPerDay: 50 },
            },
            {
              name: 'delete',
              method: 'DELETE',  // Se agrega el método HTTP
              conditionals: [{ attribute: 'role', condition: '!=', value: 'admin' }],
              usageLimits: { maxPerMinute: 5, maxPerDay: 30 },
            },
          ],
        },
      ],
      menusAccess: [
        {
          menu: new mongoose.Types.ObjectId(),
          accessLevel: 'admin',
          subMenuPermissions: [
            {
              subMenu: new mongoose.Types.ObjectId(),
              accessType: 'edit',
            },
          ],
        },
      ],
      roleHierarchy: { level: 1, inheritsPermissions: true },
      privacyPolicySettings: {
        accessToSensitiveData: true,
        restrictedAccessHours: { startHour: 0, endHour: 23 },
        geoAccessRestrictions: [{ country: 'All' }],
      },
    },
    {
      name: 'Manager',
      description: 'Gerente con acceso a la gestión de inventario y reportes',
      inheritFrom: null,
      permissions: [
        {
          resource: '/inventory',
          actions: [
            {
              name: 'read',
              method: 'GET',  // Se agrega el método HTTP
              conditionals: [],
              usageLimits: { maxPerMinute: 50, maxPerDay: 1000 },
            },
            {
              name: 'update',
              method: 'PUT',  // Se agrega el método HTTP
              conditionals: [{ attribute: 'category', condition: '!=', value: 'restricted' }],
              usageLimits: { maxPerMinute: 20, maxPerDay: 200 },
            },
          ],
        },
      ],
      menusAccess: [
        {
          menu: new mongoose.Types.ObjectId(),
          accessLevel: 'edit',
          subMenuPermissions: [
            {
              subMenu: new mongoose.Types.ObjectId(),
              accessType: 'view',
            },
          ],
        },
      ],
      roleHierarchy: { level: 2, inheritsPermissions: false },
      privacyPolicySettings: {
        accessToSensitiveData: false,
        restrictedAccessHours: { startHour: 8, endHour: 18 },
        geoAccessRestrictions: [{ country: 'US', region: 'CA' }],
      },
    },
    {
      name: 'Cashier',
      description: 'Cajero con acceso limitado a ventas y clientes',
      permissions: [
        {
          resource: '/sales',
          actions: [
            {
              name: 'create',
              method: 'POST',  // Se agrega el método HTTP
              conditionals: [{ attribute: 'paymentStatus', condition: '==', value: 'paid' }],
              usageLimits: { maxPerMinute: 100, maxPerDay: 1500 },
            },
            {
              name: 'read',
              method: 'GET',  // Se agrega el método HTTP
              conditionals: [],
              usageLimits: { maxPerMinute: 200, maxPerDay: 3000 },
            },
          ],
        },
      ],
      menusAccess: [
        {
          menu: new mongoose.Types.ObjectId(),
          accessLevel: 'view_only',
          subMenuPermissions: [
            {
              subMenu: new mongoose.Types.ObjectId(),
              accessType: 'view',
            },
          ],
        },
      ],
      roleHierarchy: { level: 5, inheritsPermissions: false },
      privacyPolicySettings: {
        accessToSensitiveData: false,
        restrictedAccessHours: { startHour: 8, endHour: 20 },
        geoAccessRestrictions: [{ country: 'US' }],
      },
    },
  ];

  try {
    await Role.deleteMany(); // Eliminar roles existentes
    await Role.insertMany(roles); // Insertar roles en la base de datos
    console.log('Roles seeded successfully!');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};

export default seedRoles;