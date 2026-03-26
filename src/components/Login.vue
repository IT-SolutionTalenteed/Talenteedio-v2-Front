<template>
  <div>
    <h1>Connexion</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>

      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>

      <!-- reCAPTCHA v2 checkbox — rendu par window.grecaptcha.render() -->
      <div ref="recaptchaContainer"></div>

      <button type="submit" :disabled="loading || !recaptchaToken">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <hr />
    <button type="button" @click="loginWithGoogle">Se connecter avec Google</button>

    <p>
      Pas de compte ?
      <router-link to="/register">Souscrire</router-link>
    </p>

    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/api.js'

const router = useRouter()
const route  = useRoute()

const form             = ref({ email: '', password: '' })
const loading          = ref(false)
const error            = ref('')
const recaptchaToken   = ref('')
const recaptchaContainer = ref(null)
const widgetId         = ref(null)

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

const loginWithGoogle = () => { window.location.href = `${apiBase}/api/auth/google/redirect` }

// Rend le widget reCAPTCHA v2 une fois le DOM + script chargés
const renderRecaptcha = () => {
  if (!recaptchaContainer.value || !window.grecaptcha) return
  widgetId.value = window.grecaptcha.render(recaptchaContainer.value, {
    sitekey:          siteKey,
    callback:         (token) => { recaptchaToken.value = token },
    'expired-callback': () => { recaptchaToken.value = '' },
    'error-callback':   () => { recaptchaToken.value = ''; error.value = 'Erreur reCAPTCHA' },
  })
}

onMounted(() => {
  // Le script Google peut être déjà chargé ou en cours de chargement
  if (window.grecaptcha && window.grecaptcha.render) {
    renderRecaptcha()
  } else {
    // Attendre que le script soit prêt via le callback global
    window.onRecaptchaLoad = renderRecaptcha
    // Ajouter onload au script si pas encore fait
    const scripts = document.querySelectorAll('script[src*="recaptcha"]')
    if (scripts.length === 0) {
      const s = document.createElement('script')
      s.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
      s.async = true
      document.head.appendChild(s)
    } else {
      // Script présent mais pas encore prêt — poll
      const interval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(interval)
          renderRecaptcha()
        }
      }, 100)
    }
  }
})

const handleLogin = async () => {
  if (!recaptchaToken.value) {
    error.value = 'Veuillez valider le reCAPTCHA'
    return
  }

  loading.value = true
  error.value   = ''

  try {
    const response = await authService.login({
      ...form.value,
      recaptcha_token: recaptchaToken.value,
    })

    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('userRole', response.data.user.role)
    localStorage.setItem('userId', response.data.user.id)

    const redirect = route.query.redirect
    if (redirect) {
      router.push(decodeURIComponent(redirect))
    } else {
      switch (response.data.user.role) {
        case 'admin':      router.push('/admin');      break
        case 'talent':     router.push('/talent');     break
        case 'entreprise': router.push('/entreprise'); break
        default: error.value = 'Rôle utilisateur non reconnu'
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message
      || Object.values(err.response?.data?.errors || {}).flat().join(' | ')
      || 'Erreur de connexion'
    // Réinitialiser le widget
    if (widgetId.value !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.value)
    }
    recaptchaToken.value = ''
  } finally {
    loading.value = false
  }
}
</script>
