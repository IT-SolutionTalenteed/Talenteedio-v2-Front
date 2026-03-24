import api from './api.js'

export const skillService = {
  getAll: () => api.get('/admin/skills'),
  create: (data) => api.post('/admin/skills', data),
  update: (id, data) => api.put(`/admin/skills/${id}`, data),
  delete: (id) => api.delete(`/admin/skills/${id}`)
}

export default skillService