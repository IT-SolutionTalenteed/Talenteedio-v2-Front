import api from './api.js'

export default {
  getAll() {
    return api.get('/admin/plans')
  },
  
  getById(id) {
    return api.get(`/admin/plans/${id}`)
  },
  
  create(data) {
    return api.post('/admin/plans', data)
  },
  
  update(id, data) {
    return api.put(`/admin/plans/${id}`, data)
  },
  
  delete(id) {
    return api.delete(`/admin/plans/${id}`)
  }
}
