import api from '../api.js'

export const brevoService = {
  getStatus: ()   => api.get('/admin/brevo/status'),
  sync: (items)   => api.post('/admin/brevo/sync', { items }, { timeout: 120000 }),
  syncAll: ()     => api.post('/admin/brevo/sync-all', {}, { timeout: 300000 }),
  setup: ()       => api.post('/admin/brevo/setup', {}, { timeout: 60000 }),
}

export default brevoService
