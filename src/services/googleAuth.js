/**
 * Service d'authentification Google
 * Gère l'inscription et la connexion via Google OAuth
 */

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

export const googleAuthService = {
  /**
   * Redirige vers Google pour l'inscription
   */
  registerWithGoogle() {
    window.location.href = `${API_BASE}/api/auth/google/redirect?type=register`
  },

  /**
   * Redirige vers Google pour la connexion
   */
  loginWithGoogle() {
    window.location.href = `${API_BASE}/api/auth/google/redirect?type=login`
  },

  /**
   * Gère le callback après authentification Google
   * @param {string} code - Code d'autorisation Google
   * @param {string} type - 'register' ou 'login'
   */
  async handleCallback(code, type) {
    const response = await fetch(`${API_BASE}/api/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ code, type })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de l\'authentification Google')
    }

    return response.json()
  }
}
