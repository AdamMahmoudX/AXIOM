// =====================================================
// EMPLOYEE CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 3: Employee Management System
// =====================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, EmployeePermissions, DEFAULT_ROLE_PERMISSIONS, UserRole, EmployeeStatus } from '../types/user';
import { MOCK_EMPLOYEES } from '../data/employees';

// Storage key for employees
const EMPLOYEES_STORAGE_KEY = 'axiomx_employees';

// Helper function to safely handle JSON parsing
const safeJSONParse = <T,>(str: string | null): T | null => {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  updateEmployeePermissions: (id: string, permissions: EmployeePermissions) => void;
  updateEmployeeStatus: (id: string, status: EmployeeStatus) => void;
  updateEmployeeRole: (id: string, role: UserRole) => void;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load employees from localStorage on mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    const parsedEmployees = safeJSONParse<Employee[]>(storedEmployees);

    if (parsedEmployees && parsedEmployees.length > 0) {
      setEmployees(parsedEmployees);
    } else {
      // Use mock data if no stored data
      setEmployees(MOCK_EMPLOYEES);
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(MOCK_EMPLOYEES));
    }
    setIsLoading(false);
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && employees.length > 0) {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees, isLoading]);

  // Add new employee
  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt'>): Employee => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setEmployees(prev => {
      const updated = [...prev, newEmployee];
      return updated;
    });

    return newEmployee;
  };

  // Update existing employee
  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => {
      return prev.map(emp =>
        emp.id === id ? { ...emp, ...updates } : emp
      );
    });
  };

  // Delete employee
  const deleteEmployee = (id: string) => {
    setEmployees(prev => {
      return prev.filter(emp => emp.id !== id);
    });
  };

  // Get single employee
  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  };

  // Update employee permissions
  const updateEmployeePermissions = (id: string, permissions: EmployeePermissions) => {
    updateEmployee(id, { permissions });
  };

  // Update employee status
  const updateEmployeeStatus = (id: string, status: EmployeeStatus) => {
    updateEmployee(id, { status });
  };

  // Update employee role
  const updateEmployeeRole = (id: string, role: UserRole) => {
    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role];
    updateEmployee(id, {
      role,
      permissions: rolePermissions
    });
  };

  const value: EmployeeContextType = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    updateEmployeePermissions,
    updateEmployeeStatus,
    updateEmployeeRole,
    isLoading,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

// Custom hook to use employee context
export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

export default EmployeeContext;