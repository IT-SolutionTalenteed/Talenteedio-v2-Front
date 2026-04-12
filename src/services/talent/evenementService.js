import api from '../api.js'

export const evenementService = {
  getAll: () => api.get('/talent/evenements'),

  matching: (evenementId, formData) => api.post(`/talent/evenements/${evenementId}/matching`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  matchingOffresGlobal: (formData) => api.post('/talent/matching-offres', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export default evenementService
