import api from './api.js'

const toFormData = (data) => {
  const fd = new FormData()
  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined) continue
    if (Array.isArray(val)) {
      val.forEach(v => fd.append(`${key}[]`, v))
    } else if (typeof val === 'boolean') {
      fd.append(key, val ? '1' : '0')
    } else {
      fd.append(key, val)
    }
  }
  return fd
}

export const offreService = {
  getAll: (page = 1, perPage = 25, search = '') => api.get(`/admin/offres?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`),
  getById: (id) => api.get(`/admin/offres/${id}`),
  getReferentiels: () => api.get('/admin/offres-referentiels'),
  create: (data) => api.post('/admin/offres', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => {
    const fd = toFormData(data)
    fd.append('_method', 'PUT')
    return api.post(`/admin/offres/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  delete: (id) => api.delete(`/admin/offres/${id}`)
}

export default offreService
