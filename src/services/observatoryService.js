import api from './api.js'

export const observatoryService = {
  // Soumission publique du formulaire Africa Talent Observatory
  submit: (payload) => api.post('/public/observatory', payload),

  // Liste des soumissions (back office admin)
  getAll: () => api.get('/admin/observatory-submissions'),
}

export default observatoryService
