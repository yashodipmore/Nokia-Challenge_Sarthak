'use client';

import { useState, useCallback } from 'react';
import { 
  adminAPI, 
  LoanApplication,
  ApplicationFilters
} from '@/lib/api/admin';

interface LoanApplicationsResponse {
  applications: LoanApplication[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

interface UseLoanApplicationsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: ApplicationFilters;
}

export const useLoanApplications = (options: UseLoanApplicationsOptions = {}) => {
  const { initialPage = 1, initialLimit = 20, initialFilters = {} } = options;

  const [data, setData] = useState<LoanApplicationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);

  const fetchApplications = useCallback(async (
    page = currentPage,
    limit = initialLimit,
    currentFilters = filters
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLoanApplications({
        page,
        limit,
        ...currentFilters,
      });
      setData(response);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, filters]);

  const updateStatus = useCallback(async (
    applicationId: string,
    status: 'approved' | 'rejected' | 'under_review',
    notes?: string,
    rejectionReason?: string
  ) => {
    try {
      await updateLoanApplicationStatus(applicationId, { status, notes, rejectionReason });
      // Refresh data after update
      await fetchApplications();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
      return false;
    }
  }, [fetchApplications]);

  const bulkUpdate = useCallback(async (
    applicationIds: string[],
    action: 'approve' | 'reject' | 'under_review',
    data?: { notes?: string; rejectionReason?: string }
  ) => {
    try {
      const result = await bulkUpdateLoanApplications(applicationIds, action, data);
      // Refresh data after bulk update
      await fetchApplications();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update applications');
      return null;
    }
  }, [fetchApplications]);

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
    fetchApplications,
    updateStatus,
    bulkUpdate,
    exportData,
    applyFilters,
    goToPage,
    refetch: () => fetchApplications(),
  };
};