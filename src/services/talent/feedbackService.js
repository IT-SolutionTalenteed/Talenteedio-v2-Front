import api from '../api.js'

export const feedbackService = {
  mesFeedbacks: () => api.get('/talent/mes-feedbacks'),
  store: (entretienId, data) => api.post(`/talent/entretiens/${entretienId}/feedback`, data),
  update: (feedbackId, data) => api.put(`/talent/feedbacks/${feedbackId}`, data),
  destroy: (feedbackId) => api.delete(`/talent/feedbacks/${feedbackId}`),
}

export default feedbackService
