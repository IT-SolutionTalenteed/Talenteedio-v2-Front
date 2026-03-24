import api from './api.js'

export const legalPageService = {
  getAll: () => api.get('/legal-pages'),
  create: (data) => api.post('/admin/legal-pages', data),
  update: (id, data) => api.put(`/admin/legal-pages/${id}`, data),
  delete: (id) => api.delete(`/admin/legal-pages/${id}`)
}

export default legalPageService
