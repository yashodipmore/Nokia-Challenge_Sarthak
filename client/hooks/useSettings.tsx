'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  adminAPI,
  SystemSettings
} from '@/lib/api/admin';

  const updateGeneralSettings = useCallback(async (generalSettings: Partial<SystemSettings['general']>) => {
    if (!settings) return false;

    return updateSettings({
      general: {
        ...settings.general,
        ...generalSettings,
      },
    });
  }, [settings, updateSettings]);

  const updateLoanSettings = useCallback(async (loanSettings: Partial<SystemSettings['loan']>) => {
    if (!settings) return false;

    return updateSettings({
      loan: {
        ...settings.loan,
        ...loanSettings,
      },
    });
  }, [settings, updateSettings]);

  const updateNotificationSettings = useCallback(async (notificationSettings: Partial<SystemSettings['notifications']>) => {
    if (!settings) return false;

    return updateSettings({
      notifications: {
        ...settings.notifications,
        ...notificationSettings,
      },
    });
  }, [settings, updateSettings]);

  const updateSecuritySettings = useCallback(async (securitySettings: Partial<SystemSettings['security']>) => {
    if (!settings) return false;

    return updateSettings({
      security: {
        ...settings.security,
        ...securitySettings,
      },
    });
  }, [settings, updateSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
    updateGeneralSettings,
    updateLoanSettings,
    updateNotificationSettings,
    updateSecuritySettings,
    refetch: fetchSettings,
  };
};

// Hook for notifications management (mock implementation until backend supports it)
export const useNotifications = (options?: {
  limit?: number;
  unreadOnly?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}) => {
  const {
    limit = 50,
    unreadOnly = false,
    autoRefresh = true,
    refreshInterval = 30000
  } = options || {};

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock notifications until backend implements this
      const mockNotifications = [
        {
          id: '1',
          title: 'New Loan Application',
          message: 'A new loan application has been submitted',
          type: 'info',
          priority: 'medium',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [limit, unreadOnly]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
      return false;
    }
  }, []);

  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority: string) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  const getCriticalNotifications = useCallback(() => {
    return notifications.filter(n => n.priority === 'critical' && !n.isRead);
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchNotifications, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, autoRefresh, refreshInterval]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getNotificationsByPriority,
    getCriticalNotifications,
    refetch: fetchNotifications,
  };
};

// Hook for real-time notifications (using polling)
export const useRealTimeNotifications = (pollInterval = 10000) => {
  const [latestNotifications, setLatestNotifications] = useState<any[]>([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkForNewNotifications = useCallback(async () => {
    try {
      // Mock implementation - in real app, this would poll the backend
      const mockNewNotifications: any[] = [];
      
      if (mockNewNotifications.length > 0) {
        setLatestNotifications(prev => [...mockNewNotifications, ...prev].slice(0, 20));
        setNewNotificationCount(prev => prev + mockNewNotifications.length);
        setLastCheck(new Date());
      }
    } catch (err) {
      console.error('Failed to check for new notifications:', err);
    }
  }, [lastCheck]);

  const clearNewCount = useCallback(() => {
    setNewNotificationCount(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(checkForNewNotifications, pollInterval);
    return () => clearInterval(interval);
  }, [checkForNewNotifications, pollInterval]);

  return {
    latestNotifications,
    newNotificationCount,
    checkForNewNotifications,
    clearNewCount,
  };
};