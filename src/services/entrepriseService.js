import api from './api.js'

export const entrepriseService = {
  getAll: () => api.get('/admin/entreprises'),
  getById: (id) => api.get(`/admin/entreprises/${id}`),
  getReferentiels: () => api.get('/admin/entreprises-referentiels'),
  create: (formData) => api.post('/admin/entreprises', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/admin/entreprises/${id}`, data),
  updateFormData: (id, formData) => api.post(`/admin/entreprises/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/entreprises/${id}`),
}

export default entrepriseService
