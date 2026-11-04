// =====================================================
// EMPLOYEE MOCK DATA - AXIOMX ADMIN SYSTEM
// Phase 3: Employee Management System
// Phase 6A-3: Service CMS Roles
// =====================================================

import { Employee, EmployeePermissions, DEFAULT_ROLE_PERMISSIONS, SERVICE_ROLE_PERMISSIONS, ServiceRole } from '../types/user';

// Helper to create full permissions object
const createPermissions = (base: EmployeePermissions): EmployeePermissions => ({ ...base });

// Helper to create service role permissions (Phase 6A-3)
const createServiceRolePermissions = (role: ServiceRole): EmployeePermissions => {
  return { ...SERVICE_ROLE_PERMISSIONS[role] };
};

// Generate random date in the past year
const randomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Mock Employees Data
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    fullName: 'أحمد محمد علي',
    email: 'ahmed.ali@axiomx.com',
    phone: '+966 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Senior Frontend Developer',
    role: 'owner',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.owner),
    createdAt: randomDate(365),
    lastLogin: randomDate(1),
    department: 'Engineering',
    notes: 'System founder and primary administrator',
  },
  {
    id: '2',
    fullName: 'سارة أحمد خالد',
    email: 'sara.ahmed@axiomx.com',
    phone: '+966 50 234 5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'System Administrator',
    role: 'admin',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.admin),
    createdAt: randomDate(300),
    lastLogin: randomDate(2),
    department: 'Operations',
    notes: 'Manages system configuration and user access',
  },
  {
    id: '3',
    fullName: 'محمد حسن يوسف',
    email: 'mohammed.hassan@axiomx.com',
    phone: '+966 50 345 6789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Project Manager',
    role: 'manager',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.manager),
    createdAt: randomDate(250),
    lastLogin: randomDate(3),
    department: 'Operations',
    notes: 'Manages multiple development teams',
  },
  {
    id: '4',
    fullName: 'فاطمة عبدالله',
    email: 'fatima.abdullah@axiomx.com',
    phone: '+966 50 456 7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'UI/UX Designer',
    role: 'employee',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(200),
    lastLogin: randomDate(5),
    department: 'Design',
    notes: 'Creates beautiful user experiences',
  },
  {
    id: '5',
    fullName: 'خالد إبراهيم',
    email: 'khaled.ibrahim@axiomx.com',
    phone: '+966 50 567 8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Backend Developer',
    role: 'employee',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(180),
    lastLogin: randomDate(1),
    department: 'Engineering',
    notes: 'Specializes in Node.js and Python',
  },
  {
    id: '6',
    fullName: 'نورة سعد الدوسري',
    email: 'noura.alsaadi@axiomx.com',
    phone: '+966 50 678 9012',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Marketing Manager',
    role: 'manager',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.manager),
    createdAt: randomDate(150),
    lastLogin: randomDate(4),
    department: 'Marketing',
    notes: 'Leads marketing campaigns and brand strategy',
  },
  {
    id: '7',
    fullName: 'عبدالله محمد القحطاني',
    email: 'abdullah.algthami@axiomx.com',
    phone: '+966 50 789 0123',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'DevOps Engineer',
    role: 'employee',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(120),
    lastLogin: randomDate(2),
    department: 'Engineering',
    notes: 'Manages CI/CD pipelines and cloud infrastructure',
  },
  {
    id: '8',
    fullName: 'ليلى حسن الشهري',
    email: 'layla.hassan@axiomx.com',
    phone: '+966 50 890 1234',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'HR Manager',
    role: 'manager',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.manager),
    createdAt: randomDate(100),
    lastLogin: randomDate(6),
    department: 'HR',
    notes: 'Handles recruitment and employee relations',
  },
  {
    id: '9',
    fullName: 'يوسف سلطان العنزي',
    email: 'yousef.sultan@axiomx.com',
    phone: '+966 50 901 2345',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Mobile Developer',
    role: 'employee',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(90),
    lastLogin: randomDate(3),
    department: 'Engineering',
    notes: 'iOS and Android specialist',
  },
  {
    id: '10',
    fullName: 'هند محمد السبيعي',
    email: 'hind.alsubaie@axiomx.com',
    phone: '+966 50 012 3456',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'QA Engineer',
    role: 'employee',
    status: 'inactive',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(80),
    lastLogin: randomDate(30),
    department: 'Operations',
    notes: 'On temporary leave',
  },
  {
    id: '11',
    fullName: 'راشد خالد الفريدي',
    email: 'rashed.alfaridi@axiomx.com',
    phone: '+966 50 111 2222',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Security Engineer',
    role: 'employee',
    status: 'active',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(70),
    lastLogin: randomDate(1),
    department: 'Engineering',
    notes: 'Responsible for system security',
  },
  {
    id: '12',
    fullName: 'منى عبدالله الزهراني',
    email: 'mona.alzahrani@axiomx.com',
    phone: '+966 50 222 3333',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Data Scientist',
    role: 'employee',
    status: 'suspended',
    permissions: createPermissions(DEFAULT_ROLE_PERMISSIONS.employee),
    createdAt: randomDate(60),
    lastLogin: randomDate(45),
    department: 'Engineering',
    notes: 'Account under review',
  },

  // =====================================================
  // SERVICE CMS ROLES EMPLOYEES (Phase 6A-3)
  // =====================================================

  {
    id: '13',
    fullName: 'منصور فهد السالم',
    email: 'mansour.salem@axiomx.com',
    phone: '+966 50 333 4444',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Service Admin',
    role: 'employee',
    serviceRole: 'service_admin',
    status: 'active',
    permissions: createServiceRolePermissions('service_admin'),
    createdAt: randomDate(50),
    lastLogin: randomDate(1),
    department: 'Content Management',
    notes: 'Manages all services in the CMS system',
  },
  {
    id: '14',
    fullName: 'ريم ناصر القحطاني',
    email: 'reem.nasser@axiomx.com',
    phone: '+966 50 444 5555',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Service Editor',
    role: 'employee',
    serviceRole: 'service_editor',
    status: 'active',
    permissions: createServiceRolePermissions('service_editor'),
    createdAt: randomDate(45),
    lastLogin: randomDate(2),
    department: 'Content Management',
    notes: 'Creates and edits service content',
  },
  {
    id: '15',
    fullName: 'عمر سعيد الدوسري',
    email: 'omar.saad@axiomx.com',
    phone: '+966 50 555 6666',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'SEO Manager',
    role: 'employee',
    serviceRole: 'service_seo_manager',
    status: 'active',
    permissions: createServiceRolePermissions('service_seo_manager'),
    createdAt: randomDate(40),
    lastLogin: randomDate(1),
    department: 'SEO',
    notes: 'Manages SEO settings for all services',
  },
  {
    id: '16',
    fullName: 'دانة إبراهيم الغامدي',
    email: 'dana.alghamdi@axiomx.com',
    phone: '+966 50 666 7777',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Service Translator',
    role: 'employee',
    serviceRole: 'service_translator',
    status: 'active',
    permissions: createServiceRolePermissions('service_translator'),
    createdAt: randomDate(35),
    lastLogin: randomDate(3),
    department: 'Content Management',
    notes: 'Translates service content between languages',
  },
  {
    id: '17',
    fullName: 'عبدالرحمن محمد القاسم',
    email: 'abdulrahman.algasim@axiomx.com',
    phone: '+966 50 777 8888',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    idCardImage: 'https://images.unsplash.com/photo-1633265486064-086f219f0d68?w=400&h=250&fit=crop',
    jobTitle: 'Service Viewer',
    role: 'employee',
    serviceRole: 'service_viewer',
    status: 'active',
    permissions: createServiceRolePermissions('service_viewer'),
    createdAt: randomDate(30),
    lastLogin: randomDate(4),
    department: 'Content Management',
    notes: 'View-only access to services',
  },
];

// Employee statistics
export const getEmployeeStats = () => {
  const total = MOCK_EMPLOYEES.length;
  const active = MOCK_EMPLOYEES.filter(e => e.status === 'active').length;
  const inactive = MOCK_EMPLOYEES.filter(e => e.status === 'inactive').length;
  const suspended = MOCK_EMPLOYEES.filter(e => e.status === 'suspended').length;
  const byRole = {
    owner: MOCK_EMPLOYEES.filter(e => e.role === 'owner').length,
    admin: MOCK_EMPLOYEES.filter(e => e.role === 'admin').length,
    manager: MOCK_EMPLOYEES.filter(e => e.role === 'manager').length,
    employee: MOCK_EMPLOYEES.filter(e => e.role === 'employee').length,
  };

  // Service role statistics (Phase 6A-3)
  const byServiceRole = {
    service_admin: MOCK_EMPLOYEES.filter(e => e.serviceRole === 'service_admin').length,
    service_editor: MOCK_EMPLOYEES.filter(e => e.serviceRole === 'service_editor').length,
    service_seo_manager: MOCK_EMPLOYEES.filter(e => e.serviceRole === 'service_seo_manager').length,
    service_translator: MOCK_EMPLOYEES.filter(e => e.serviceRole === 'service_translator').length,
    service_viewer: MOCK_EMPLOYEES.filter(e => e.serviceRole === 'service_viewer').length,
  };

  const byDepartment = MOCK_EMPLOYEES.reduce((acc, emp) => {
    acc[emp.department || 'Other'] = (acc[emp.department || 'Other'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total, active, inactive, suspended, byRole, byServiceRole, byDepartment };
};