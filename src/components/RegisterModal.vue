<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <button class="modal-close" @click="$emit('close')" aria-label="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-header">
            <h2>{{ t('auth.register.title') }}</h2>
            <p>{{ t('auth.register.subtitle') }}</p>
          </div>

          <div class="modal-body">
            <!-- Étape 1: Sélection du profil -->
            <div v-if="step === 1">
              <p class="register-info">
                {{ t('auth.register.step1') }}
              </p>

              <div class="profile-selection">
                <button 
                  type="button"
                  class="profile-option"
                  :class="{ 'profile-option--active': selectedProfile === 'talent' }"
                  @click="selectedProfile = 'talent'"
                >
                  <i class="fa-solid fa-user"></i>
                  <span>{{ t('auth.register.talentOption') }}</span>
                </button>
                <button 
                  type="button"
                  class="profile-option"
                  :class="{ 'profile-option--active': selectedProfile === 'entreprise' }"
                  @click="selectedProfile = 'entreprise'"
                >
                  <i class="fa-solid fa-building"></i>
                  <span>{{ t('auth.register.companyOption') }}</span>
                </button>
              </div>

              <div class="register-actions">
                <button 
                  @click="goToStep2"
                  class="btn-submit"
                  :disabled="!selectedProfile"
                >
                  {{ t('auth.register.continue') || 'Continuer' }} <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Étape 2: Formulaire d'inscription -->
            <div v-else-if="step === 2">
              <button class="btn-back" @click="step = 1">
                <i class="fa-solid fa-arrow-left"></i> {{ t('auth.register.back') || 'Retour' }}
              </button>

              <form @submit.prevent="handleRegister" class="register-form">
                <!-- Formulaire Talent -->
                <div v-if="selectedProfile === 'talent'" class="form-fields">
                  <div class="form-group">
                    <label>{{ t('auth.register.firstName') || 'Prénom' }} *</label>
                    <input 
                      v-model="form.prenom" 
                      type="text" 
                      required 
                      :placeholder="t('auth.register.firstNamePlaceholder') || 'Votre prénom'"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.lastName') || 'Nom' }} *</label>
                    <input 
                      v-model="form.nom" 
                      type="text" 
                      required 
                      :placeholder="t('auth.register.lastNamePlaceholder') || 'Votre nom'"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.email') || 'Email' }} *</label>
                    <input 
                      v-model="form.email" 
                      type="email" 
                      required 
                      :placeholder="t('auth.register.emailPlaceholder') || 'votre@email.com'"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.password') || 'Mot de passe' }} *</label>
                    <input 
                      v-model="form.password" 
                      type="password" 
                      required 
                      :placeholder="t('auth.register.passwordPlaceholder') || 'Minimum 8 caractères'"
                      minlength="8"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.confirmPassword') || 'Confirmer le mot de passe' }} *</label>
                    <input 
                      v-model="form.password_confirmation" 
                      type="password" 
                      required 
                      :placeholder="t('auth.register.confirmPasswordPlaceholder') || 'Retapez votre mot de passe'"
                    />
                  </div>
                </div>

                <!-- Formulaire Entreprise -->
                <div v-else-if="selectedProfile === 'entreprise'" class="form-fields">
                  <div class="form-group">
                    <label>{{ t('auth.register.companyName') || 'Nom de l\'entreprise' }} *</label>
                    <input 
                      v-model="form.nom" 
                      type="text" 
                      required 
                      :placeholder="t('auth.register.companyNamePlaceholder') || 'Nom de votre entreprise'"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.email') || 'Email' }} *</label>
                    <input 
                      v-model="form.email" 
                      type="email" 
                      required 
                      :placeholder="t('auth.register.emailPlaceholder') || 'contact@entreprise.com'"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.password') || 'Mot de passe' }} *</label>
                    <input 
                      v-model="form.password" 
                      type="password" 
                      required 
                      :placeholder="t('auth.register.passwordPlaceholder') || 'Minimum 8 caractères'"
                      minlength="8"
                    />
                  </div>

                  <div class="form-group">
                    <label>{{ t('auth.register.confirmPassword') || 'Confirmer le mot de passe' }} *</label>
                    <input 
                      v-model="form.password_confirmation" 
                      type="password" 
                      required 
                      :placeholder="t('auth.register.confirmPasswordPlaceholder') || 'Retapez votre mot de passe'"
                    />
                  </div>
                </div>

                <div v-if="error" class="error-message">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ error }}
                </div>

                <div v-if="success" class="success-message">
                  <i class="fa-solid fa-circle-check"></i>
                  {{ success }}
                </div>

                <button type="submit" class="btn-submit" :disabled="loading">
                  <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
                  <span v-else>{{ t('auth.register.createAccount') || 'Créer mon compte' }}</span>
                </button>
              </form>
            </div>

            <p class="auth-switch">
              {{ t('auth.register.hasAccount') }}
              <a href="#" @click.prevent="$emit('switch-to-login')">{{ t('auth.register.login') }}</a>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const props = defineProps({
  show: Boolean,
  defaultProfile: {
    type: String,
    default: null // 'talent' ou 'entreprise'
  }
})

const emit = defineEmits(['close', 'switch-to-login'])

const { t } = useI18n()
const router = useRouter()

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const step = ref(1)
const selectedProfile = ref(props.defaultProfile || '')
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// Réinitialiser le formulaire quand le modal s'ouvre/ferme
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Si un profil par défaut est fourni, aller directement à l'étape 2
    if (props.defaultProfile) {
      selectedProfile.value = props.defaultProfile
      step.value = 2
    } else {
      step.value = 1
      selectedProfile.value = ''
    }
    // Réinitialiser le formulaire
    form.value = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
    error.value = ''
    success.value = ''
    loading.value = false
  }
})

const goToStep2 = () => {
  if (selectedProfile.value) {
    step.value = 2
  }
}

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  // Validation
  if (form.value.password !== form.value.password_confirmation) {
    error.value = t('auth.register.passwordMismatch') || 'Les mots de passe ne correspondent pas'
    return
  }

  if (form.value.password.length < 8) {
    error.value = t('auth.register.passwordTooShort') || 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  loading.value = true

  try {
    const endpoint = selectedProfile.value === 'talent' 
      ? `${apiBase}/register/talent`
      : `${apiBase}/register/entreprise`

    const payload = {
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    }

    if (selectedProfile.value === 'talent') {
      payload.nom = form.value.nom
      payload.prenom = form.value.prenom
    } else {
      payload.nom = form.value.nom
    }

    const response = await axios.post(endpoint, payload)

    // Stocker le token et les infos utilisateur
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userRole', selectedProfile.value)
      localStorage.setItem('userId', response.data.user?.id || '')
      
      success.value = t('auth.register.success') || 'Inscription réussie ! Redirection...'
      
      // Rediriger après un court délai
      setTimeout(() => {
        emit('close')
        // Recharger la page pour mettre à jour l'état d'authentification
        window.location.reload()
      }, 1500)
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      // Erreurs de validation Laravel
      const errors = err.response.data.errors
      const firstError = Object.values(errors)[0]
      error.value = Array.isArray(firstError) ? firstError[0] : firstError
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = t('auth.register.error') || 'Une erreur est survenue lors de l\'inscription'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f0f2f8;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  z-index: 1;
}

.modal-close:hover {
  background: #e0e4ef;
  color: #00235a;
}

.modal-header {
  padding: 40px 40px 24px;
  text-align: center;
}

.modal-header h2 {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #041a57;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.modal-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.modal-body {
  padding: 0 40px 40px;
}

.register-info {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.6;
}

.profile-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.profile-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border: 2px solid #e0e4ef;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Open Sans', sans-serif;
}

.profile-option i {
  font-size: 32px;
  color: #9ca3af;
  transition: color 0.2s;
}

.profile-option span {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.4;
}

.profile-option:hover {
  border-color: #3a9bff;
  background: #f7f9ff;
}

.profile-option:hover i {
  color: #3a9bff;
}

.profile-option--active {
  border-color: #3a9bff;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
}

.profile-option--active i {
  color: #3a9bff;
}

.profile-option--active span {
  color: #041a57;
}

.register-actions {
  margin-bottom: 24px;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #041a57 0%, #00235a 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 13px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.3px;
  font-family: 'Open Sans', sans-serif;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #0a3472 0%, #1a4a8a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(4, 26, 87, 0.3);
}

.btn-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-switch {
  text-align: center;
  font-size: 13.5px;
  color: #6b7280;
  margin: 0;
}

.auth-switch a {
  color: #041a57;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1.5px solid #f29f1f;
  padding-bottom: 1px;
  transition: color 0.2s;
  cursor: pointer;
}

.auth-switch a:hover {
  color: #3a9bff;
}

/* Formulaire d'inscription */
.btn-back {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  padding: 8px 0;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #041a57;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  padding: 11px 14px;
  border: 1.5px solid #e0e4ef;
  border-radius: 8px;
  font-size: 14px;
  color: #041a57;
  font-family: 'Open Sans', sans-serif;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3a9bff;
}

.form-group input::placeholder {
  color: #9ca3af;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-left: 4px solid #dc2626;
  color: #991b1b;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-left: 4px solid #10b981;
  color: #065f46;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 640px) {
  .modal-header {
    padding: 32px 24px 20px;
  }

  .modal-body {
    padding: 0 24px 32px;
  }

  .modal-header h2 {
    font-size: 24px;
  }

  .profile-selection {
    grid-template-columns: 1fr;
  }
}
</style>
