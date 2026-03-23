import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Token ajouté:', token.substring(0, 20) + '...')
    } else {
      console.log('Aucun token trouvé dans localStorage')
    }
    console.log('Requête:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Erreur intercepteur request:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('Erreur API:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      console.log('Token expiré ou invalide, redirection vers login')
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user')
}

export default api