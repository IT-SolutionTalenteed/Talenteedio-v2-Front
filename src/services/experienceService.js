import api from './api.js'

export const experienceService = {
  getAll: () => api.get('/admin/experiences'),
  create: (data) => api.post('/admin/experiences', data),
  update: (id, data) => api.put(`/admin/experiences/${id}`, data),
  delete: (id) => api.delete(`/admin/experiences/${id}`)
}

export default experienceService