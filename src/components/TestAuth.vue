<template>
  <div>
    <h2>Test d'authentification</h2>
    
    <div>
      <h3>Informations stockées</h3>
      <p>Token: {{ token ? token.substring(0, 20) + '...' : 'Aucun' }}</p>
      <p>Rôle: {{ userRole || 'Aucun' }}</p>
    </div>
    
    <div>
      <button @click="testLogin">Test Login</button>
      <button @click="testApiCall">Test API Call</button>
      <button @click="clearStorage">Clear Storage</button>
    </div>
    
    <div v-if="result">
      <h3>Résultat:</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authService } from '../services/api.js'
import mediaCategoryService from '../services/mediaCategoryService.js'

const token = ref('')
const userRole = ref('')
const result = ref('')

const loadStoredData = () => {
  token.value = localStorage.getItem('token') || ''
  userRole.value = localStorage.getItem('userRole') || ''
}

const testLogin = async () => {
  try {
    const response = await authService.login({
      email: 'solofonirina35@gmail.com',
      password: 'STDlux06@'
    })
    result.value = JSON.stringify(response.data, null, 2)
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('userRole', response.data.user.role)
    loadStoredData()
  } catch (error) {
    result.value = 'Erreur login: ' + JSON.stringify(error.response?.data || error.message, null, 2)
  }
}

const testApiCall = async () => {
  try {
    const response = await mediaCategoryService.getAll()
    result.value = 'API Call réussie: ' + JSON.stringify(response.data, null, 2)
  } catch (error) {
    result.value = 'Erreur API: ' + JSON.stringify(error.response?.data || error.message, null, 2)
  }
}

const clearStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  loadStoredData()
  result.value = 'Storage cleared'
}

onMounted(() => {
  loadStoredData()
})
</script>