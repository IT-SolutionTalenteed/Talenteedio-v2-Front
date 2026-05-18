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

            <!-- Étape 2: Formulaire Talent (comme TalentRegister) -->
            <div v-else-if="step === 2 && selectedProfile === 'talent'">
              <button class="btn-back" @click="step = 1">
                <i class="fa-solid fa-arrow-left"></i> {{ t('auth.register.back') || 'Retour' }}
              </button>

              <!-- Stepper -->
              <div class="stepper-nav">
                <div class="stepper-step" :class="{ active: talentStep === 1, done: talentStep > 1 }">
                  <div class="step-circle">
                    <template v-if="talentStep > 1">
                      <i class="fa-solid fa-check" style="font-size:11px"></i>
                    </template>
                    <template v-else>1</template>
                  </div>
                  <div class="step-info">
                    <strong>Informations</strong>
                    <small>Vos coordonnées</small>
                  </div>
                </div>
                <div class="stepper-line" :class="{ done: talentStep > 1 }"></div>
                <div class="stepper-step" :class="{ active: talentStep === 2 }">
                  <div class="step-circle">
                    <i class="fa-solid fa-brain" style="font-size:11px"></i>
                  </div>
                  <div class="step-info">
                    <strong>Profil</strong>
                    <small>Optionnel</small>
                  </div>
                </div>
              </div>

              <!-- Talent Step 1 -->
              <div v-show="talentStep === 1">
                <div class="form-section-title">
                  <i class="fa-solid fa-address-card"></i>
                  Informations personnelles
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input v-model="talentForm.nom" type="text" class="form-input" placeholder="Votre nom">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Prénom</label>
                    <input v-model="talentForm.prenom" type="text" class="form-input" placeholder="Votre prénom">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email <span class="required">*</span></label>
                  <input v-model="talentForm.email" type="email" class="form-input" placeholder="votre{'@'}email.com">
                </div>

                <div class="form-group">
                  <label class="form-label">Secteur d'activité <span class="required">*</span></label>
                  <select v-model="talentForm.secteur_souhaite_id" class="form-input">
                    <option value="">Sélectionner</option>
                    <option v-for="sector in activitySectors" :key="sector.id" :value="sector.id">
                      {{ sector.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Expérience <span class="required">*</span></label>
                  <select v-model="talentForm.experience_id" class="form-input">
                    <option value="">Sélectionner</option>
                    <option v-for="exp in experiences" :key="exp.id" :value="exp.id">
                      {{ exp.name }}
                    </option>
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ville</label>
                    <input v-model="talentForm.ville" type="text" class="form-input" placeholder="Ex: Paris">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Pays <span class="required">*</span></label>
                    <select v-model="talentForm.pays" class="form-input">
                      <option value="">Sélectionner</option>
                      <option>France</option>
                      <option>Sénégal</option>
                      <option>Côte d'Ivoire</option>
                      <option>Maroc</option>
                      <option>Cameroun</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>

                <div v-if="error" class="error-message">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ error }}
                </div>

                <button type="button" class="btn-submit" @click="goToTalentStep2">
                  Continuer <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <!-- Talent Step 2 -->
              <div v-show="talentStep === 2">
                <div class="form-section-title">
                  <i class="fa-solid fa-brain"></i>
                  Profil professionnel (optionnel)
                </div>

                <div class="form-group">
                  <label class="form-label">CV</label>
                  <input @change="handleFileUpload" type="file" class="form-input" accept=".pdf,.doc,.docx" style="padding:10px 12px">
                </div>

                <div class="form-group">
                  <label class="form-label">Poste recherché</label>
                  <input v-model="talentForm.poste" type="text" class="form-input" placeholder="Ex: Développeur Full Stack">
                </div>

                <div class="form-group">
                  <label class="form-label">Compétences</label>
                  <textarea v-model="talentForm.competences" class="form-input" rows="3" placeholder="Ex: PHP, Laravel, React..."></textarea>
                </div>

                <div class="consent-checkbox-wrapper">
                  <label class="consent-checkbox">
                    <input type="checkbox" v-model="talentForm.consentAccepted" class="consent-input">
                    <span class="consent-text">
                      J'accepte les <a href="/terms-and-conditions" target="_blank" class="consent-link">conditions générales</a> et la <a href="/privacy-policy" target="_blank" class="consent-link">politique de confidentialité</a>
                    </span>
                  </label>
                </div>

                <div v-if="error" class="error-message">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ error }}
                </div>

                <div v-if="success" class="success-message">
                  <i class="fa-solid fa-circle-check"></i>
                  {{ success }}
                </div>

                <div style="display:flex;gap:12px;flex-wrap:wrap">
                  <button type="button" class="btn-back-inline" @click="talentStep = 1">
                    <i class="fa-solid fa-arrow-left"></i> Retour
                  </button>
                  <button type="submit" class="btn-submit" style="flex:1" :disabled="loading || !talentForm.consentAccepted" @click="handleTalentRegister">
                    <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
                    <span v-else>Créer mon compte</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Étape 2: Formulaire Entreprise (simple) -->
            <div v-else-if="step === 2 && selectedProfile === 'entreprise'">
              <button class="btn-back" @click="step = 1">
                <i class="fa-solid fa-arrow-left"></i> {{ t('auth.register.back') || 'Retour' }}
              </button>

              <form @submit.prevent="handleCompanyRegister" class="register-form">
                <div class="form-fields">
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import api from '../services/api.js'

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
const talentStep = ref(1)
const selectedProfile = ref(props.defaultProfile || '')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Formulaire entreprise (simple)
const form = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// Formulaire talent (complet comme TalentRegister)
const talentForm = ref({
  nom: '',
  prenom: '',
  email: '',
  secteur_souhaite_id: '',
  experience_id: '',
  ville: '',
  pays: '',
  cv: null,
  poste: '',
  competences: '',
  pays_relocation: '',
  ville_relocation: '',
  consentAccepted: false
})

// Référentiels
const activitySectors = ref([])
const experiences = ref([])

// Charger les référentiels
const loadReferentiels = async () => {
  try {
    const [sectorsRes, expRes] = await Promise.all([
      api.get('/public/ats/activity-sectors'),
      api.get('/public/ats/experiences')
    ])
    activitySectors.value = sectorsRes.data.data || sectorsRes.data
    experiences.value = expRes.data.data || expRes.data
  } catch (err) {
    console.error('Erreur chargement référentiels:', err)
  }
}

// Réinitialiser le formulaire quand le modal s'ouvre/ferme
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Si un profil par défaut est fourni, aller directement à l'étape 2
    if (props.defaultProfile) {
      selectedProfile.value = props.defaultProfile
      step.value = 2
      talentStep.value = 1
    } else {
      step.value = 1
      talentStep.value = 1
      selectedProfile.value = ''
    }
    // Réinitialiser les formulaires
    form.value = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
    talentForm.value = {
      nom: '',
      prenom: '',
      email: '',
      secteur_souhaite_id: '',
      experience_id: '',
      ville: '',
      pays: '',
      cv: null,
      poste: '',
      competences: '',
      pays_relocation: '',
      ville_relocation: '',
      consentAccepted: false
    }
    error.value = ''
    success.value = ''
    loading.value = false
    
    // Charger les référentiels si talent
    if (props.defaultProfile === 'talent') {
      loadReferentiels()
    }
  }
})

const goToStep2 = () => {
  if (selectedProfile.value) {
    step.value = 2
    if (selectedProfile.value === 'talent') {
      loadReferentiels()
    }
  }
}

const goToTalentStep2 = () => {
  error.value = ''
  
  if (!talentForm.value.nom || !talentForm.value.email || !talentForm.value.secteur_souhaite_id || !talentForm.value.experience_id || !talentForm.value.pays) {
    error.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }
  
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(talentForm.value.email)) {
    error.value = 'Email invalide'
    return
  }
  
  talentStep.value = 2
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    talentForm.value.cv = file
  }
}

const handleTalentRegister = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  
  try {
    const formData = new FormData()
    formData.append('first_name', talentForm.value.prenom || '')
    formData.append('last_name', talentForm.value.nom)
    formData.append('email', talentForm.value.email)
    formData.append('secteur_souhaite_id', talentForm.value.secteur_souhaite_id)
    formData.append('experience_id', talentForm.value.experience_id)
    formData.append('ville', talentForm.value.ville || '')
    formData.append('pays', talentForm.value.pays)
    
    if (talentForm.value.cv) {
      formData.append('cv', talentForm.value.cv)
    }
    if (talentForm.value.poste) {
      formData.append('titre_poste', talentForm.value.poste)
    }
    if (talentForm.value.competences) {
      formData.append('competences', talentForm.value.competences)
    }
    if (talentForm.value.pays_relocation) {
      formData.append('pays_souhaites', JSON.stringify([talentForm.value.pays_relocation]))
    }
    if (talentForm.value.ville_relocation) {
      formData.append('villes_souhaitees', JSON.stringify([talentForm.value.ville_relocation]))
    }
    
    const response = await api.post('/public/ats/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    success.value = 'Inscription réussie ! Redirection...'
    
    setTimeout(() => {
      emit('close')
      router.push({
        name: 'TalentConfirm',
        query: { email: talentForm.value.email }
      })
    }, 1500)
  } catch (err) {
    console.error('Erreur inscription:', err)
    error.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription'
  } finally {
    loading.value = false
  }
}

const handleCompanyRegister = async () => {
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
    const endpoint = `${apiBase}/register/entreprise`

    const payload = {
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      nom: form.value.nom
    }

    const response = await axios.post(endpoint, payload)

    // Stocker le token et les infos utilisateur
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userRole', 'entreprise')
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

onMounted(() => {
  if (props.defaultProfile === 'talent') {
    loadReferentiels()
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
  max-width: 600px;
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

.btn-back-inline {
  background: none;
  border: 2px solid #e0e4ef;
  color: #041a57;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-back-inline:hover {
  border-color: #3a9bff;
  color: #3a9bff;
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
  margin-bottom: 16px;
}

.form-group label, .form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-group input, .form-input {
  padding: 11px 14px;
  border: 1.5px solid #e0e4ef;
  border-radius: 8px;
  font-size: 14px;
  color: #041a57;
  font-family: 'Open Sans', sans-serif;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus, .form-input:focus {
  outline: none;
  border-color: #3a9bff;
}

.form-group input::placeholder, .form-input::placeholder {
  color: #9ca3af;
}

.form-group select, .form-input select {
  padding: 11px 14px;
  border: 1.5px solid #e0e4ef;
  border-radius: 8px;
  font-size: 14px;
  color: #041a57;
  font-family: 'Open Sans', sans-serif;
  transition: border-color 0.2s;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #041a57;
  margin: 20px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e4ef;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-section-title i {
  color: #3a9bff;
}

.required {
  color: #f07c00;
}

/* Stepper */
.stepper-nav {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 24px 0;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.stepper-step {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e0e4ef;
  background: #fff;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.stepper-step.active .step-circle {
  background: #3a9bff;
  border-color: #3a9bff;
  color: #fff;
}

.stepper-step.done .step-circle {
  background: #22c55e;
  border-color: #22c55e;
  color: #fff;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-info strong {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}

.step-info small {
  font-size: 11px;
  color: #9ca3af;
}

.stepper-line {
  height: 2px;
  flex: 0 0 40px;
  background: #e0e4ef;
  margin: 0 8px;
  margin-bottom: 20px;
  transition: background 0.3s;
}

.stepper-line.done {
  background: #22c55e;
}

/* Consent checkbox */
.consent-checkbox-wrapper {
  margin: 20px 0;
}

.consent-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.consent-input {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.consent-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.consent-link {
  color: #3a9bff;
  text-decoration: underline;
  font-weight: 600;
}

.consent-link:hover {
  color: #f07c00;
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
  margin-bottom: 16px;
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
  margin-bottom: 16px;
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

  .form-row {
    grid-template-columns: 1fr;
  }

  .stepper-nav {
    flex-direction: column;
    align-items: stretch;
  }

  .stepper-line {
    width: 2px;
    height: 20px;
    flex: none;
    margin: 8px 0 8px 17px;
  }
}
</style>
