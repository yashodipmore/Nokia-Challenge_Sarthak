'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { adminAPI, AdminUser } from '@/lib/api/admin';

interface AuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerSuperAdmin: (adminData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    employeeId: string;
    registrationKey?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const savedAdmin = localStorage.getItem('adminUser');

      if (token && savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
          // Optionally verify token with backend
          await refreshProfile();
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await adminAPI.auth.login(email, password);
      
      if (response.success) {
        setAdmin(response.admin);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const registerSuperAdmin = async (adminData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    employeeId: string;
    registrationKey?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await adminAPI.auth.registerSuperAdmin(adminData);
      
      if (response.success) {
        setAdmin(response.admin);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    adminAPI.auth.logout();
    setAdmin(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await adminAPI.auth.getProfile();
      if (response.success && response.data) {
        setAdmin(response.data.admin);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // Don't logout on profile refresh failure, token might still be valid
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    return admin.permissions.includes(permission) || admin.role === 'super_admin';
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!admin) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(admin.role);
  };

  const value: AuthContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    registerSuperAdmin,
    logout,
    refreshProfile,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Higher-order component for protecting admin routes
export function withAdminAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredPermissions?: string[],
  requiredRoles?: string[]
) {
  return function AdminProtectedComponent(props: T) {
    const { admin, isLoading, isAuthenticated, hasPermission, hasRole } = useAdminAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login or show login form
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    // Check permissions if required
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
      if (!hasAllPermissions) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Insufficient Permissions</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        );
      }
    }

    // Check roles if required
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = hasRole(requiredRoles);
      if (!hasRequiredRole) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600">Your role doesn't have access to this page.</p>
            </div>
          </div>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };
}