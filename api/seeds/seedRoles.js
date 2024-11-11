
import Role from '../models/Role.js';

const seedRoles = async () => {
    try {
      // Define roles de ejemplo con permisos aleatorios
      const roles = [
        { name: 'Admin', permissions: ['manage_users', 'view_reports', 'edit_settings', 'configure_system', 'manage_roles'] },
        { name: 'Manager', permissions: ['view_reports', 'manage_inventory', 'edit_settings', 'approve_discounts', 'view_sales_reports'] },
        { name: 'Staff', permissions: ['view_inventory', 'edit_inventory', 'process_sales', 'issue_receipts', 'process_refunds'] },
        { name: 'Cashier', permissions: ['process_sales', 'issue_receipts', 'handle_cash', 'close_register', 'manage_cash_drawer'] },
        { name: 'Inventory Clerk', permissions: ['view_inventory', 'update_stock_levels', 'manage_reorders', 'receive_shipments', 'inspect_quality'] },
        { name: 'Customer Support', permissions: ['assist_customers', 'process_refunds', 'issue_store_credits', 'view_customer_accounts'] },
        { name: 'Accountant', permissions: ['view_sales_reports', 'manage_finances', 'generate_invoices', 'manage_tax_reports', 'audit_transactions'] },
        { name: 'Sales Analyst', permissions: ['view_sales_reports', 'analyze_sales_data', 'forecast_inventory_needs', 'generate_sales_reports'] },
        { name: 'Maintenance Technician', permissions: ['manage_equipment', 'schedule_repairs', 'inspect_equipment', 'update_equipment_status'] },
        { name: 'IT Support', permissions: ['manage_software', 'configure_network', 'troubleshoot_issues', 'reset_passwords', 'manage_access_rights'] },
        { name: 'HR Manager', permissions: ['manage_employees', 'view_employee_records', 'handle_recruitment', 'approve_leaves', 'conduct_performance_reviews'] },
        { name: 'Marketing Specialist', permissions: ['create_campaigns', 'manage_social_media', 'generate_leads', 'view_sales_data', 'analyze_campaign_performance'] },
        { name: 'Security Officer', permissions: ['monitor_security', 'manage_access_control', 'view_security_logs', 'handle_incidents', 'review_safety_protocols'] },
        { name: 'Logistics Coordinator', permissions: ['schedule_deliveries', 'manage_shipment_tracking', 'coordinate_with_suppliers', 'track_inventory_movement'] },
        { name: 'Vendor Relations', permissions: ['manage_suppliers', 'negotiate_contracts', 'process_orders', 'handle_vendor_issues', 'review_supplier_performance'] },
      ];
  
  
      await Role.insertMany(roles);
      console.log('Roles seeded successfully');
    } catch (error) {
      console.error('Error seeding roles:', error);
    }
  };
  
  export default seedRoles;