<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="/logo.png" alt="Talenteed" />
      </div>

      <template v-if="!sent">
        <h1 class="auth-title">Mot de passe oublié</h1>
        <p class="auth-subtitle">Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

        <form @submit.prevent="submit" class="auth-form">
          <div class="field-group">
            <label class="field-label">Adresse email</label>
            <input
              v-model="email"
              type="email"
              class="field-input"
              placeholder="votre@email.com"
              required
              autocomplete="email"
            />
          </div>

          <div v-if="error" class="auth-error">{{ error }}</div>

          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="btn-loader"></span>
            <span v-else>Envoyer le lien</span>
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
          <h2 class="auth-title">Email envoyé !</h2>
          <p class="auth-subtitle">
            Si un compte est associé à <strong>{{ email }}</strong>, vous allez recevoir un lien de réinitialisation dans quelques minutes.
          </p>
          <p class="auth-subtitle" style="font-size:13px; color:#94a3b8; margin-top:8px;">Pensez à vérifier vos spams.</p>
        </div>
      </template>

      <div class="auth-footer">
        <router-link to="/login" class="auth-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:middle">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Retour à la connexion
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    await api.post('/forgot-password', { email: email.value })
    sent.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.'
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
.field-input {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus {
  border-color: #192bc2;
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
.auth-footer {
  text-align: center;
  margin-top: 24px;
}
.auth-link {
  font-size: 13px;
  color: #192bc2;
  font-weight: 500;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>
