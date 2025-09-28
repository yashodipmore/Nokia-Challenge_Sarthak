'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  adminAPI,
  DashboardStats,
  AnalyticsData
} from '@/lib/api/admin';

// Hook for dashboard statistics
export const useDashboardStats = (dateRange?: { startDate: string; endDate: string }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (customDateRange?: { startDate: string; endDate: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.dashboard.getStats();
      if (response.success && response.data) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refetch: () => fetchStats(),
  };
};

// Hook for application trends
export const useApplicationTrends = (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const [trends, setTrends] = useState<AnalyticsData['loanPerformance']['monthlyTrends']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async (customPeriod?: typeof period) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.analytics.getLoanPerformance();
      if (response.success && response.data) {
        setTrends(response.data.monthlyTrends);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch application trends');
    } finally {
      setLoading(false);
    }
  }, [period]);

  return {
    trends,
    loading,
    error,
    fetchTrends,
    refetch: () => fetchTrends(),
  };
};

// Hook for fraud analytics
export const useFraudAnalytics = (dateRange?: { startDate: string; endDate: string }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData['riskAnalytics'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (customDateRange?: { startDate: string; endDate: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.analytics.getRiskAnalytics();
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fraud analytics');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refetch: () => fetchAnalytics(),
  };
};

// Hook for system health monitoring (using placeholder until backend implements)
export const useSystemHealth = (autoRefresh = true, refreshInterval = 30000) => {
  const [health, setHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, return mock data until backend implements system health endpoint
      const mockHealth = {
        status: 'healthy' as const,
        database: { status: 'connected' as const, responseTime: 45 },
        activeUsers: 125,
        systemLoad: 0.65,
        uptime: 99.8
      };
      setHealth(mockHealth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchHealth, autoRefresh, refreshInterval]);

  return {
    health,
    loading,
    error,
    fetchHealth,
    refetch: fetchHealth,
  };
};

// Combined analytics hook for comprehensive dashboard data
export const useAnalyticsDashboard = (options?: {
  dateRange?: { startDate: string; endDate: string };
  period?: 'week' | 'month' | 'quarter' | 'year';
  autoRefresh?: boolean;
  refreshInterval?: number;
}) => {
  const {
    dateRange,
    period = 'month',
    autoRefresh = false,
    refreshInterval = 60000
  } = options || {};

  const dashboardStats = useDashboardStats(dateRange);
  const applicationTrends = useApplicationTrends(period);
  const fraudAnalytics = useFraudAnalytics(dateRange);
  const systemHealth = useSystemHealth(autoRefresh, refreshInterval);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        dashboardStats.refetch(),
        applicationTrends.refetch(),
        fraudAnalytics.refetch(),
        systemHealth.refetch(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh analytics data');
    } finally {
      setLoading(false);
    }
  }, [dashboardStats, applicationTrends, fraudAnalytics, systemHealth]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(refreshAll, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshAll, autoRefresh, refreshInterval]);

  return {
    dashboardStats: dashboardStats.stats,
    applicationTrends: applicationTrends.trends,
    fraudAnalytics: fraudAnalytics.analytics,
    systemHealth: systemHealth.health,
    loading: loading || dashboardStats.loading || applicationTrends.loading || fraudAnalytics.loading || systemHealth.loading,
    error: error || dashboardStats.error || applicationTrends.error || fraudAnalytics.error || systemHealth.error,
    refreshAll,
    individual: {
      dashboardStats,
      applicationTrends,
      fraudAnalytics,
      systemHealth,
    },
  };
};