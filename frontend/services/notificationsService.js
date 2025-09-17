// services/notificationsService.js
//
// Exposes functions to manage admin notifications.  Includes
// retrieval, marking as read, and deletion.  The unread count can
// also be fetched for display in the admin UI.

import api from './api';

const notificationsService = {
  /**
   * Retrieve notifications.  Accepts optional pagination params.
   */
  async getNotifications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return await api.get(`/api/admin/notifications${qs ? `?${qs}` : ''}`);
  },

  /** Mark a single notification as read. */
  async markAsRead(id) {
    return await api.put(`/api/admin/notifications/${id}/read`);
  },

  /** Mark all notifications as read. */
  async markAllAsRead() {
    return await api.put('/api/admin/notifications/read-all');
  },

  /** Delete a notification. */
  async deleteNotification(id) {
    return await api.delete(`/api/admin/notifications/${id}`);
  },

  /** Retrieve the count of unread notifications. */
  async getUnreadCount() {
    return await api.get('/api/admin/notifications/unread-count');
  },
};

export default notificationsService;