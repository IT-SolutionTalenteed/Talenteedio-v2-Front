import api from './api.js'

export const evenementService = {
  getAll: (page = 1) => api.get(`/admin/evenements?page=${page}`),
  getById: (id) => api.get(`/admin/evenements/${id}`),
  getReferentiels: () => api.get('/admin/evenements-referentiels'),
  create: (formData) => api.post('/admin/evenements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => {
    formData.append('_method', 'PUT')
    return api.post(`/admin/evenements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => api.delete(`/admin/evenements/${id}`),
  toggleFeatured: (id) => api.patch(`/admin/evenements/${id}/toggle-featured`)
}

export default evenementService
