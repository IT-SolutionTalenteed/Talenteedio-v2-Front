import api from '../api.js'

export const candidatureService = {
  getAll: (offreId = null) => api.get('/entreprise/candidatures', { params: offreId ? { offre_id: offreId } : {} }),
  updateStatut: (id, statut) => api.patch(`/entreprise/candidatures/${id}/statut`, { statut }),
}

export default candidatureService
