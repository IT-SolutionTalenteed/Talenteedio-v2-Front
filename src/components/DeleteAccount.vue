<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="/logo.png" alt="Talenteed" />
      </div>

      <template v-if="!deleted">
        <h1 class="auth-title">Supprimer mon compte</h1>
        <p class="auth-subtitle">
          Cette action est <strong>irréversible</strong>. Toutes vos données (candidatures, entretiens, matchings, favoris) seront définitivement supprimées.
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

          <div v-if="error" class="auth-error">{{ error }}</div>

          <button type="submit" class="btn-danger" :disabled="loading">
            <span v-if="loading" class="btn-loader"></span>
            <span v-else>Supprimer définitivement mon compte</span>
          </button>
        </form>

        <p class="auth-footer">
          <a href="/login">Annuler et revenir à la connexion</a>
        </p>
      </template>

      <template v-else>
        <div class="auth-success-icon">✓</div>
        <h1 class="auth-title">Compte supprimé</h1>
        <p class="auth-subtitle">Votre compte et toutes vos données ont été supprimés. Nous espérons vous revoir.</p>
        <a href="/home" class="btn-primary" style="display:block;text-align:center;text-decoration:none;">Retour à l'accueil</a>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

const email    = ref('')
const password = ref('')
const loading  = ref(false)
const error    = ref('')
const deleted  = ref(false)

async function submit() {
  error.value   = ''
  loading.value = true

  try {
    // Connexion pour obtenir un token temporaire
    const loginRes = await api.post('/login', { email: email.value, password: password.value })
    const token = loginRes.data.token

    // Suppression du compte avec le token
    await api.delete('/talent/account', {
      data: { password: password.value },
      headers: { Authorization: `Bearer ${token}` },
    })

    // Nettoyage local
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')

    deleted.value = true
  } catch (e) {
    if (e.response?.status === 422) {
      error.value = 'Mot de passe incorrect.'
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
.btn-danger {
  width: 100%;
  padding: 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-success-icon {
  width: 56px;
  height: 56px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 16px;
}
</style>
