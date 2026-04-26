<template>
  <div class="auth-page">

    <!-- ── Panneau gauche ── -->
    <div class="auth-left">
      <router-link to="/" class="auth-logo">
        <img src="/logo.png" alt="Talenteed" height="52">
      </router-link>

      <div class="auth-left-body">
        <div class="auth-left-icon"><i class="fa-solid fa-rocket"></i></div>
        <h2 class="auth-left-title">{{ t('auth.register.leftTitle') }}<br><span>{{ t('auth.register.leftTitleSpan') }}</span></h2>
        <p class="auth-left-sub">{{ t('auth.register.leftSub') }}</p>
        <div class="auth-steps">
          <div class="step"><div class="step-num">1</div><div class="step-text">{{ t('auth.register.step1') }}</div></div>
          <div class="step"><div class="step-num">2</div><div class="step-text">{{ t('auth.register.step2') }}</div></div>
          <div class="step"><div class="step-num">3</div><div class="step-text">{{ t('auth.register.step3') }}</div></div>
        </div>
      </div>

      <p class="auth-left-footer">Talenteed</p>
    </div>

    <!-- ── Panneau droit ── -->
    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <h1>{{ t('auth.register.title') }}</h1>
          <p>{{ t('auth.register.subtitle') }}</p>
        </div>

        <button type="button" class="btn-google" @click="loginWithGoogle">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {{ t('auth.register.googleBtn') }}
        </button>

        <div class="auth-divider"><span>{{ t('auth.register.or') }}</span></div>

        <form @submit.prevent="handleRegister" novalidate>
          <div class="field">
            <label for="name">{{ t('auth.register.fullName') }}</label>
            <div class="field-input-wrap">
              <i class="fa-regular fa-user field-icon"></i>
              <input type="text" id="name" v-model="form.name" :placeholder="t('auth.register.namePlaceholder')" required autocomplete="name" />
            </div>
          </div>

          <div class="field">
            <label for="email">{{ t('auth.register.email') }}</label>
            <div class="field-input-wrap">
              <i class="fa-regular fa-envelope field-icon"></i>
              <input type="email" id="email" v-model="form.email" :placeholder="t('auth.register.emailPlaceholder')" required autocomplete="email" />
            </div>
          </div>

          <div class="fields-row">
            <div class="field">
              <label for="password">{{ t('auth.register.password') }}</label>
              <div class="field-input-wrap">
                <i class="fa-solid fa-lock field-icon"></i>
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="••••••••" required autocomplete="new-password" />
                <button type="button" class="field-eye" @click="showPassword = !showPassword" tabindex="-1">
                  <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="field">
              <label for="password_confirmation">{{ t('auth.register.confirmPassword') }}</label>
              <div class="field-input-wrap">
                <i class="fa-solid fa-lock field-icon"></i>
                <input :type="showPassword ? 'text' : 'password'" id="password_confirmation" v-model="form.password_confirmation" placeholder="••••••••" required autocomplete="new-password" />
              </div>
            </div>
          </div>

          <div class="field">
            <label for="role">{{ t('auth.register.iAm') }}</label>
            <div class="field-input-wrap">
              <i class="fa-solid fa-id-badge field-icon"></i>
              <select id="role" v-model="form.role" required class="field-select">
                <option value="">{{ t('auth.register.selectProfile') }}</option>
                <option value="talent">{{ t('auth.register.talentOption') }}</option>
                <option value="entreprise">{{ t('auth.register.companyOption') }}</option>
              </select>
              <i class="fa-solid fa-chevron-down select-arrow"></i>
            </div>
          </div>

          <div class="consent-block">
            <label class="consent-label">
              <input type="checkbox" v-model="form.consent" class="consent-check" required />
              <span class="consent-box"><i class="fa-solid fa-check"></i></span>
              <span class="consent-text">
                {{ t('auth.register.consentText') }}
                <router-link to="/legal/conditions-generales" target="_blank">{{ t('auth.register.terms') }}</router-link>
                {{ t('auth.register.and') }}
                <router-link to="/legal/confidentialite" target="_blank">{{ t('auth.register.privacy') }}</router-link>
              </span>
            </label>
          </div>

          <div v-if="error" class="auth-error">
            <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
          </div>
          <div v-if="success" class="auth-success">
            <i class="fa-solid fa-circle-check"></i> {{ success }}
          </div>

          <button type="submit" class="btn-submit" :disabled="isSubmitDisabled">
            <span v-if="loading" class="btn-loader">
              <i class="fa-solid fa-circle-notch fa-spin"></i> {{ t('auth.register.loading') }}
            </span>
            <span v-else>{{ t('auth.register.submit') }} <i class="fa-solid fa-arrow-right"></i></span>
          </button>
        </form>

        <p class="auth-switch">
          {{ t('auth.register.hasAccount') }}
          <router-link to="/login">{{ t('auth.register.login') }}</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/api.js'
import { googleAuthService } from '../services/googleAuth.js'

const { t } = useI18n()
const router  = useRouter()
const loginWithGoogle = () => { googleAuthService.registerWithGoogle() }

const showPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  consent: false
})

const loading = ref(false)
const error   = ref('')
const success = ref('')

const isSubmitDisabled = computed(() => {
  return loading.value || !form.value.consent
})

const handleRegister = async () => {
  loading.value = true
  error.value   = ''
  success.value = ''
  try {
    await authService.register(form.value)
    success.value = t('auth.register.success')
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    if (err.response?.data?.errors) {
      error.value = Object.values(err.response.data.errors).flat().join(', ')
    } else {
      error.value = err.response?.data?.message || t('auth.register.error', 'Erreur lors de l\'inscription')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Layout ── */
.auth-page {
  min-height: 100vh;
  display: flex;
  font-family: 'Open Sans', sans-serif;
}

/* ── Panneau gauche ── */
.auth-left {
  width: 400px;
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
  font-family: 'Barlow Condensed', 'Open Sans', sans-serif;
  font-size: 36px;
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
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 300px;
}

/* ── Steps ── */
.auth-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  align-items: center;
  gap: 14px;
}

.step-num {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(242, 159, 31, 0.22);
  border: 2px solid rgba(242, 159, 31, 0.5);
  color: #f29f1f;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-text {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
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
  padding: 44px 48px;
  width: 100%;
  max-width: 480px;
}

.auth-card-header {
  margin-bottom: 28px;
}

.auth-card-header h1 {
  font-family: 'Barlow Condensed', 'Open Sans', sans-serif;
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
  margin: 18px 0;
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
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 7px;
}

.fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
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
  z-index: 1;
}

.field-input-wrap input,
.field-input-wrap .field-select {
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
  appearance: none;
}

.field-input-wrap input::placeholder {
  color: #c0c5d0;
}

.field-input-wrap input:focus,
.field-input-wrap .field-select:focus {
  border-color: #3a9bff;
  box-shadow: 0 0 0 3px rgba(58, 155, 255, 0.12);
}

.select-arrow {
  position: absolute;
  right: 14px;
  color: #9ca3af;
  font-size: 11px;
  pointer-events: none;
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

/* ── Consentement ── */
.consent-block {
  margin: 16px 0;
  padding: 14px 16px;
  background: #f5f7fc;
  border-radius: 8px;
  border: 1.5px solid #e0e4ef;
}

.consent-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.consent-check {
  display: none;
}

.consent-box {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.2s;
}

.consent-box i {
  font-size: 10px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}

.consent-check:checked + .consent-box {
  background: #041a57;
  border-color: #041a57;
}

.consent-check:checked + .consent-box i {
  opacity: 1;
}

.consent-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
}

.consent-text a {
  color: #041a57;
  font-weight: 700;
  border-bottom: 1.5px solid #f29f1f;
  padding-bottom: 1px;
  text-decoration: none;
}

.consent-text a:hover {
  color: #3a9bff;
}

/* ── Messages ── */
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

.auth-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #16a34a;
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
  margin-top: 20px;
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

@media (max-width: 540px) {
  .fields-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .auth-right {
    padding: 24px 16px;
    align-items: flex-start;
  }
  .auth-card {
    padding: 32px 20px;
    border-radius: 12px;
  }
}
</style>
