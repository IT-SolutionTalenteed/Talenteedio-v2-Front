<template>
  <div class="page-wrapper">
    <PublicNav />

    <section class="hero-section">
      <div class="container">
        <span class="hero-label">{{ t('bugReport.label') }}</span>
        <h1 class="hero-title">{{ t('bugReport.title') }}</h1>
        <p class="hero-desc">{{ t('bugReport.description') }}</p>
      </div>
    </section>

    <div class="bug-report-page">
      <div class="container">
        <div class="bug-report-form-wrapper">
          <form @submit.prevent="submitReport" class="bug-report-form">
            <!-- Nom -->
            <div class="form-group">
              <label for="nom">{{ t('bugReport.form.name') }} <span class="required">*</span></label>
              <input 
                type="text" 
                id="nom" 
                v-model="form.nom" 
                :placeholder="t('bugReport.form.namePlaceholder')"
                required
              />
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">{{ t('bugReport.form.email') }} <span class="required">*</span></label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                :placeholder="t('bugReport.form.emailPlaceholder')"
                required
              />
            </div>

            <!-- Type de bug -->
            <div class="form-group">
              <label for="type">{{ t('bugReport.form.type') }} <span class="required">*</span></label>
              <select id="type" v-model="form.type" required>
                <option value="">{{ t('bugReport.form.typeSelect') }}</option>
                <option value="affichage">{{ t('bugReport.form.types.display') }}</option>
                <option value="fonctionnalite">{{ t('bugReport.form.types.functionality') }}</option>
                <option value="performance">{{ t('bugReport.form.types.performance') }}</option>
                <option value="securite">{{ t('bugReport.form.types.security') }}</option>
                <option value="autre">{{ t('bugReport.form.types.other') }}</option>
              </select>
            </div>

            <!-- URL de la page -->
            <div class="form-group">
              <label for="url">{{ t('bugReport.form.url') }}</label>
              <input 
                type="url" 
                id="url" 
                v-model="form.url" 
                :placeholder="t('bugReport.form.urlPlaceholder')"
              />
            </div>

            <!-- Navigateur -->
            <div class="form-group">
              <label for="navigateur">{{ t('bugReport.form.browser') }}</label>
              <input 
                type="text" 
                id="navigateur" 
                v-model="form.navigateur" 
                :placeholder="t('bugReport.form.browserPlaceholder')"
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description">{{ t('bugReport.form.description') }} <span class="required">*</span></label>
              <textarea 
                id="description" 
                v-model="form.description" 
                rows="6"
                :placeholder="t('bugReport.form.descriptionPlaceholder')"
                required
              ></textarea>
            </div>

            <!-- Étapes pour reproduire -->
            <div class="form-group">
              <label for="etapes">{{ t('bugReport.form.steps') }}</label>
              <textarea 
                id="etapes" 
                v-model="form.etapes" 
                rows="4"
                :placeholder="t('bugReport.form.stepsPlaceholder')"
              ></textarea>
            </div>

            <!-- Messages d'erreur -->
            <div v-if="error" class="alert alert-error">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ error }}
            </div>

            <div v-if="success" class="alert alert-success">
              <i class="fa-solid fa-circle-check"></i>
              {{ t('bugReport.form.success') }}
            </div>

            <!-- Boutons -->
            <div class="form-actions">
              <button type="button" @click="$router.back()" class="btn btn--secondary">
                {{ t('bugReport.form.cancel') }}
              </button>
              <button type="submit" class="btn btn--blue" :disabled="loading">
                <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
                <span v-else>{{ t('bugReport.form.submit') }}</span>
              </button>
            </div>
          </form>

          <div class="bug-report-info">
            <div class="info-card">
              <i class="fa-solid fa-lightbulb"></i>
              <h3>{{ t('bugReport.tips.title') }}</h3>
              <ul>
                <li>{{ t('bugReport.tips.tip1') }}</li>
                <li>{{ t('bugReport.tips.tip2') }}</li>
                <li>{{ t('bugReport.tips.tip3') }}</li>
                <li>{{ t('bugReport.tips.tip4') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const form = ref({
  nom: '',
  email: '',
  type: '',
  url: '',
  navigateur: '',
  description: '',
  etapes: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

// Pré-remplir l'URL et le navigateur
onMounted(() => {
  form.value.url = window.location.href
  form.value.navigateur = navigator.userAgent
})

const submitReport = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    await axios.post(`${apiBase}/api/public/signaler-bug`, form.value)
    success.value = true
    
    // Réinitialiser le formulaire après 2 secondes
    setTimeout(() => {
      form.value = {
        nom: '',
        email: '',
        type: '',
        url: window.location.href,
        navigateur: navigator.userAgent,
        description: '',
        etapes: ''
      }
      success.value = false
    }, 3000)
  } catch (e) {
    error.value = e.response?.data?.message || t('bugReport.form.error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #00235a 0%, #1a3a8a 100%);
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section .container {
  text-align: center;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(58, 155, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-label {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 50px;
  margin-bottom: 14px;
}

.hero-title {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.6;
}

.bug-report-page {
  min-height: 80vh;
  padding: 56px 0 80px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.bug-report-form-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.bug-report-form {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.alert {
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn--blue {
  background: var(--blue);
  color: #fff;
}

.btn--blue:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn--blue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--secondary {
  background: #f1f5f9;
  color: var(--navy);
}

.btn--secondary:hover {
  background: #e2e8f0;
}

.bug-report-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-card i {
  font-size: 32px;
  color: var(--blue);
  margin-bottom: 16px;
}

.info-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 16px;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  font-size: 14px;
  color: var(--body-text);
  line-height: 1.6;
  padding-left: 24px;
  position: relative;
  margin-bottom: 12px;
}

.info-card li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--blue);
  font-weight: 700;
}

@media (max-width: 968px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .bug-report-form-wrapper {
    grid-template-columns: 1fr;
  }
  
  .bug-report-form {
    padding: 28px;
  }
}
</style>
