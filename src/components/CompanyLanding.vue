<template>
  <div class="company-landing">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">Recruteurs</span>
          <h1 class="hero-title">Trouvez les talents qui feront grandir votre entreprise</h1>
          <p class="hero-subtitle">
            Accédez à un vivier de candidats qualifiés et motivés. Participez à nos événements de recrutement et développez votre marque employeur en Afrique.
          </p>
        </div>
      </div>
    </section>

    <!-- ══ CONTENU PRINCIPAL ══ -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          
          <!-- Formulaire d'inscription -->
          <div class="form-section">
            <div class="form-card">
              <div class="form-header">
                <h2 class="form-title">
                  <i class="fa-solid fa-building"></i>
                  Créer mon compte entreprise
                </h2>
                <p class="form-subtitle">Rejoignez notre réseau de recruteurs et accédez aux meilleurs talents</p>
              </div>

              <form @submit.prevent="handleRegister" class="register-form">
                <!-- Informations entreprise -->
                <div class="form-section-title">
                  <i class="fa-solid fa-building-circle-check"></i>
                  Informations entreprise
                </div>

                <div class="form-group">
                  <label class="form-label">Nom de l'entreprise <span class="required">*</span></label>
                  <input 
                    v-model="form.nom" 
                    type="text" 
                    class="form-input" 
                    placeholder="Ex: TechCorp France"
                    required 
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Secteur d'activité <span class="required">*</span></label>
                    <select v-model="form.activity_sector_id" class="form-input" required>
                      <option value="">Sélectionner...</option>
                      <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                        {{ sector.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Taille de l'entreprise</label>
                    <select v-model="form.taille" class="form-input">
                      <option value="">Sélectionner...</option>
                      <option value="1-10">1-10 employés</option>
                      <option value="11-50">11-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="201-500">201-500 employés</option>
                      <option value="500+">500+ employés</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ville</label>
                    <input 
                      v-model="form.ville" 
                      type="text" 
                      class="form-input" 
                      placeholder="Ex: Paris"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Pays</label>
                    <input 
                      v-model="form.pays" 
                      type="text" 
                      class="form-input" 
                      placeholder="Ex: France"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Site web</label>
                  <input 
                    v-model="form.site_web" 
                    type="url" 
                    class="form-input" 
                    placeholder="https://www.exemple.com"
                  />
                </div>

                <!-- Contact -->
                <div class="form-section-title">
                  <i class="fa-solid fa-user-tie"></i>
                  Contact principal
                </div>

                <div class="form-group">
                  <label class="form-label">Nom complet <span class="required">*</span></label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    class="form-input" 
                    placeholder="Ex: Jean Dupont"
                    required 
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Email professionnel <span class="required">*</span></label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    class="form-input" 
                    placeholder="contact@entreprise.com"
                    required 
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Téléphone</label>
                  <input 
                    v-model="form.telephone" 
                    type="tel" 
                    class="form-input" 
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Mot de passe <span class="required">*</span></label>
                  <input 
                    v-model="form.password" 
                    type="password" 
                    class="form-input" 
                    placeholder="Minimum 8 caractères"
                    required 
                    minlength="8"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Confirmer le mot de passe <span class="required">*</span></label>
                  <input 
                    v-model="form.password_confirmation" 
                    type="password" 
                    class="form-input" 
                    placeholder="Retapez votre mot de passe"
                    required 
                  />
                </div>

                <!-- Erreur -->
                <div v-if="error" class="form-error">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ error }}
                </div>

                <!-- Succès -->
                <div v-if="success" class="form-success">
                  <i class="fa-solid fa-check-circle"></i>
                  {{ success }}
                </div>

                <!-- Submit -->
                <button 
                  type="submit" 
                  class="btn btn--blue btn--lg btn--block"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner"></span>
                  <i v-else class="fa-solid fa-rocket"></i>
                  {{ loading ? 'Création en cours...' : 'Créer mon compte gratuitement' }}
                </button>

                <p class="form-note">
                  En créant un compte, vous acceptez nos 
                  <router-link to="/legal/terms-and-conditions">conditions d'utilisation</router-link> et notre 
                  <router-link to="/legal/privacy-policy">politique de confidentialité</router-link>.
                </p>
              </form>
            </div>
          </div>

          <!-- CTA Rappel -->
          <div class="cta-section">
            <div class="cta-card">
              <div class="cta-icon">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
              <h3 class="cta-title">Besoin d'aide pour démarrer ?</h3>
              <p class="cta-text">
                Notre équipe est là pour vous accompagner dans votre recrutement. Laissez-nous vos coordonnées et nous vous rappelons sous 24h.
              </p>

              <form @submit.prevent="handleCallback" class="callback-form">
                <div class="form-group">
                  <input 
                    v-model="callbackForm.name" 
                    type="text" 
                    class="form-input" 
                    placeholder="Votre nom"
                    required 
                  />
                </div>

                <div class="form-group">
                  <input 
                    v-model="callbackForm.email" 
                    type="email" 
                    class="form-input" 
                    placeholder="Votre email"
                    required 
                  />
                </div>

                <div class="form-group">
                  <input 
                    v-model="callbackForm.phone" 
                    type="tel" 
                    class="form-input" 
                    placeholder="Votre téléphone"
                    required 
                  />
                </div>

                <div class="form-group">
                  <textarea 
                    v-model="callbackForm.message" 
                    class="form-textarea" 
                    placeholder="Votre message (optionnel)"
                    rows="3"
                  ></textarea>
                </div>

                <div v-if="callbackError" class="form-error">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  {{ callbackError }}
                </div>

                <div v-if="callbackSuccess" class="form-success">
                  <i class="fa-solid fa-check-circle"></i>
                  {{ callbackSuccess }}
                </div>

                <button 
                  type="submit" 
                  class="btn btn--orange btn--lg btn--block"
                  :disabled="callbackLoading"
                >
                  <span v-if="callbackLoading" class="spinner"></span>
                  <i v-else class="fa-solid fa-phone"></i>
                  {{ callbackLoading ? 'Envoi en cours...' : 'Demander à être rappelé' }}
                </button>
              </form>
            </div>

            <!-- Avantages rapides -->
            <div class="benefits-list">
              <div class="benefit-item">
                <i class="fa-solid fa-check-circle"></i>
                <span>Inscription 100% gratuite</span>
              </div>
              <div class="benefit-item">
                <i class="fa-solid fa-check-circle"></i>
                <span>Accès immédiat aux talents</span>
              </div>
              <div class="benefit-item">
                <i class="fa-solid fa-check-circle"></i>
                <span>Support dédié</span>
              </div>
              <div class="benefit-item">
                <i class="fa-solid fa-check-circle"></i>
                <span>Aucune carte bancaire requise</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const router = useRouter()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Formulaire d'inscription
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  nom: '',
  activity_sector_id: '',
  taille: '',
  ville: '',
  pays: '',
  site_web: '',
  telephone: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const sectors = ref([])

// Formulaire de rappel
const callbackForm = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const callbackLoading = ref(false)
const callbackError = ref('')
const callbackSuccess = ref('')

// Charger les secteurs d'activité
const loadSectors = async () => {
  try {
    const res = await axios.get(`${apiBase}/public/referentiels`)
    sectors.value = res.data.activity_sectors || []
  } catch (e) {
    console.error('Erreur chargement secteurs:', e)
  }
}

// Inscription entreprise
const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true

  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      role: 'entreprise',
      entreprise: {
        nom: form.value.nom,
        activity_sector_id: form.value.activity_sector_id,
        taille: form.value.taille,
        ville: form.value.ville,
        pays: form.value.pays,
        site_web: form.value.site_web,
        telephone: form.value.telephone
      }
    }

    await axios.post(`${apiBase}/register`, payload)
    
    success.value = 'Compte créé avec succès ! Redirection...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la création du compte'
  } finally {
    loading.value = false
  }
}

// Demande de rappel
const handleCallback = async () => {
  callbackError.value = ''
  callbackSuccess.value = ''
  callbackLoading.value = true

  try {
    // Simuler l'envoi (à remplacer par votre endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    callbackSuccess.value = 'Demande envoyée ! Nous vous recontacterons sous 24h.'
    
    // Reset form
    callbackForm.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  } catch (e) {
    callbackError.value = 'Erreur lors de l\'envoi de la demande'
  } finally {
    callbackLoading.value = false
  }
}

onMounted(() => {
  loadSectors()
})
</script>

<style scoped>
.company-landing { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* ══ HERO ══ */
.hero-section {
  position: relative;
  background: url('/images/Gemini_Generated_Image_gcxo7bgcxo7bgcxo.png') center/cover no-repeat;
  min-height: 50vh;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 80px 0 60px;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(4, 10, 93, 0.75);
}
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  text-align: center;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  background: rgba(255, 152, 0, 0.2);
  color: var(--orange);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: 50px;
  margin-bottom: 20px;
  border: 2px solid var(--orange);
}
.hero-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 16px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
.hero-subtitle {
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .hero-title { font-size: 28px; }
  .hero-subtitle { font-size: 16px; }
}

/* ══ CONTENU PRINCIPAL ══ */
.main-content {
  padding: 60px 0 80px;
}
.content-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
  .cta-section {
    order: -1;
  }
}

/* ══ FORMULAIRE ══ */
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.form-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border, #e2e8f0);
}
.form-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--navy);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.form-title i {
  color: var(--blue);
}
.form-subtitle {
  font-size: 15px;
  color: var(--body-text);
  margin: 0;
}

.form-section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  margin: 28px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 8px;
}
.form-section-title i {
  color: var(--blue);
}

.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 8px;
}
.required {
  color: var(--orange);
}
.form-input, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border, #e2e8f0);
  border-radius: 8px;
  font-size: 15px;
  color: var(--navy);
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--blue);
}
.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-error {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.form-success {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-note {
  text-align: center;
  font-size: 13px;
  color: var(--body-text);
  margin-top: 16px;
}
.form-note a {
  color: var(--blue);
  text-decoration: underline;
}

/* ══ CTA RAPPEL ══ */
.cta-section {
  position: sticky;
  top: 100px;
}
.cta-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}
.cta-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--orange), #ffb52e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
}
.cta-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--navy);
  text-align: center;
  margin: 0 0 12px;
}
.cta-text {
  font-size: 14px;
  color: var(--body-text);
  text-align: center;
  line-height: 1.6;
  margin: 0 0 24px;
}

.callback-form .form-group {
  margin-bottom: 16px;
}

/* ══ AVANTAGES ══ */
.benefits-list {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  font-size: 14px;
  color: var(--navy);
  font-weight: 500;
}
.benefit-item i {
  color: var(--blue);
  font-size: 18px;
  flex-shrink: 0;
}

/* ══ BOUTONS ══ */
.btn--block {
  width: 100%;
  display: block;
  text-align: center;
}
.btn--lg {
  padding: 14px 32px;
  font-size: 16px;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
