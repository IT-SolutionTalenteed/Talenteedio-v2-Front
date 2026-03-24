import api from '../api.js'

export const articleService = {
  getAll: () => api.get('/entreprise/articles'),
  getReferentiels: () => api.get('/entreprise/articles-referentiels'),
  create: (formData) => api.post('/entreprise/articles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.post(`/entreprise/articles/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/entreprise/articles/${id}`),
}

export default articleService
