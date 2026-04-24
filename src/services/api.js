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
    }
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
    return response
  },
  (error) => {
    console.error('Erreur API:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      const current = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(current)}`
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

export const atsService = {
  register: (formData) => api.post('/public/ats/register', formData),
  setPassword: (data) => api.post('/public/ats/set-password', data)
}

export default api