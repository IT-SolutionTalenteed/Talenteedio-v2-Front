import api from './api.js'

export const articleService = {
  getAll: () => api.get('/admin/articles'),

  getById: (id) => api.get(`/admin/articles/${id}`),

  create: (formData) => api.post('/admin/articles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  update: (id, formData) => {
    formData.append('_method', 'PUT')
    return api.post(`/admin/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  delete: (id) => api.delete(`/admin/articles/${id}`)
}

export default articleService
