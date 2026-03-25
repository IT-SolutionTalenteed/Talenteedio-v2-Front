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

      <!-- reCAPTCHA v2 checkbox -->
      <div>
        <VueRecaptcha
          :sitekey="siteKey"
          ref="recaptchaRef"
          @verify="onRecaptchaVerify"
          @expired="onRecaptchaExpired"
          @error="onRecaptchaError"
        />
      </div>

      <button type="submit" :disabled="loading || !recaptchaToken">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p>
      Pas de compte ?
      <router-link to="/register">S'inscrire</router-link>
    </p>

    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'
import { VueRecaptcha } from 'vue-recaptcha'

const router = useRouter()

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const form = ref({ email: '', password: '' })
const loading       = ref(false)
const error         = ref('')
const recaptchaToken = ref('')
const recaptchaRef  = ref(null)

const onRecaptchaVerify  = (token) => { recaptchaToken.value = token }
const onRecaptchaExpired = ()      => { recaptchaToken.value = '' }
const onRecaptchaError   = ()      => { recaptchaToken.value = ''; error.value = 'Erreur reCAPTCHA' }

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

    switch (response.data.user.role) {
      case 'admin':        router.push('/admin');      break
      case 'talent':       router.push('/talent');     break
      case 'entreprise':   router.push('/entreprise'); break
      default: error.value = 'Rôle utilisateur non reconnu'
    }
  } catch (err) {
    error.value = err.response?.data?.message
      || Object.values(err.response?.data?.errors || {}).flat().join(' | ')
      || 'Erreur de connexion'
    recaptchaRef.value?.reset()
    recaptchaToken.value = ''
  } finally {
    loading.value = false
  }
}
</script>
