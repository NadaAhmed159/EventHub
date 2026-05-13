import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { notificationService } from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

let idCounter = 1;

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
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const pollRef = useRef(null);
  const EXIT_ANIM_MS = 320;

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
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      setNotifications([]);
      return undefined;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5178';
    const socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current = socket;

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

      showToast('success', notification.message);
    };

    socket.on('connect', () => {
      socket.emit('notifications:join', { userId: user.id, role: user.applyAs });
      socket.emit('joinNotifications', { userId: user.id });
      socket.emit('join', { userId: user.id });
      refreshNotifications();
    });

    socket.on('notification', handleIncoming);
    socket.on('notifications:new', handleIncoming);
    socket.on('notification:new', handleIncoming);
    socket.on('ticket:purchased', handleIncoming);
    socket.on('event:approved', handleIncoming);
    socket.on('event:rejected', handleIncoming);

    socket.connect();

    pollRef.current = setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => {
      socket.off('notification', handleIncoming);
      socket.off('notifications:new', handleIncoming);
      socket.off('notification:new', handleIncoming);
      socket.off('ticket:purchased', handleIncoming);
      socket.off('event:approved', handleIncoming);
      socket.off('event:rejected', handleIncoming);
      socket.disconnect();
      socketRef.current = null;

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

  const startClose = useCallback((id) => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, closing: true } : x)));
    // remove after exit animation
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, EXIT_ANIM_MS);
  }, []);

  const showToast = useCallback((type, message, duration = 4000) => {
    const id = idCounter++;
    setToasts((t) => [...t, { id, type, message, closing: false }]);
    if (duration > 0) {
      setTimeout(() => startClose(id), duration);
    }
    return id;
  }, [startClose]);

  const removeToast = useCallback((id) => {
    // trigger exit animation then remove
    startClose(id);
  }, [startClose]);

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
      showToast,
      removeToast,
      notifications,
      unreadCount,
      refreshNotifications,
      markNotificationAsRead,
    }}>
      {children}
      <div style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`app-toast ${toast.type === 'error' ? 'app-toast--error' : ''} ${toast.closing ? 'app-toast--closing' : ''}`}
            style={{
              minWidth: '280px',
              marginBottom: '10px',
              backgroundColor: toast.type === 'error' ? '#fff4f6' : '#0f5132',
              color: toast.type === 'error' ? '#842029' : '#d1e7dd',
              border: toast.type === 'error' ? '1px solid #f5c2c7' : '1px solid rgba(15,81,50,0.75)',
              padding: '12px 14px',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(2,6,23,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 600,
            }}
          >
            <div style={{ fontSize: '1.2rem' }}>{toast.type === 'error' ? '⚠' : '✓'}</div>
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>✕</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
