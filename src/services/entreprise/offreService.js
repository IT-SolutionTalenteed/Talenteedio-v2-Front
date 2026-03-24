import api from '../api.js'

export const offreService = {
  getAll: () => api.get('/entreprise/offres'),
  getReferentiels: () => api.get('/entreprise/offres-referentiels'),
  create: (data) => api.post('/entreprise/offres', data),
  update: (id, data) => api.put(`/entreprise/offres/${id}`, data),
  delete: (id) => api.delete(`/entreprise/offres/${id}`),
}

export default offreService
