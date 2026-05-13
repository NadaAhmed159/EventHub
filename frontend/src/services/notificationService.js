import api from './api';

/**
 * Notifications Service - Handles notification API calls
 */
export const notificationService = {
  // Get notifications for a user
  getUserNotifications: (userId) => api.get(`/api/notification/user/${userId}`),

  // Send notification
  sendNotification: (notificationData) => api.post('/api/notification/send', notificationData),

  // Mark notification as read
  markAsRead: (notificationId) => api.put(`/api/notification/${notificationId}/read`),
};

export default notificationService;
