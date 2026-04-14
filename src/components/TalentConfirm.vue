<template>
  <div>
    <!-- Mini Hero -->
    <div class="confirm-hero">
      <div class="container">
        <div class="confirm-hero-inner">
          <span class="confirm-event-label">
            <i class="fa-solid fa-calendar-days"></i>&nbsp;
            Africa Talent Summit — 5 &amp; 6 Novembre 2026
          </span>
          <p class="confirm-hero-title">
            Construisez la carrière qui façonnera l'Afrique de demain
          </p>
        </div>
      </div>
    </div>

    <!-- Confirmation Section -->
    <section class="confirm-section">
      <div class="container">
        <div class="confirm-card">
          <div class="confirm-icon">
            <i class="fa-solid fa-party-horn"></i>
          </div>

          <h1 class="confirm-title">Merci pour votre inscription !</h1>
          <p class="confirm-subtitle">
            Votre profil a bien été enregistré. Créez votre mot de passe pour accéder à votre espace personnel et finaliser votre candidature.
          </p>

          <hr class="confirm-divider">

          <div class="confirm-note">
            <i class="fa-solid fa-circle-info"></i>
            <span>
              Un e-mail de confirmation vous sera envoyé une fois votre compte créé. Pensez à compléter votre <strong>Matching IA</strong> pour maximiser vos chances d'obtenir des rendez-vous avec les entreprises participantes.
            </span>
          </div>

          <div class="confirm-section-label">
            <i class="fa-solid fa-lock"></i>
            Choisissez votre mot de passe
          </div>

          <form @submit.prevent="handleCreate" novalidate>
            <div class="form-group">
              <label class="form-label">Mot de passe <span class="required">*</span></label>
              <div style="position:relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-input"
                  placeholder="Minimum 8 caractères" 
                  required 
                  minlength="8"
                  style="padding-right:44px"
                  @input="checkPasswordStrength"
                >
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:var(--body-text);font-size:15px"
                  aria-label="Afficher/masquer"
                >
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmer le mot de passe <span class="required">*</span></label>
              <div style="position:relative">
                <input 
                  v-model="passwordConfirmation" 
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  class="form-input" 
                  placeholder="Retapez votre mot de passe" 
                  required
                  style="padding-right:44px"
                >
                <button 
                  type="button" 
                  @click="showPasswordConfirm = !showPasswordConfirm"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:var(--body-text);font-size:15px"
                  aria-label="Afficher/masquer"
                >
                  <i :class="showPasswordConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="password" id="pw-strength" style="margin:-8px 0 20px">
              <div style="height:4px;border-radius:2px;background:var(--border);overflow:hidden">
                <div 
                  id="pw-bar" 
                  :style="{
                    height: '100%',
                    width: strengthLevel.width,
                    background: strengthLevel.color,
                    borderRadius: '2px',
                    transition: 'width .3s, background .3s'
                  }"
                ></div>
              </div>
              <p :style="{ fontSize: '12px', color: strengthLevel.color, margin: '4px 0 0' }">
                {{ strengthLevel.text }}
              </p>
            </div>

            <div v-if="error" class="form-error visible">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>{{ error }}</span>
            </div>
            <div v-if="success" class="form-success visible">
              <i class="fa-solid fa-check-circle"></i>
              Compte créé avec succès ! Connexion en cours…
            </div>

            <button type="submit" class="btn btn--blue btn--lg btn--block" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <template v-else>
                <i class="fa-solid fa-user-check"></i>
                Créer le compte
              </template>
            </button>

            <p class="form-note">
              En créant un compte, vous acceptez nos
              <router-link to="/legal/terms-and-conditions">conditions d'utilisation</router-link> et notre
              <router-link to="/legal/privacy-policy">politique de confidentialité</router-link>.
            </p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const route = useRoute()

const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const strengthLevel = computed(() => {
  const val = password.value
  if (!val) return { width: '0%', color: '#ef4444', text: '' }

  let score = 0
  if (val.length >= 8)  score++
  if (val.length >= 12) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++

  const levels = [
    { width: '20%',  color: '#ef4444', text: 'Très faible' },
    { width: '40%',  color: '#f97316', text: 'Faible' },
    { width: '60%',  color: '#eab308', text: 'Moyen' },
    { width: '80%',  color: '#22c55e', text: 'Fort' },
    { width: '100%', color: '#16a34a', text: 'Très fort' },
  ]

  return levels[Math.min(score - 1, 4)] || levels[0]
})

const checkPasswordStrength = () => {
  // Trigger reactivity for strength indicator
}

const handleCreate = async () => {
  error.value = ''
  success.value = false

  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  try {
    const email = route.query.email
    
    await api.post('/public/ats/set-password', {
      email: email,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    success.value = true
    
    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } catch (err) {
    console.error('Erreur création mot de passe:', err)
    error.value = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Variables */
:root {
  --navy: #041a57;
  --blue: #3a9bff;
  --orange: #f07c00;
  --light-bg: #f5f7fa;
  --body-text: #6b7280;
  --border: #e0e4ef;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Mini Hero */
.confirm-hero {
  background: linear-gradient(160deg, #020830 0%, #040a5d 60%, #0d1a8a 100%);
  color: #fff;
  padding: 32px 0;
  text-align: center;
}

.confirm-hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.confirm-event-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #f07c00;
}

.confirm-hero-title {
  font-size: clamp(16px, 2.5vw, 22px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: .9;
  margin: 0;
}

/* Main Section */
.confirm-section {
  padding: 60px 0 100px;
  background: var(--light-bg);
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.confirm-card {
  background: #fff;
  border-radius: 20px;
  padding: 52px 48px;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}

.confirm-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(240,124,0,.15), rgba(240,124,0,.05));
  border: 2px solid rgba(240,124,0,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: #f07c00;
}

.confirm-title {
  font-size: 26px;
  font-weight: 900;
  color: var(--navy);
  text-align: center;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.confirm-subtitle {
  font-size: 15px;
  color: var(--body-text);
  text-align: center;
  line-height: 1.6;
  margin: 0 0 36px;
}

.confirm-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 0 0 32px;
}

.confirm-section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--body-text);
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.confirm-note {
  background: rgba(25,43,194,.05);
  border: 1px solid rgba(25,43,194,.15);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 24px;
  display: flex;
  gap: 10px;
}

.confirm-note i {
  color: var(--blue);
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Form Elements */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 7px;
}

.required {
  color: #ef4444;
}

.form-input {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 14px;
  color: var(--navy);
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.form-input::placeholder {
  color: #c0c5d0;
}

.form-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(58, 155, 255, 0.12);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  justify-content: center;
}

.btn--blue {
  background: linear-gradient(135deg, #041a57 0%, #00235a 100%);
  color: #fff;
}

.btn--blue:hover:not(:disabled) {
  background: linear-gradient(135deg, #0a3472 0%, #1a4a8a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(4, 26, 87, 0.3);
}

.btn--lg {
  padding: 14px 28px;
  font-size: 15px;
}

.btn--block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Messages */
.form-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #dc2626;
  margin-bottom: 16px;
  display: none;
  align-items: center;
  gap: 8px;
}

.form-error.visible {
  display: flex;
}

.form-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #16a34a;
  margin-bottom: 16px;
  display: none;
  align-items: center;
  gap: 8px;
}

.form-success.visible {
  display: flex;
}

.form-note {
  text-align: center;
  font-size: 12px;
  color: var(--body-text);
  margin-top: 14px;
}

.form-note a {
  color: var(--navy);
  text-decoration: underline;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 600px) {
  .confirm-card {
    padding: 32px 20px;
    border-radius: 0;
    box-shadow: none;
  }
  .confirm-section {
    padding: 0 0 80px;
  }
}
</style>
