<template>
  <div class="callback-container">
    <div class="callback-card">
      <div v-if="loading" class="callback-loading">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <p>{{ message }}</p>
      </div>
      <div v-else-if="error" class="callback-error">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>{{ error }}</p>
        <p class="redirect-info">Redirection dans {{ countdown }}s...</p>
      </div>
      <div v-else class="callback-success">
        <i class="fa-solid fa-circle-check"></i>
        <p>Connexion réussie !</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()
const error  = ref('')
const loading = ref(true)
const message = ref('Authentification avec Google en cours...')
const countdown = ref(3)

onMounted(() => {
  const token = route.query.token
  const role  = route.query.role
  const err   = route.query.error
  const type  = route.query.type // 'register' ou 'login'

  if (err) {
    loading.value = false
    error.value = decodeURIComponent(err)
    startCountdown(type === 'register' ? '/profile-selection' : '/login')
    return
  }

  if (!token || !role) {
    loading.value = false
    error.value = 'Données d\'authentification manquantes. Veuillez réessayer.'
    startCountdown('/login')
    return
  }

  // Stockage des informations utilisateur
  localStorage.setItem('token', token)
  localStorage.setItem('userRole', role)
  if (route.query.user_id) localStorage.setItem('userId', route.query.user_id)
  if (route.query.user_name) localStorage.setItem('userName', decodeURIComponent(route.query.user_name))

  loading.value = false

  // Redirection selon le rôle
  setTimeout(() => {
    switch (role) {
      case 'admin':      router.push('/admin');      break
      case 'talent':     router.push('/talent');     break
      case 'entreprise': router.push('/entreprise'); break
      default:
        error.value = 'Rôle utilisateur non reconnu'
        startCountdown('/login')
    }
  }, 1000)
})

const startCountdown = (redirectPath) => {
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      router.push(redirectPath)
    }
  }, 1000)
}
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #041a57 0%, #00235a 50%, #0a3472 100%);
  font-family: 'Open Sans', sans-serif;
}

.callback-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 48px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.callback-loading,
.callback-error,
.callback-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.callback-loading i {
  font-size: 48px;
  color: #3a9bff;
}

.callback-error i {
  font-size: 48px;
  color: #dc2626;
}

.callback-success i {
  font-size: 48px;
  color: #16a34a;
}

.callback-card p {
  margin: 0;
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
}

.redirect-info {
  font-size: 14px;
  color: #6b7280;
  margin-top: 8px;
}
</style>
