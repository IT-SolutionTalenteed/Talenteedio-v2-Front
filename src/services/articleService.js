import api from './api.js'

export const articleService = {
  // Récupérer tous les articles
  getAll: () => api.get('/admin/articles'),
  
  // Récupérer un article par ID
  getById: (id) => api.get(`/admin/articles/${id}`),
  
  // Créer un nouvel article
  create: (data) => api.post('/admin/articles', data),
  
  // Mettre à jour un article
  update: (id, data) => api.put(`/admin/articles/${id}`, data),
  
  // Supprimer un article
  delete: (id) => api.delete(`/admin/articles/${id}`)
}

export default articleService