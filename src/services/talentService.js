import api from './api.js'

export const talentService = {
  getAll: (page = 1, perPage = 20) => api.get(`/admin/talents?page=${page}&per_page=${perPage}`),
  getOne: (id) => api.get(`/admin/talents/${id}`),
  updateProfil: (id, data) => api.patch(`/admin/talents/${id}/profil`, data),
  toggleSuspend: (id) => api.patch(`/admin/talents/${id}/suspend`),
  toggleBan: (id) => api.patch(`/admin/talents/${id}/ban`),
  updateStatutCrm: (id, statut_crm) => api.patch(`/admin/talents/${id}/statut-crm`, { statut_crm }),
  delete: (id) => api.delete(`/admin/talents/${id}`),
}

export default talentService
