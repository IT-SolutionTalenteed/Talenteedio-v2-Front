<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <button class="modal-close" @click="$emit('close')" aria-label="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-header">
            <h2>{{ t('auth.login.title') }}</h2>
            <p>{{ t('auth.login.subtitle') }}</p>
          </div>

          <div class="modal-body">
            <button type="button" class="btn-google" @click="loginWithGoogle">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {{ t('auth.login.googleBtn') }}
            </button>

            <div class="auth-divider"><span>{{ t('auth.login.or') }}</span></div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="field">
                <label for="modal-email">{{ t('auth.login.email') }}</label>
                <div class="field-input-wrap">
                  <i class="fa-regular fa-envelope field-icon"></i>
                  <input type="email" id="modal-email" v-model="form.email" :placeholder="t('auth.login.emailPlaceholder')" required autocomplete="email" />
                </div>
              </div>

              <div class="field">
                <div class="field-label-row">
                  <label for="modal-password">{{ t('auth.login.password') }}</label>
                  <a href="/forgot-password" class="forgot-link">{{ t('auth.forgotPassword') }}</a>
                </div>
                <div class="field-input-wrap">
                  <i class="fa-solid fa-lock field-icon"></i>
                  <input :type="showPassword ? 'text' : 'password'" id="modal-password" v-model="form.password" placeholder="••••••••" required autocomplete="current-password" />
                  <button type="button" class="field-eye" @click="showPassword = !showPassword" tabindex="-1">
                    <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="recaptcha-wrap">
                <div ref="recaptchaContainer"></div>
              </div>

              <div v-if="isPending" class="auth-pending">
                <div class="auth-pending-icon"><i class="fa-regular fa-clock"></i></div>
                <div>
                  <strong>{{ t('auth.pendingAccount.title') }}</strong>
                  <p>{{ t('auth.pendingAccount.message') }}</p>
                </div>
              </div>
              <div v-else-if="error" class="auth-error">
                <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
              </div>

              <button type="submit" class="btn-submit" :disabled="loading || !recaptchaToken">
                <span v-if="loading" class="btn-loader">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> {{ t('auth.login.loading') }}
                </span>
                <span v-else>{{ t('auth.login.submit') }} <i class="fa-solid fa-arrow-right"></i></span>
              </button>
            </form>

            <p class="auth-switch">
              {{ t('auth.login.noAccount') }}
              <a href="#" @click.prevent="$emit('switch-to-register')">{{ t('auth.login.createAccount') }}</a>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/api.js'
import { googleAuthService } from '../services/googleAuth.js'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'switch-to-register', 'login-success'])

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const isPending = ref(false)
const showPassword = ref(false)
const recaptchaToken = ref('')
const recaptchaContainer = ref(null)
const widgetId = ref(null)

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const loginWithGoogle = () => { googleAuthService.loginWithGoogle() }

const renderRecaptcha = () => {
  if (!recaptchaContainer.value || !window.grecaptcha) return
  widgetId.value = window.grecaptcha.render(recaptchaContainer.value, {
    sitekey: siteKey,
    callback: (token) => { recaptchaToken.value = token },
    'expired-callback': () => { recaptchaToken.value = '' },
    'error-callback': () => { recaptchaToken.value = ''; error.value = t('auth.login.recaptchaError') },
  })
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        renderRecaptcha()
      }
    }, 100)
  }
})

const handleLogin = async () => {
  if (!recaptchaToken.value) {
    error.value = t('auth.login.recaptchaRequired')
    return
  }
  loading.value = true
  error.value = ''
  isPending.value = false
  try {
    const response = await authService.login({
      ...form.value,
      recaptcha_token: recaptchaToken.value,
    })
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('userRole', response.data.user.role)
    localStorage.setItem('userId', response.data.user.id)
    const u = response.data.user
    localStorage.setItem('userName', [u.first_name, u.last_name].filter(Boolean).join(' ') || u.name || '')

    emit('login-success')
    emit('close')
    
    // Recharger la page pour mettre à jour l'état de connexion
    window.location.reload()
  } catch (err) {
    const rawErrors = Object.values(err.response?.data?.errors || {}).flat()
    const rawMsg = err.response?.data?.message || rawErrors.join(' | ') || ''

    if (rawMsg === '__PENDING__' || rawErrors.includes('__PENDING__')) {
      isPending.value = true
    } else {
      error.value = rawMsg || t('auth.login.error')
    }
    if (widgetId.value !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.value)
    }
    recaptchaToken.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!window.grecaptcha) {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    document.head.appendChild(script)
  }
})
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

/* Réutiliser les styles de Login.vue */
.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1.5px solid #e0e4ef;
  background: #fff;
  border-radius: 8px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #041a57;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-google:hover {
  border-color: #3a9bff;
  background: #f5f7fc;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: #9ca3af;
  font-size: 13px;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e4ef;
}

.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 7px;
}

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}

.forgot-link {
  font-size: 12px;
  color: #192bc2;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.field-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  font-size: 14px;
  pointer-events: none;
}

.field-input-wrap input {
  width: 100%;
  border: 1.5px solid #e0e4ef;
  border-radius: 8px;
  padding: 11px 42px;
  font-size: 14px;
  color: #041a57;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Open Sans', sans-serif;
}

.field-input-wrap input::placeholder {
  color: #c0c5d0;
}

.field-input-wrap input:focus {
  border-color: #3a9bff;
  box-shadow: 0 0 0 3px rgba(58, 155, 255, 0.12);
}

.field-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 15px;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}

.field-eye:hover {
  color: #3a9bff;
}

.recaptcha-wrap {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.auth-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #dc2626;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-pending {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #92400e;
}

.auth-pending-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fef3c7;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.auth-pending strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #78350f;
  margin-bottom: 5px;
}

.auth-pending p {
  margin: 0;
  line-height: 1.6;
  color: #92400e;
  font-size: 13px;
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

.btn-loader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 13.5px;
  color: #6b7280;
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
}
</style>
