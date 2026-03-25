import api from './api.js'

export const categorieEvenementService = {
  getAll: () => api.get('/admin/categorie-evenements'),
  getById: (id) => api.get(`/admin/categorie-evenements/${id}`),
  create: (formData) => api.post('/admin/categorie-evenements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => {
    formData.append('_method', 'PUT')
    return api.post(`/admin/categorie-evenements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => api.delete(`/admin/categorie-evenements/${id}`),
  removeGalerieItem: (id, path) => api.delete(`/admin/categorie-evenements/${id}/galerie`, { data: { path } }),

  // Témoignages
  attachTemoignage: (categorieId, temoignageId) =>
    api.post(`/admin/categorie-evenements/${categorieId}/temoignages`, { temoignage_id: temoignageId }),
  detachTemoignage: (categorieId, temoignageId) =>
    api.delete(`/admin/categorie-evenements/${categorieId}/temoignages/${temoignageId}`),
}

export default categorieEvenementService
