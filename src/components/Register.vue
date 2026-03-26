<template>
  <div>
    <h1>Souscription</h1>
    
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

      <!-- Consent Checkbox (obligatoire pour les talents) -->
      <div v-if="form.role === 'talent'" class="checkbox-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            id="consent"
            v-model="form.consent"
            class="checkbox-input"
          />
          <span class="checkbox-text">
            J'accepte les 
            <router-link to="/terms-and-conditions" target="_blank">conditions générales</router-link>
            et la 
            <router-link to="/privacy-policy" target="_blank">politique de confidentialité</router-link>
          </span>
        </label>
      </div>
      
      <button type="submit" :disabled="isSubmitDisabled">
        {{ loading ? 'Souscription...' : 'Souscrire' }}
      </button>
    </form>
    
    <hr />
    <button type="button" @click="loginWithGoogle">Souscrire / Se connecter avec Google</button>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

const router  = useRouter()
const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'
const loginWithGoogle = () => { window.location.href = `${apiBase}/api/auth/google/redirect` }

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  consent: false
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const isSubmitDisabled = computed(() => {
  return loading.value || (form.value.role === 'talent' && !form.value.consent)
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const response = await authService.register(form.value)
    
    success.value = 'Souscription réussie ! Redirection vers la connexion...'
    
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
      error.value = err.response?.data?.message || 'Erreur lors de la souscription'
    }
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.checkbox-group {
  margin: 20px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.checkbox-input {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.checkbox-text a {
  color: #040a5d;
  text-decoration: underline;
  font-weight: 600;
}

.checkbox-text a:hover {
  color: #192bc2;
}

.consent-error {
  margin-top: 8px;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
