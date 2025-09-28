'use client';

import { useState, useCallback } from 'react';
import { 
  adminAPI, 
  User,
  PaginationParams,
  LoanApplication
} from '@/lib/api/admin';

interface UsersResponse {
  users: User[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

interface UseUsersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: PaginationParams & {
    status?: 'active' | 'inactive' | 'all';
    kycStatus?: string;
  };
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { initialPage = 1, initialLimit = 20, initialFilters = {} } = options;

  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);

  const fetchUsers = useCallback(async (
    page = currentPage,
    limit = initialLimit,
    currentFilters = filters
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.users.getAllUsers({
        page,
        limit,
        ...currentFilters,
      });
      
      if (response.success && response.data) {
        setData({
          users: response.data.users,
          pagination: response.data.pagination
        });
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, filters]);

  const updateStatus = useCallback(async (
    userId: string,
    isActive: boolean,
    notes?: string
  ) => {
    try {
      await adminAPI.enhancedUsers.updateUserStatus(userId, isActive, notes);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      return false;
    }
  }, [fetchUsers]);

  const updateKYCStatus = useCallback(async (
    userId: string,
    kycStatus: 'approved' | 'rejected',
    notes?: string
  ) => {
    try {
      // For now, return success until KYC endpoint is implemented
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update KYC status');
      return false;
    }
  }, [fetchUsers]);

  const bulkStatusUpdate = useCallback(async (
    userIds: string[],
    isActive: boolean,
    notes?: string
  ) => {
    try {
      const result = await adminAPI.bulkOperations.bulkUpdateUserStatus(userIds, { isActive, reason: notes });
      if (result.success && result.data) {
        await fetchUsers();
        return result.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update users');
      return null;
    }
  }, [fetchUsers]);

  const applyFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    data,
    loading,
    error,
    currentPage,
    filters,
    fetchUsers,
    updateStatus,
    updateKYCStatus,
    bulkStatusUpdate,
    applyFilters,
    goToPage,
    refetch: () => fetchUsers(),
  };
};

// Hook for managing a single user's applications
export const useUserApplications = (userId: string) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.users.getUserDetails(userId);
      if (response.success && response.data) {
        setApplications(response.data.user.applications || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user applications');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    refetch: fetchApplications,
  };
};