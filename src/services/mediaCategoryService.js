import api from './api.js'

export const mediaCategoryService = {
  // Récupérer toutes les catégories média
  getAll: () => api.get('/admin/media-categories'),
  
  // Récupérer une catégorie par ID
  getById: (id) => api.get(`/admin/media-categories/${id}`),
  
  // Créer une nouvelle catégorie
  create: (data) => api.post('/admin/media-categories', data),
  
  // Mettre à jour une catégorie
  update: (id, data) => api.put(`/admin/media-categories/${id}`, data),
  
  // Supprimer une catégorie
  delete: (id) => api.delete(`/admin/media-categories/${id}`)
}

export default mediaCategoryService