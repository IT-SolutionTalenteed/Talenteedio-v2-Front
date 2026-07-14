import api from './api.js'

export const countryService = {
  getAll: () => api.get('/admin/countries'),
  create: (data) => api.post('/admin/countries', data),
  update: (id, data) => api.put(`/admin/countries/${id}`, data),
  delete: (id) => api.delete(`/admin/countries/${id}`)
}

export default countryService
