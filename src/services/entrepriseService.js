import api from './api.js'

export const entrepriseService = {
  getAll: () => api.get('/admin/entreprises'),
  getById: (id) => api.get(`/admin/entreprises/${id}`),
  create: (data) => api.post('/admin/entreprises', data),
  update: (id, data) => api.put(`/admin/entreprises/${id}`, data),
  delete: (id) => api.delete(`/admin/entreprises/${id}`),
}

export default entrepriseService
