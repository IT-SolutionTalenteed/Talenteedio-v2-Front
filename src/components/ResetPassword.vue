<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="/logo.png" alt="Talenteed" />
      </div>

      <template v-if="!done">
        <h1 class="auth-title">Nouveau mot de passe</h1>
        <p class="auth-subtitle">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>

        <form @submit.prevent="submit" class="auth-form">
          <div class="field-group">
            <label class="field-label">Nouveau mot de passe</label>
            <div class="input-wrap">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="8 caractères minimum"
                required
                minlength="8"
              />
              <button type="button" class="toggle-eye" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Confirmer le mot de passe</label>
            <div class="input-wrap">
              <input
                v-model="passwordConfirmation"
                :type="showConfirm ? 'text' : 'password'"
                class="field-input"
                placeholder="Répétez le mot de passe"
                required
              />
              <button type="button" class="toggle-eye" @click="showConfirm = !showConfirm">
                <svg v-if="!showConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="auth-error">{{ error }}</div>

          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="btn-loader"></span>
            <span v-else>Réinitialiser le mot de passe</span>
          </button>
        </form>
      </template>

      <template v-else>
        <div class="auth-success">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="auth-title">Mot de passe réinitialisé !</h2>
          <p class="auth-subtitle">Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.</p>
          <router-link to="/login" class="btn-primary" style="margin-top:20px; text-decoration:none; display:block; text-align:center;">
            Se connecter
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api.js'

const route = useRoute()

const token = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')
const done = ref(false)

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
})

const submit = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await api.post('/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    done.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Lien invalide ou expiré.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  padding: 24px 16px;
}
.auth-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(4,10,93,0.10);
  padding: 48px 40px;
  width: 100%;
  max-width: 440px;
}
.auth-logo {
  text-align: center;
  margin-bottom: 28px;
}
.auth-logo img {
  height: 40px;
}
.auth-title {
  font-size: 22px;
  font-weight: 700;
  color: #040a5d;
  text-align: center;
  margin-bottom: 8px;
}
.auth-subtitle {
  font-size: 14px;
  color: #64748b;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-input {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 40px 10px 14px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.field-input:focus {
  border-color: #192bc2;
}
.toggle-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  display: flex;
  align-items: center;
}
.auth-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
}
.btn-primary {
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
.auth-success {
  text-align: center;
  padding: 12px 0;
}
.success-icon {
  width: 64px;
  height: 64px;
  background: rgba(34,197,94,0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
</style>
