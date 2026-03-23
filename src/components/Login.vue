<template>
  <div>
    <h1>Connexion</h1>
    
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required 
        />
      </div>
      
      <div>
        <label for="password">Mot de passe:</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required 
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
    
    <p>
      Pas de compte ? 
      <router-link to="/register">S'inscrire</router-link>
    </p>
    
    <div v-if="error" style="color: red;">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await authService.login(form.value)
    
    // Stocker le token et les infos utilisateur
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('userRole', response.data.user.role)
    
    // Rediriger selon le rôle
    switch (response.data.user.role) {
      case 'admin':
        router.push('/admin')
        break
      case 'talent':
        router.push('/talent')
        break
      case 'entreprise':
        router.push('/entreprise')
        break
      default:
        error.value = 'Rôle utilisateur non reconnu'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>