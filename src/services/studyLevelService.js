import api from './api.js'

export const studyLevelService = {
  getAll: () => api.get('/admin/study-levels'),
  create: (data) => api.post('/admin/study-levels', data),
  update: (id, data) => api.put(`/admin/study-levels/${id}`, data),
  delete: (id) => api.delete(`/admin/study-levels/${id}`)
}

export default studyLevelService