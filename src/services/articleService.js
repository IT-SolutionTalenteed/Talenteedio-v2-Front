import api from './api.js'

export const articleService = {
  getAll: (page = 1, archived = false) => api.get(`/admin/articles?page=${page}&archived=${archived}`),

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

  delete: (id) => api.delete(`/admin/articles/${id}`),

  archive: (id) => api.post(`/admin/articles/${id}/archive`),

  unarchive: (id) => api.post(`/admin/articles/${id}/unarchive`)
}

export default articleService
