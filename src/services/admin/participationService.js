import api from '../api.js'

export const participationService = {
  getAll: (params = {}) => api.get('/admin/evenement-demandes', { params }),
  updateStatut: (id, statut) => api.patch(`/admin/evenement-demandes/${id}/statut`, { statut }),
}

export default participationService
