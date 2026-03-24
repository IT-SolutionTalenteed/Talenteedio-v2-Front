import api from './api.js'

export const jobContractService = {
  getAll: () => api.get('/admin/job-contracts'),
  create: (data) => api.post('/admin/job-contracts', data),
  update: (id, data) => api.put(`/admin/job-contracts/${id}`, data),
  delete: (id) => api.delete(`/admin/job-contracts/${id}`)
}

export default jobContractService
