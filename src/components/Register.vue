<template>
  <div>
    <h1>Inscription</h1>
    
    <form @submit.prevent="handleRegister">
      <div>
        <label for="name">Nom:</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required 
        />
      </div>
      
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
      
      <div>
        <label for="password_confirmation">Confirmer le mot de passe:</label>
        <input 
          type="password" 
          id="password_confirmation" 
          v-model="form.password_confirmation" 
          required 
        />
      </div>
      
      <div>
        <label for="role">Rôle:</label>
        <select id="role" v-model="form.role" required>
          <option value="">Sélectionner un rôle</option>
          <option value="talent">Talent</option>
          <option value="entreprise">Entreprise</option>
        </select>
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Inscription...' : 'S\'inscrire' }}
      </button>
    </form>
    
    <p>
      Déjà un compte ? 
      <router-link to="/login">Se connecter</router-link>
    </p>
    
    <div v-if="error" style="color: red;">
      {{ error }}
    </div>
    
    <div v-if="success" style="color: green;">
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const response = await authService.register(form.value)
    
    success.value = 'Inscription réussie ! Redirection vers la connexion...'
    
    // Rediriger vers la page de connexion après 2 secondes
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    if (err.response?.data?.errors) {
      // Afficher les erreurs de validation
      const errors = Object.values(err.response.data.errors).flat()
      error.value = errors.join(', ')
    } else {
      error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
    }
  } finally {
    loading.value = false
  }
}
</script>