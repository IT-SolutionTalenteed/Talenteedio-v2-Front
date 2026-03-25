import api from './api.js'

export const temoignageService = {
  getAll: () => api.get('/admin/temoignages'),
  create: (formData) => api.post('/admin/temoignages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.post(`/admin/temoignages/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/temoignages/${id}`),
}

export default temoignageService
