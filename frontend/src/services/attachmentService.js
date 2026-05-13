import api from './api';

/**
 * Attachments Service - Handles file uploads and attachments
 */
export const attachmentService = {
  // Upload attachment for an event
  uploadAttachment: (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/api/attachment/upload', formData, {
      params: { eventId },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get event attachments
  getEventAttachments: (eventId) => api.get(`/api/attachment/event/${eventId}`),

  // Delete attachment
  deleteAttachment: (attachmentId) => api.delete(`/api/attachment/${attachmentId}`),
};

export default attachmentService;
