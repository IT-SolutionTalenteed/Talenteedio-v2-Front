import api from '../api.js'

export const offreService = {
  getAll: (page = 1) => api.get(`/talent/offres?page=${page}`),
  getById: (id) => api.get(`/talent/offres/${id}`),
  postuler: (offreId, formData) => api.post(`/talent/offres/${offreId}/postuler`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  mesCandidatures: () => api.get('/talent/mes-candidatures'),
  getFavoris: () => api.get('/talent/favoris'),
  toggleFavori: (offreId) => api.post(`/talent/offres/${offreId}/favori`),
}

export default offreService
