<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="/logo.png" alt="Talenteed" />
      </div>

      <template v-if="!deleted">
        <div class="danger-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Action irréversible
        </div>

        <h1 class="auth-title">Supprimer mon compte</h1>
        <p class="auth-subtitle">
          Toutes vos données (candidatures, entretiens, matchings, favoris) seront définitivement supprimées et ne pourront pas être récupérées.
        </p>

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

          <div class="field-group">
            <label class="field-label">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              class="field-input"
              placeholder="Votre mot de passe actuel"
              required
              autocomplete="current-password"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Confirmer le mot de passe</label>
            <input
              v-model="passwordConfirm"
              type="password"
              class="field-input"
              :class="{ 'field-input--error': passwordMismatch }"
              placeholder="Répétez votre mot de passe"
              required
              autocomplete="current-password"
            />
            <span v-if="passwordMismatch" class="field-hint-error">Les mots de passe ne correspondent pas.</span>
          </div>

          <div v-if="error" class="auth-error">{{ error }}</div>

          <button type="submit" class="btn-danger" :disabled="loading || passwordMismatch || !email || !password">
            <span v-if="loading" class="btn-loader"></span>
            <span v-else>Supprimer définitivement mon compte</span>
          </button>
        </form>

        <div class="auth-footer">
          <router-link to="/login" class="auth-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:middle">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Annuler et revenir à la connexion
          </router-link>
        </div>
      </template>

      <template v-else>
        <div class="auth-success">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="auth-title">Compte supprimé</h2>
          <p class="auth-subtitle">Votre compte et toutes vos données ont été supprimés définitivement. Nous espérons vous revoir.</p>
          <router-link to="/home" class="btn-primary" style="display:flex;text-decoration:none;margin-top:8px;">Retour à l'accueil</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../services/api.js'

const email           = ref('')
const password        = ref('')
const passwordConfirm = ref('')
const loading         = ref(false)
const error           = ref('')
const deleted         = ref(false)

const passwordMismatch = computed(() =>
  passwordConfirm.value.length > 0 && password.value !== passwordConfirm.value
)

async function submit() {
  if (passwordMismatch.value) return
  error.value   = ''
  loading.value = true

  try {
    const loginRes = await api.post('/login', { email: email.value, password: password.value })
    const token = loginRes.data.token

    await api.delete('/talent/account', {
      data: { password: password.value },
      headers: { Authorization: `Bearer ${token}` },
    })

    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')

    deleted.value = true
  } catch (e) {
    if (e.response?.status === 422) {
      error.value = 'Mot de passe incorrect.'
    } else if (e.response?.status === 401) {
      error.value = 'Email ou mot de passe incorrect.'
    } else if (e.response?.status === 403) {
      error.value = 'Ce compte ne peut pas être supprimé via cette page.'
    } else {
      error.value = 'Une erreur est survenue. Veuillez réessayer.'
    }
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
.danger-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
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
.field-input--error {
  border-color: #fca5a5;
}
.field-input--error:focus {
  border-color: #dc2626;
}
.field-hint-error {
  font-size: 12px;
  color: #dc2626;
}
.auth-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
}
.btn-danger {
  background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
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
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
