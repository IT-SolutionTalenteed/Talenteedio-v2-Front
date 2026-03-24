import api from './api.js'

export const activitySectorService = {
  getAll: () => api.get('/admin/activity-sectors'),
  create: (data) => api.post('/admin/activity-sectors', data),
  update: (id, data) => api.put(`/admin/activity-sectors/${id}`, data),
  delete: (id) => api.delete(`/admin/activity-sectors/${id}`)
}

export default activitySectorService