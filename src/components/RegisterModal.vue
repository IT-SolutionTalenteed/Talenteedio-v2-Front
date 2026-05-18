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

            <!-- Étape 2: Formulaire Entreprise (complet comme CompanyLanding) -->
            <div v-else-if="step === 2 && selectedProfile === 'entreprise'">
              <button class="btn-back" @click="step = 1">
                <i class="fa-solid fa-arrow-left"></i> {{ t('auth.register.back') || 'Retour' }}
              </button>

              <form @submit.prevent="handleCompanyRegister" class="register-form">
                <!-- Infos entreprise -->
                <div class="form-section-title">
                  <i class="fa-solid fa-building-circle-check"></i>
                  Informations entreprise
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nom de l'entreprise <span class="required">*</span></label>
                    <input v-model="companyForm.nom" type="text" class="form-input" placeholder="Ex: Talenteed" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Secteur d'activité <span class="required">*</span></label>
                    <select v-model="companyForm.activity_sector_id" class="form-input" required>
                      <option value="">Sélectionner</option>
                      <option v-for="sector in sectors" :key="sector.id" :value="sector.id">{{ sector.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Taille de l'entreprise</label>
                    <select v-model="companyForm.taille" class="form-input">
                      <option value="">Sélectionner</option>
                      <option value="1-10">1-10 employés</option>
                      <option value="11-50">11-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="201-500">201-500 employés</option>
                      <option value="500+">500+ employés</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Site web</label>
                    <input v-model="companyForm.site_web" type="url" class="form-input" placeholder="https://exemple.com" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ville</label>
                    <input v-model="companyForm.ville" type="text" class="form-input" placeholder="Ex: Paris" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Pays</label>
                    <input v-model="companyForm.pays" type="text" class="form-input" placeholder="Ex: France" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Adresse</label>
                  <input v-model="companyForm.adresse" type="text" class="form-input" placeholder="Ex: 123 rue de la République" />
                </div>

                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea v-model="companyForm.description" class="form-input" rows="3" placeholder="Décrivez votre entreprise..."></textarea>
                </div>

                <!-- Contact -->
                <div class="form-section-title">
                  <i class="fa-solid fa-user-tie"></i>
                  Contact
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nom complet <span class="required">*</span></label>
                    <input v-model="companyForm.name" type="text" class="form-input" placeholder="Ex: Jean Dupont" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Poste / Fonction</label>
                    <input v-model="companyForm.poste" type="text" class="form-input" placeholder="Ex: DRH, CEO" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Email <span class="required">*</span></label>
                    <input v-model="companyForm.email" type="email" class="form-input" placeholder="contact@entreprise.com" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Téléphone</label>
                    <input v-model="companyForm.telephone" type="tel" class="form-input" placeholder="+33 1 23 45 67 89" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Mot de passe <span class="required">*</span></label>
                    <input v-model="companyForm.password" type="password" class="form-input" placeholder="Minimum 8 caractères" required minlength="8" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Confirmer le mot de passe <span class="required">*</span></label>
                    <input v-model="companyForm.password_confirmation" type="password" class="form-input" placeholder="Retapez votre mot de passe" required />
                  </div>
                </div>

                <!-- Choix du plan -->
                <div class="form-section-title">
                  <i class="fa-solid fa-crown"></i>
                  Choisissez votre plan <span class="required">*</span>
                </div>

                <div v-if="plans.length" class="plans-grid">
                  <label
                    v-for="plan in plans"
                    :key="plan.id"
                    class="plan-card"
                    :class="{ 'plan-card--selected': companyForm.plan_id === plan.id }"
                  >
                    <input type="radio" name="plan" :value="plan.id" v-model="companyForm.plan_id" class="plan-radio" />
                    <div class="plan-card__top">
                      <div class="plan-card__name">{{ plan.name }}</div>
                      <div class="plan-card__price">
                        <span class="plan-card__amount">{{ formatPlanPrice(plan.price) }}</span>
                        <span class="plan-card__period">/mois</span>
                      </div>
                    </div>
                    <ul class="plan-card__features">
                      <li>
                        <i class="fa-solid fa-briefcase"></i>
                        <span v-if="plan.max_offres !== null">{{ plan.max_offres }} offre(s)</span>
                        <span v-else>Offres illimitées</span>
                      </li>
                      <li>
                        <i class="fa-solid fa-file-lines"></i>
                        <span v-if="plan.max_articles !== null">{{ plan.max_articles }} article(s)</span>
                        <span v-else>Articles illimités</span>
                      </li>
                      <li>
                        <i class="fa-solid fa-calendar-check"></i>
                        <span v-if="plan.max_evenements !== null">{{ plan.max_evenements }} événement(s)</span>
                        <span v-else>Événements illimités</span>
                      </li>
                    </ul>
                    <div class="plan-card__indicator">
                      <i v-if="companyForm.plan_id === plan.id" class="fa-solid fa-circle-check"></i>
                      <i v-else class="fa-regular fa-circle"></i>
                      <span>{{ companyForm.plan_id === plan.id ? 'Sélectionné' : 'Choisir' }}</span>
                    </div>
                  </label>
                </div>
                <div v-else class="form-group">
                  <p style="color: #6b7280; font-size: 14px;">Chargement des plans…</p>
                </div>

                <!-- Consent -->
                <div class="consent-checkbox-wrapper">
                  <label class="consent-checkbox">
                    <input type="checkbox" v-model="companyForm.acceptedTerms" class="consent-input">
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

                <button type="submit" class="btn-submit" :disabled="loading || !companyForm.plan_id || !companyForm.acceptedTerms">
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

// Formulaire entreprise (complet comme CompanyLanding)
const companyForm = ref({
  nom: '',
  activity_sector_id: '',
  taille: '',
  site_web: '',
  ville: '',
  pays: '',
  adresse: '',
  description: '',
  name: '',
  poste: '',
  email: '',
  telephone: '',
  password: '',
  password_confirmation: '',
  plan_id: null,
  acceptedTerms: false
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
const sectors = ref([])
const plans = ref([])

// Formater le prix des plans
const formatPlanPrice = (price) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)

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

// Charger les référentiels entreprise
const loadCompanyReferentiels = async () => {
  try {
    const [refRes, plansRes] = await Promise.all([
      axios.get(`${apiBase}/public/referentiels`),
      axios.get(`${apiBase}/plans`),
    ])
    sectors.value = refRes.data.activity_sectors || []
    plans.value = (plansRes.data || []).filter(p => p.is_active)
  } catch (err) {
    console.error('Erreur chargement référentiels entreprise:', err)
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
    companyForm.value = {
      nom: '',
      activity_sector_id: '',
      taille: '',
      site_web: '',
      ville: '',
      pays: '',
      adresse: '',
      description: '',
      name: '',
      poste: '',
      email: '',
      telephone: '',
      password: '',
      password_confirmation: '',
      plan_id: null,
      acceptedTerms: false
    }
    error.value = ''
    success.value = ''
    loading.value = false
    
    // Charger les référentiels selon le profil
    if (props.defaultProfile === 'talent') {
      loadReferentiels()
    } else if (props.defaultProfile === 'entreprise') {
      loadCompanyReferentiels()
    }
  }
})

const goToStep2 = () => {
  if (selectedProfile.value) {
    step.value = 2
    if (selectedProfile.value === 'talent') {
      loadReferentiels()
    } else if (selectedProfile.value === 'entreprise') {
      loadCompanyReferentiels()
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
  if (companyForm.value.password !== companyForm.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (companyForm.value.password.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  if (!companyForm.value.plan_id) {
    error.value = 'Veuillez choisir un plan'
    return
  }

  loading.value = true

  try {
    const response = await axios.post(`${apiBase}/register`, {
      name: companyForm.value.name,
      email: companyForm.value.email,
      password: companyForm.value.password,
      password_confirmation: companyForm.value.password_confirmation,
      role: 'entreprise',
      company_name: companyForm.value.nom,
      company_description: companyForm.value.description || undefined,
      company_address: companyForm.value.adresse || undefined,
      company_size: companyForm.value.taille || undefined,
      company_poste: companyForm.value.poste || undefined,
      activity_sector_id: companyForm.value.activity_sector_id || undefined,
      plan_id: companyForm.value.plan_id,
      company_city: companyForm.value.ville || undefined,
      company_country: companyForm.value.pays || undefined,
      company_website: companyForm.value.site_web || undefined,
      company_phone: companyForm.value.telephone || undefined,
    })

    success.value = 'Inscription réussie ! Redirection...'
    
    setTimeout(() => {
      emit('close')
      // Afficher un message de confirmation
      alert('Votre demande a été envoyée avec succès ! Notre équipe va examiner vos informations et vous contactera dans les plus brefs délais.')
      window.location.href = '/'
    }, 1500)
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      error.value = Array.isArray(first) ? first[0] : first
    } else {
      error.value = data?.message || 'Une erreur est survenue lors de l\'inscription'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.defaultProfile === 'talent') {
    loadReferentiels()
  } else if (props.defaultProfile === 'entreprise') {
    loadCompanyReferentiels()
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

/* Plans */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.plan-radio {
  display: none;
}

.plan-card {
  display: block;
  border: 2px solid #e0e4ef;
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  background: #fff;
}

.plan-card:hover {
  border-color: #3a9bff;
  box-shadow: 0 4px 16px rgba(0, 35, 90, 0.1);
  transform: translateY(-2px);
}

.plan-card--selected {
  border-color: #3a9bff;
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  box-shadow: 0 4px 20px rgba(0, 35, 90, 0.15);
}

.plan-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.plan-card__name {
  font-size: 15px;
  font-weight: 800;
  color: #041a57;
}

.plan-card__price {
  text-align: right;
  flex-shrink: 0;
}

.plan-card__amount {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #3a9bff;
  line-height: 1.2;
}

.plan-card__period {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

.plan-card--selected .plan-card__amount {
  color: #3a9bff;
}

.plan-card__features {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
}

.plan-card__features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 4px 0;
}

.plan-card__features li i {
  color: #3a9bff;
  font-size: 12px;
  flex-shrink: 0;
  width: 14px;
}

.plan-card__indicator {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.plan-card--selected .plan-card__indicator {
  color: #3a9bff;
}

.plan-card__indicator i {
  font-size: 16px;
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
