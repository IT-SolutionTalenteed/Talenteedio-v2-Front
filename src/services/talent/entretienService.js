import api from '../api.js'

export const entretienService = {
  getCreneaux: (evenementId, entrepriseId) =>
    api.get(`/talent/evenements/${evenementId}/creneaux`, { params: { entreprise_id: entrepriseId } }),
  reserver: (evenementId, data) => api.post(`/talent/evenements/${evenementId}/reserver`, data),
  mesEntretiens: () => api.get('/talent/mes-entretiens'),
  annuler: (id) => api.patch(`/talent/entretiens/${id}/annuler`),
}

export default entretienService
