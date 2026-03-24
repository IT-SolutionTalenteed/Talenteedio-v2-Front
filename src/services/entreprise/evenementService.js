import api from '../api.js'

export const evenementService = {
  getAll: () => api.get('/entreprise/evenements'),
  mesDemandes: () => api.get('/entreprise/mes-demandes'),
  demandeParticipation: (evenementId, data) => api.post(`/entreprise/evenements/${evenementId}/demande`, data),
}

export default evenementService
