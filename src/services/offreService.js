import api from './api.js'

export const offreService = {
  getAll: (page = 1, perPage = 25, search = '') => api.get(`/admin/offres?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`),
  getById: (id) => api.get(`/admin/offres/${id}`),
  getReferentiels: () => api.get('/admin/offres-referentiels'),
  create: (data) => api.post('/admin/offres', data),
  update: (id, data) => api.put(`/admin/offres/${id}`, data),
  delete: (id) => api.delete(`/admin/offres/${id}`)
}

export default offreService
