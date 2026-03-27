import api from '../api.js'

export const candidatureService = {
  getAll: (params = {}) => api.get('/admin/candidatures', { params }),
  updateStatut: (id, statut) => api.patch(`/admin/candidatures/${id}/statut`, { statut }),
  destroy: (id) => api.delete(`/admin/candidatures/${id}`),
}

export default candidatureService
