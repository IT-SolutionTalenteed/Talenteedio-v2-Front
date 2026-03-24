import api from './api.js'

export const languageService = {
  getAll: () => api.get('/admin/languages'),
  create: (data) => api.post('/admin/languages', data),
  update: (id, data) => api.put(`/admin/languages/${id}`, data),
  delete: (id) => api.delete(`/admin/languages/${id}`)
}

export default languageService