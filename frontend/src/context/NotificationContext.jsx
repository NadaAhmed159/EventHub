import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { notificationService } from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

function normalizeNotification(notification) {
  if (!notification) return null;

  return {
    ...notification,
    id: notification.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message: notification.message || notification.title || notification.body || 'Notification',
    createdAt: notification.createdAt || notification.createdAtUtc || notification.time || new Date().toISOString(),
    unread: notification.unread ?? notification.isRead === false ?? true,
  };
}

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const connectionRef = useRef(null);
  const pollRef = useRef(null);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setNotifications([]);
      return;
    }

    try {
      const response = await notificationService.getUserNotifications(user.id);
      const items = Array.isArray(response.data) ? response.data : [];
      setNotifications(items.map(normalizeNotification).filter(Boolean));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {
        // ignore in some browsers
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }

      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      setNotifications([]);
      return undefined;
    }

    const apiBaseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const hubUrl = `${apiBaseUrl.replace(/\/$/, '')}/hubs/notifications`;
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('token') || '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const handleIncoming = (payload) => {
      const notification = normalizeNotification(payload);
      if (!notification) return;

      setNotifications((current) => {
        const exists = current.some((item) => String(item.id) === String(notification.id));
        if (exists) {
          return current.map((item) => (String(item.id) === String(notification.id) ? { ...item, ...notification } : item));
        }

        return [notification, ...current];
      });
    };

    const handleRead = (payload) => {
      const notificationId = payload?.notificationId;
      if (!notificationId) return;

      setNotifications((current) => current.map((notification) => (
        String(notification.id) === String(notificationId)
          ? { ...notification, unread: false, isRead: true }
          : notification
      )));
    };

    connection.on('notification:new', handleIncoming);
    connection.on('notification:read', handleRead);

    connection.start()
      .then(() => refreshNotifications())
      .catch((error) => {
        console.error('Failed to connect notifications hub:', error);
      });

    pollRef.current = setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => {
      connection.off('notification:new', handleIncoming);
      connection.off('notification:read', handleRead);
      if (connection.state !== HubConnectionState.Disconnected) {
        connection.stop();
      }
      connectionRef.current = null;

      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id, user?.applyAs, refreshNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    } finally {
      setNotifications((current) => current.map((notification) => (
        String(notification.id) === String(notificationId)
          ? { ...notification, unread: false, isRead: true }
          : notification
      )));
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      refreshNotifications,
      markNotificationAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
