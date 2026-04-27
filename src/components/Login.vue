<template>
  <div class="auth-page">

    <!-- ── Panneau gauche ── -->
    <div class="auth-left">
      <router-link to="/" class="auth-logo">
        <img src="/logo.png" alt="Talenteed" height="52">
      </router-link>

      <div class="auth-left-body">
        <div class="auth-left-icon">
          <i class="fa-solid fa-handshake"></i>
        </div>
        <h2 class="auth-left-title">{{ t('auth.login.leftTitle') }}<br><span>Talenteed</span></h2>
        <p class="auth-left-sub">{{ t('auth.login.leftSub') }}</p>
        <div class="auth-badges">
          <span><i class="fa-solid fa-briefcase"></i> {{ t('auth.login.badge1') }}</span>
          <span><i class="fa-solid fa-calendar-days"></i> {{ t('auth.login.badge2') }}</span>
          <span><i class="fa-solid fa-wand-magic-sparkles"></i> {{ t('auth.login.badge3') }}</span>
        </div>
      </div>

      <p class="auth-left-footer">Talenteed</p>
    </div>

    <!-- ── Panneau droit ── -->
    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <h1>{{ t('auth.login.title') }}</h1>
          <p>{{ t('auth.login.subtitle') }}</p>
        </div>

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
            <label for="email">{{ t('auth.login.email') }}</label>
            <div class="field-input-wrap">
              <i class="fa-regular fa-envelope field-icon"></i>
              <input type="email" id="email" v-model="form.email" :placeholder="t('auth.login.emailPlaceholder')" required autocomplete="email" />
            </div>
          </div>

          <div class="field">
            <div class="field-label-row">
              <label for="password">{{ t('auth.login.password') }}</label>
            </div>
            <div class="field-input-wrap">
              <i class="fa-solid fa-lock field-icon"></i>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" class="field-eye" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="recaptcha-wrap">
            <div ref="recaptchaContainer"></div>
          </div>

          <div v-if="error" class="auth-error">
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
          <router-link to="/profile-selection">{{ t('auth.login.createAccount') }}</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/api.js'
import { googleAuthService } from '../services/googleAuth.js'

const { t } = useI18n()
const router = useRouter()
const route  = useRoute()

const form             = ref({ email: '', password: '' })
const loading          = ref(false)
const error            = ref('')
const showPassword     = ref(false)
const recaptchaToken   = ref('')
const recaptchaContainer = ref(null)
const widgetId         = ref(null)

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const loginWithGoogle = () => { googleAuthService.loginWithGoogle() }

const renderRecaptcha = () => {
  if (!recaptchaContainer.value || !window.grecaptcha) return
  widgetId.value = window.grecaptcha.render(recaptchaContainer.value, {
    sitekey:            siteKey,
    callback:           (token) => { recaptchaToken.value = token },
    'expired-callback': () => { recaptchaToken.value = '' },
    'error-callback':   () => { recaptchaToken.value = ''; error.value = t('auth.login.recaptchaError') },
  })
}

onMounted(() => {
  if (window.grecaptcha && window.grecaptcha.render) {
    renderRecaptcha()
  } else {
    window.onRecaptchaLoad = renderRecaptcha
    const scripts = document.querySelectorAll('script[src*="recaptcha"]')
    if (scripts.length === 0) {
      const s = document.createElement('script')
      s.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
      s.async = true
      document.head.appendChild(s)
    } else {
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
    error.value = t('auth.login.recaptchaRequired')
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
    const u = response.data.user
    localStorage.setItem('userName', [u.first_name, u.last_name].filter(Boolean).join(' ') || u.name || '')

    const redirect = route.query.redirect
    if (redirect) {
      router.push(decodeURIComponent(redirect))
    } else {
      switch (response.data.user.role) {
        case 'admin':      router.push('/admin');      break
        case 'talent':     router.push('/talent');     break
        case 'entreprise': router.push('/entreprise'); break
        default: error.value = t('auth.login.unknownRole')
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message
      || Object.values(err.response?.data?.errors || {}).flat().join(' | ')
      || t('auth.login.error')
    if (widgetId.value !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.value)
    }
    recaptchaToken.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Variables locales ── */
:root {
  --navy:      #00235a;
  --navy-dark: #041a57;
  --orange:    #f29f1f;
  --blue:      #3a9bff;
  --light-bg:  #f5f7fc;
  --border:    #e0e4ef;
}

/* ── Layout ── */
.auth-page {
  min-height: 100vh;
  display: flex;
  font-family: 'Open Sans', sans-serif;
}

/* ── Panneau gauche ── */
.auth-left {
  width: 420px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #041a57 0%, #00235a 50%, #0a3472 100%);
  display: flex;
  flex-direction: column;
  padding: 40px 48px;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  top: -120px; right: -120px;
  width: 380px; height: 380px;
  border-radius: 50%;
  background: rgba(58, 155, 255, 0.12);
  pointer-events: none;
}

.auth-left::after {
  content: '';
  position: absolute;
  bottom: -80px; left: -80px;
  width: 280px; height: 280px;
  border-radius: 50%;
  background: rgba(242, 159, 31, 0.10);
  pointer-events: none;
}

.auth-logo img {
  height: 48px;
  width: auto;
  filter: brightness(0) invert(1);
  position: relative;
  z-index: 1;
}

.auth-left-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.auth-left-icon {
  width: 64px;
  height: 64px;
  background: rgba(242, 159, 31, 0.18);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #f29f1f;
  margin-bottom: 28px;
}

.auth-left-title {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 38px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.auth-left-title span {
  color: #f29f1f;
}

.auth-left-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 300px;
}

.auth-badges {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-badges span {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13.5px;
  font-weight: 500;
}

.auth-badges span i {
  width: 32px;
  height: 32px;
  background: rgba(58, 155, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #3a9bff;
  flex-shrink: 0;
}

.auth-left-footer {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.38);
  position: relative;
  z-index: 1;
}

/* ── Panneau droit ── */
.auth-right {
  flex: 1;
  background: #f5f7fc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 35, 90, 0.08);
  padding: 48px 48px;
  width: 100%;
  max-width: 440px;
}

.auth-card-header {
  margin-bottom: 32px;
}

.auth-card-header h1 {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #041a57;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.auth-card-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* ── Bouton Google ── */
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

/* ── Séparateur ── */
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

/* ── Champs ── */
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

/* ── reCAPTCHA ── */
.recaptcha-wrap {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

/* ── Erreur ── */
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

/* ── Bouton submit ── */
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

/* ── Lien switch ── */
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
}

.auth-switch a:hover {
  color: #3a9bff;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .auth-left {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-right {
    padding: 24px 16px;
    align-items: flex-start;
  }
  .auth-card {
    padding: 32px 24px;
    border-radius: 12px;
  }
}
</style>
