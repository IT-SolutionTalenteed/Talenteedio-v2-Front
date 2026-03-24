import api from './api.js'

export const jobModeService = {
  getAll: () => api.get('/admin/job-modes'),
  create: (data) => api.post('/admin/job-modes', data),
  update: (id, data) => api.put(`/admin/job-modes/${id}`, data),
  delete: (id) => api.delete(`/admin/job-modes/${id}`)
}

export default jobModeService
