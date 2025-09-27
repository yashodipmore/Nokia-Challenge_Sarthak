// Admin API Integration for Nokia Challenge Loan Management System
// Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Types for Admin API responses
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'senior_admin' | 'loan_officer' | 'risk_analyst';
  department: string;
  employeeId: string;
  permissions: string[];
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isVerified?: boolean;
  createdAt: string;
  stats?: {
    totalApplications: number;
    pendingApplications: number;
  };
  applications?: LoanApplication[];
}

export interface LoanApplication {
  _id: string;
  applicationId: string;
  userId: string;
  loanAmount: number;
  loanType: string;
  purpose: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  monthlyIncome: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
  approvedAmount?: number;
  comments?: string;
  createdAt: string;
}

export interface DashboardStats {
  users: {
    total: number;
    recent: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    recent: number;
  };
  loanAmounts: {
    [status: string]: {
      amount: number;
      count: number;
    };
  };
  latestApplications: Array<{
    applicationId: string;
    loanAmount: number;
    status: string;
    createdAt: string;
    userId: {
      name: string;
      email: string;
    };
  }>;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminUser;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApplicationFilters extends PaginationParams {
  status?: string;
}

// Utility function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Utility function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ===============================
// AUTHENTICATION APIS
// ===============================

export const adminAuthAPI = {
  // Admin Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage on successful login
    if (response.success && response.token) {
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
    }
    
    return response;
  },

  // Register Super Admin (Initial Setup)
  registerSuperAdmin: async (adminData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    employeeId: string;
    registrationKey?: string;
  }): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/admin/register-super-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
    
    // Store token in localStorage on successful registration
    if (response.success && response.token) {
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
    }
    
    return response;
  },

  // Get Admin Profile
  getProfile: async (): Promise<APIResponse<{ admin: AdminUser }>> => {
    return apiCall<APIResponse<{ admin: AdminUser }>>('/admin/profile');
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Check if admin is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('adminToken');
  },

  // Get current admin from localStorage
  getCurrentAdmin: (): AdminUser | null => {
    const adminData = localStorage.getItem('adminUser');
    return adminData ? JSON.parse(adminData) : null;
  },
};

// ===============================
// USER MANAGEMENT APIS
// ===============================

export const userManagementAPI = {
  // Get All Users
  getAllUsers: async (params: PaginationParams = {}): Promise<APIResponse<{
    users: User[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  }>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const endpoint = `/admin/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiCall<APIResponse<{
      users: User[];
      pagination: {
        current: number;
        pages: number;
        total: number;
      };
    }>>(endpoint);
  },

  // Get Single User Details
  getUserDetails: async (userId: string): Promise<APIResponse<{ user: User }>> => {
    return apiCall<APIResponse<{ user: User }>>(`/admin/users/${userId}`);
  },

  // Create New Admin (Super Admin Only)
  createAdmin: async (adminData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: string;
    department?: string;
    employeeId: string;
    permissions?: string[];
  }): Promise<APIResponse<{ admin: AdminUser }>> => {
    return apiCall<APIResponse<{ admin: AdminUser }>>('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },
};

// ===============================
// APPLICATION MANAGEMENT APIS
// ===============================

export const applicationManagementAPI = {
  // Get All Applications
  getAllApplications: async (params: ApplicationFilters = {}): Promise<APIResponse<{
    applications: LoanApplication[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  }>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);

    const endpoint = `/admin/applications/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiCall<APIResponse<{
      applications: LoanApplication[];
      pagination: {
        current: number;
        pages: number;
        total: number;
      };
    }>>(endpoint);
  },

  // Get Application Details
  getApplicationDetails: async (applicationId: string): Promise<APIResponse<{ application: LoanApplication }>> => {
    return apiCall<APIResponse<{ application: LoanApplication }>>(`/applications/admin/details/${applicationId}`);
  },

  // Update Application Status (Approve/Reject)
  updateApplicationStatus: async (
    applicationId: string,
    statusData: {
      decision: 'approved' | 'rejected';
      reason: string;
      approvedAmount?: number;
      comments?: string;
    }
  ): Promise<APIResponse<{ application: LoanApplication }>> => {
    return apiCall<APIResponse<{ application: LoanApplication }>>(
      `/applications/admin/update-status/${applicationId}`,
      {
        method: 'PUT',
        body: JSON.stringify(statusData),
      }
    );
  },

  // Get Application Statistics
  getApplicationStats: async (): Promise<APIResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    averageAmount: number;
  }>> => {
    return apiCall<APIResponse<{
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      totalAmount: number;
      averageAmount: number;
    }>>('/applications/admin/stats');
  },
};

// ===============================
// DASHBOARD APIS
// ===============================

export const dashboardAPI = {
  // Get Dashboard Statistics
  getStats: async (): Promise<APIResponse<{ stats: DashboardStats }>> => {
    return apiCall<APIResponse<{ stats: DashboardStats }>>('/admin/dashboard/stats');
  },
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

export const adminUtils = {
  // Format currency
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  },

  // Get status color
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  // Get role badge color
  getRoleColor: (role: string): string => {
    switch (role) {
      case 'super_admin':
        return 'text-purple-600 bg-purple-100';
      case 'admin':
        return 'text-blue-600 bg-blue-100';
      case 'senior_admin':
        return 'text-indigo-600 bg-indigo-100';
      case 'loan_officer':
        return 'text-green-600 bg-green-100';
      case 'risk_analyst':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  // Calculate risk score color
  getRiskScoreColor: (score: number): string => {
    if (score <= 30) return 'text-green-600 bg-green-100';
    if (score <= 60) return 'text-yellow-600 bg-yellow-100';
    if (score <= 80) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  },
};

// Export all APIs as a single object for convenience
export const adminAPI = {
  auth: adminAuthAPI,
  users: userManagementAPI,
  applications: applicationManagementAPI,
  dashboard: dashboardAPI,
  utils: adminUtils,
};

export default adminAPI;