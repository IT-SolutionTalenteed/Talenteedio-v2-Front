import api from './api.js'

export const talentService = {
  getAll: (page = 1) => api.get(`/admin/talents?page=${page}`),
  toggleSuspend: (id) => api.patch(`/admin/talents/${id}/suspend`),
  toggleBan: (id) => api.patch(`/admin/talents/${id}/ban`),
  delete: (id) => api.delete(`/admin/talents/${id}`),
}

export default talentService
