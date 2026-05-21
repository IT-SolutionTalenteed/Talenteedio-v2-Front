import api from './api.js'

export const talentService = {
  getAll: (page = 1, perPage = 25, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      search: search,
      sort_by: sortBy,
      sort_order: sortOrder
    })
    return api.get(`/admin/talents?${params.toString()}`)
  },
  getOne: (id) => api.get(`/admin/talents/${id}`),
  updateProfil: (id, data) => api.patch(`/admin/talents/${id}/profil`, data),
  toggleSuspend: (id) => api.patch(`/admin/talents/${id}/suspend`),
  toggleBan: (id) => api.patch(`/admin/talents/${id}/ban`),
  updateStatutCrm: (id, statut_crm) => api.patch(`/admin/talents/${id}/statut-crm`, { statut_crm }),
  delete: (id) => api.delete(`/admin/talents/${id}`),
}

export default talentService
