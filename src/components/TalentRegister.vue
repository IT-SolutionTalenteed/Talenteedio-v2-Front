<template>
  <div>
    <PublicNav />
    
    <!-- Mobile Fixed CTA -->
    <div class="mobile-cta-bar" v-show="showMobileCta">
      <a href="#register-section" class="btn btn--orange btn--lg">
        <i class="fa-solid fa-arrow-right"></i>
        Accéder aux opportunités
      </a>
      <p class="mobile-note">Sélection sur profil • Places limitées</p>
    </div>

    <!-- Hero Section -->
    <section class="ats-hero" ref="heroRef">
      <div class="ats-hero-content">
        <div class="ats-event-badge">
          <i class="fa-solid fa-calendar-days"></i>
          Africa Talent Summit — 5 &amp; 6 Novembre 2026
        </div>

        <h1 class="ats-hero-title">
          Construisez la carrière qui<br>
          façonnera <em>l'Afrique de demain</em>
        </h1>

        <p class="ats-hero-desc">
          Rencontrez, les 5 et 6 novembre 2026, des entreprises panafricaines ambitieuses et accédez à des opportunités concrètes, sélectionnées pour leur impact et leur exigence.
        </p>

        <div class="ats-hero-actions">
          <a href="#register-section" class="btn btn--orange">
            <i class="fa-solid fa-arrow-right"></i>
            Accéder aux opportunités
          </a>
          <span class="ats-selection-note">
            Sélection sur profil &bull; Places limitées
          </span>
        </div>
      </div>

      <div class="ats-scroll-hint">
        <i class="fa-solid fa-chevron-down"></i>
        <span>Découvrir</span>
      </div>
    </section>

    <!-- Logo Carousel -->
    <div v-if="carouselSlides.length" class="logo-carousel-wrap">
      <div class="logo-track">
        <!-- Set A -->
        <router-link
          v-for="(entreprise, i) in carouselSlides"
          :key="`a${i}`"
          to="/entreprises"
          class="logo-item"
        >
          <img v-if="entreprise.logo_url" :src="entreprise.logo_url" :alt="entreprise.nom" class="logo-img">
          <span v-else class="logo-initial">{{ entreprise.nom.charAt(0).toUpperCase() }}</span>
          <span class="logo-name">{{ entreprise.nom }}</span>
        </router-link>
        <!-- Set B — duplication pour boucle infinie (translateX -50%) -->
        <router-link
          v-for="(entreprise, i) in carouselSlides"
          :key="`b${i}`"
          to="/entreprises"
          class="logo-item"
          aria-hidden="true"
        >
          <img v-if="entreprise.logo_url" :src="entreprise.logo_url" :alt="entreprise.nom" class="logo-img">
          <span v-else class="logo-initial">{{ entreprise.nom.charAt(0).toUpperCase() }}</span>
          <span class="logo-name">{{ entreprise.nom }}</span>
        </router-link>
      </div>
    </div>

    <!-- Main Section -->
    <section class="ats-section">
      <div class="container">
        <!-- Intro -->
        <div class="ats-intro">
          <h2>L'Afrique n'a jamais eu autant besoin de talents comme le vôtre.</h2>
          <ul class="ats-bullets">
            <li><i class="fa-solid fa-circle-dot"></i> Accédez à des opportunités concrètes.</li>
            <li><i class="fa-solid fa-circle-dot"></i> Rencontrez des entreprises ambitieuses.</li>
            <li><i class="fa-solid fa-circle-dot"></i> Travaillez sur des projets qui comptent vraiment.</li>
          </ul>
          <p class="ats-soustitre">Ne regardez plus le futur se construire. Faites-en partie.</p>
        </div>

        <!-- Layout 2 colonnes -->
        <div class="content-layout" id="register-section">
          <!-- Formulaire -->
          <div>
            <div class="form-card">
              <div class="form-header">
                <h2 class="form-title">
                  <i class="fa-solid fa-user-check"></i>
                  Rejoindre le Summit
                </h2>
                <p class="form-subtitle">Complétez votre profil pour accéder aux opportunités</p>
              </div>

              <!-- Stepper -->
              <div class="stepper-nav">
                <div class="stepper-step" :class="{ active: currentStep === 1, done: currentStep > 1 }">
                  <div class="step-circle">
                    <template v-if="currentStep > 1">
                      <i class="fa-solid fa-check" style="font-size:13px"></i>
                    </template>
                    <template v-else>1</template>
                  </div>
                  <div class="step-info">
                    <strong>Contact</strong>
                    <small>Informations de base</small>
                  </div>
                </div>
                <div class="stepper-line" :class="{ done: currentStep > 1 }"></div>
                <div class="stepper-step" :class="{ active: currentStep === 2 }">
                  <div class="step-circle">
                    <i class="fa-solid fa-brain" style="font-size:13px"></i>
                  </div>
                  <div class="step-info">
                    <strong>Matching IA</strong>
                    <small>Optionnel — compléter plus tard</small>
                  </div>
                </div>
              </div>

              <!-- Step 1: Contact -->
              <div v-show="currentStep === 1">
                <div class="form-section-title">
                  <i class="fa-solid fa-address-card"></i>
                  Vos informations
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input v-model="form.nom" type="text" class="form-input" placeholder="Ex : Diallo">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Prénom</label>
                    <input v-model="form.prenom" type="text" class="form-input" placeholder="Ex : Aminata">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email <span class="required">*</span></label>
                  <input v-model="form.email" type="email" class="form-input" placeholder="votre@email.com">
                </div>

                <div class="form-group">
                  <label class="form-label">Secteur d'activité <span class="required">*</span></label>
                  <select v-model="form.secteur_souhaite_id" class="form-input">
                    <option value="">Sélectionner...</option>
                    <option v-for="sector in activitySectors" :key="sector.id" :value="sector.id">
                      {{ sector.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Années d'expérience <span class="required">*</span></label>
                  <select v-model="form.experience_id" class="form-input">
                    <option value="">Sélectionner...</option>
                    <option v-for="exp in experiences" :key="exp.id" :value="exp.id">
                      {{ exp.name }}
                    </option>
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ville</label>
                    <input v-model="form.ville" type="text" class="form-input" placeholder="Ex : Dakar">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Pays <span class="required">*</span></label>
                    <select v-model="form.pays" class="form-input">
                      <option value="">Sélectionner...</option>
                      <optgroup label="Europe">
                        <option>France</option>
                        <option>Luxembourg</option>
                        <option>Belgique</option>
                        <option>Suisse</option>
                        <option>Allemagne</option>
                        <option>Royaume-Uni</option>
                        <option>Pays-Bas</option>
                        <option>Espagne</option>
                        <option>Italie</option>
                        <option>Portugal</option>
                      </optgroup>
                      <optgroup label="Amérique du Nord">
                        <option>Canada</option>
                        <option>États-Unis</option>
                      </optgroup>
                      <optgroup label="Afrique de l'Ouest">
                        <option>Sénégal</option>
                        <option>Côte d'Ivoire</option>
                        <option>Mali</option>
                        <option>Burkina Faso</option>
                        <option>Guinée</option>
                        <option>Togo</option>
                        <option>Bénin</option>
                        <option>Niger</option>
                        <option>Ghana</option>
                        <option>Nigeria</option>
                        <option>Mauritanie</option>
                        <option>Cap-Vert</option>
                      </optgroup>
                      <optgroup label="Afrique Centrale">
                        <option>Cameroun</option>
                        <option>Congo (RDC)</option>
                        <option>Congo (Brazzaville)</option>
                        <option>Gabon</option>
                        <option>Tchad</option>
                      </optgroup>
                      <optgroup label="Afrique du Nord">
                        <option>Maroc</option>
                        <option>Tunisie</option>
                        <option>Algérie</option>
                      </optgroup>
                      <optgroup label="Afrique de l'Est & Australe">
                        <option>Kenya</option>
                        <option>Tanzanie</option>
                        <option>Éthiopie</option>
                        <option>Afrique du Sud</option>
                        <option>Rwanda</option>
                      </optgroup>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>

                <div v-if="step1Error" class="form-error visible">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>{{ step1Error }}</span>
                </div>

                <button type="button" class="btn btn--blue btn--lg btn--block" @click="goToStep2">
                  Suivant — Matching IA
                  <i class="fa-solid fa-arrow-right"></i>
                </button>

                <p class="form-note">
                  L'étape suivante est optionnelle. Vous pourrez la compléter depuis votre espace personnel.
                </p>
              </div>

              <!-- Step 2: Matching IA -->
              <div v-show="currentStep === 2">
                <div class="form-section-title">
                  <i class="fa-solid fa-brain"></i>
                  Matching Intelligent
                </div>
                <p style="font-size:14px;color:var(--body-text);margin:0 0 24px;line-height:1.6">
                  Maximisez vos chances d'obtenir des entretiens grâce à notre matching intelligent.
                  <strong style="color:var(--navy)">Optionnel — vous pourrez le compléter plus tard.</strong>
                </p>

                <div class="form-group">
                  <label class="form-label">
                    CV
                    <small style="font-weight:400;color:var(--body-text)">&nbsp;— PDF, Word, max 5 Mo</small>
                  </label>
                  <input @change="handleFileUpload" type="file" class="form-input" accept=".pdf,.doc,.docx" style="padding:10px 12px">
                </div>

                <div class="form-group">
                  <label class="form-label">Poste souhaité</label>
                  <input v-model="form.poste" type="text" class="form-input" placeholder="Ex : Directeur Financier, Ingénieur Data…">
                </div>

                <div class="form-group">
                  <label class="form-label">Compétences clés</label>
                  <textarea v-model="form.competences" class="form-input form-textarea" rows="3"
                    placeholder="Ex : Python, Finance d'entreprise, Management d'équipes, Marketing digital…"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Pays souhaité de relocation</label>
                    <select v-model="form.pays_relocation" class="form-input">
                      <option value="">Indifférent</option>
                      <option>Sénégal</option>
                      <option>Côte d'Ivoire</option>
                      <option>Maroc</option>
                      <option>Tunisie</option>
                      <option>Cameroun</option>
                      <option>Mali</option>
                      <option>Burkina Faso</option>
                      <option>Ghana</option>
                      <option>Nigeria</option>
                      <option>Kenya</option>
                      <option>Afrique du Sud</option>
                      <option>Gabon</option>
                      <option>Congo (RDC)</option>
                      <option>Rwanda</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Ville souhaitée de relocation</label>
                    <input v-model="form.ville_relocation" type="text" class="form-input" placeholder="Ex : Abidjan, Dakar…">
                  </div>
                </div>

                <div v-if="step2Error" class="form-error visible">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>{{ step2Error }}</span>
                </div>
                <div v-if="step2Success" class="form-success visible">
                  <i class="fa-solid fa-check-circle"></i>
                  Inscription enregistrée ! Redirection en cours…
                </div>

                <div style="display:flex;gap:12px;flex-wrap:wrap">
                  <button type="button" class="btn"
                    style="border:2px solid var(--border);color:var(--navy);background:#fff"
                    @click="goToStep1">
                    <i class="fa-solid fa-arrow-left"></i> Retour
                  </button>
                  <button type="button" class="btn btn--orange btn--lg" style="flex:1;justify-content:center"
                    :disabled="loading" @click="handleSubmit">
                    <span v-if="loading" class="spinner"></span>
                    <template v-else>
                      <i class="fa-solid fa-check"></i>
                      Soumettre mon inscription
                    </template>
                  </button>
                </div>

                <p class="form-note">
                  Vous pourrez compléter le matching IA depuis votre espace personnel après inscription.
                </p>
              </div>
            </div>
          </div>

          <!-- Sticky CTA -->
          <div class="sticky-col">
            <div class="sticky-cta-wrap">
              <div class="sticky-cta-card">
                <div class="sticky-icon">
                  <i class="fa-solid fa-rocket"></i>
                </div>
                <h3 class="sticky-title">Accéder aux opportunités</h3>
                <p class="sticky-text">
                  Des entreprises panafricaines ambitieuses vous attendent les <strong>5 et 6 novembre 2026</strong> à Luxembourg.
                </p>
                <a href="#register-section" class="btn btn--orange btn--lg btn--block">
                  <i class="fa-solid fa-arrow-right"></i>
                  Candidater maintenant
                </a>
                <p class="sticky-note">
                  <i class="fa-solid fa-filter"></i>
                  Sélection sur profil &bull; Places limitées
                </p>
                <hr class="sticky-divider">
                <div class="sticky-feature">
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Accès aux offres panafricaines</span>
                </div>
                <div class="sticky-feature">
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Matching IA avec les entreprises</span>
                </div>
                <div class="sticky-feature">
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Entretiens en direct — Luxembourg</span>
                </div>
                <div class="sticky-feature">
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Inscription 100 % gratuite</span>
                </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import api from '../services/api.js'

const router = useRouter()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const heroRef = ref(null)
const showMobileCta = ref(false)
const currentStep = ref(1)
const loading = ref(false)
const step1Error = ref('')
const step2Error = ref('')
const step2Success = ref(false)

// Données de référence chargées depuis l'API
const activitySectors = ref([])
const experiences = ref([])
const event = ref(null)

const form = ref({
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
  ville_relocation: ''
})

// ── Carrousel infini ───────────────────────────────────────
// Répète les logos jusqu'à avoir ≥10 items pour couvrir toute la largeur
const carouselSlides = computed(() => {
  if (!event.value?.entreprises?.length) return []
  const logos = event.value.entreprises
  const repeatCount = Math.max(1, Math.ceil(10 / logos.length))
  const result = []
  for (let i = 0; i < repeatCount; i++) result.push(...logos)
  return result
})

const handleScroll = () => {
  if (heroRef.value) {
    const heroBottom = heroRef.value.getBoundingClientRect().bottom
    showMobileCta.value = heroBottom < 0
  }
}

const goToStep2 = () => {
  step1Error.value = ''
  
  if (!form.value.nom || !form.value.email || !form.value.secteur_souhaite_id || !form.value.experience_id || !form.value.pays) {
    step1Error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }
  
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(form.value.email)) {
    step1Error.value = 'Adresse e-mail invalide.'
    return
  }
  
  currentStep.value = 2
  
  setTimeout(() => {
    document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

const goToStep1 = () => {
  currentStep.value = 1
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.cv = file
  }
}

const handleSubmit = async () => {
  step2Error.value = ''
  step2Success.value = false
  loading.value = true
  
  try {
    const formData = new FormData()
    formData.append('first_name', form.value.prenom || '')
    formData.append('last_name', form.value.nom)
    formData.append('email', form.value.email)
    formData.append('secteur_souhaite_id', form.value.secteur_souhaite_id)
    formData.append('experience_id', form.value.experience_id)
    formData.append('ville', form.value.ville || '')
    formData.append('pays', form.value.pays)
    
    if (form.value.cv) {
      formData.append('cv', form.value.cv)
    }
    if (form.value.poste) {
      formData.append('titre_poste', form.value.poste)
    }
    if (form.value.competences) {
      formData.append('competences', form.value.competences)
    }
    if (form.value.pays_relocation) {
      formData.append('pays_souhaites', JSON.stringify([form.value.pays_relocation]))
    }
    if (form.value.ville_relocation) {
      formData.append('villes_souhaitees', JSON.stringify([form.value.ville_relocation]))
    }
    
    const response = await api.post('/public/ats/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    step2Success.value = true
    
    setTimeout(() => {
      router.push({
        name: 'TalentConfirm',
        query: { email: form.value.email }
      })
    }, 800)
  } catch (err) {
    console.error('Erreur inscription:', err)
    step2Error.value = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Charger les référentiels depuis l'API
  try {
    const [sectorsRes, expRes, evRes] = await Promise.all([
      api.get('/public/ats/activity-sectors'),
      api.get('/public/ats/experiences'),
      api.get(`${apiBase}/public/featured-event`)
    ])
    
    activitySectors.value = sectorsRes.data.data
    experiences.value = expRes.data.data
    event.value = evRes.data
  } catch (err) {
    console.error('Erreur chargement référentiels:', err)
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '/static/assets/css/main.css';

/* Variables CSS */
:root {
  --navy: #041a57;
  --blue: #3a9bff;
  --orange: #f07c00;
  --light-bg: #f5f7fa;
  --body-text: #6b7280;
  --border: #e0e4ef;
}

/* Hero Section */
.ats-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #020830 0%, #040a5d 45%, #0d1a8a 75%, #040a5d 100%);
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.ats-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg, transparent, transparent 35px,
    rgba(255,255,255,.018) 35px, rgba(255,255,255,.018) 70px
  );
}

.ats-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, rgba(245,247,250,.15));
}

.ats-hero-content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  padding: 40px 24px;
}

.ats-event-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(240,124,0,.15);
  border: 1.5px solid rgba(240,124,0,.5);
  color: #f07c00;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  padding: 9px 22px;
  border-radius: 50px;
  margin-bottom: 32px;
}

.ats-hero-title {
  font-size: clamp(26px, 4.5vw, 52px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin: 0 0 22px;
  text-transform: uppercase;
}

.ats-hero-title em {
  font-style: normal;
  color: #f07c00;
}

.ats-hero-desc {
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.75;
  opacity: .88;
  margin: 0 auto 40px;
  max-width: 640px;
}

.ats-hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.ats-hero-actions .btn--orange {
  font-size: 17px;
  padding: 16px 40px;
  border-radius: 50px;
  box-shadow: 0 6px 24px rgba(240,124,0,.4);
}

.ats-selection-note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255,255,255,.6);
  font-weight: 500;
}

.ats-selection-note::before,
.ats-selection-note::after {
  content: '';
  display: block;
  width: 28px;
  height: 1px;
  background: rgba(255,255,255,.3);
}

.ats-scroll-hint {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,.3);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: hint-bounce 2.5s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* Logo Carousel */
.logo-carousel-wrap {
  background: linear-gradient(180deg, #040a5d 0%, #0d1a8a 100%);
  overflow: hidden;
  padding: 20px 0;
  position: relative;
  border-top: 1px solid rgba(255,255,255,.06);
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.logo-carousel-wrap::before,
.logo-carousel-wrap::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.logo-carousel-wrap::before { left: 0;  background: linear-gradient(to right, #040a5d, transparent); }
.logo-carousel-wrap::after  { right: 0; background: linear-gradient(to left,  #0d1a8a, transparent); }

.logo-track {
  display: flex;
  align-items: center;
  gap: 0;
  width: max-content;
  animation: marquee 32s linear infinite;
}

.logo-track:hover { animation-play-state: paused; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.logo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 44px;
  border-right: 1px solid rgba(255,255,255,.1);
  height: 40px;
  flex-shrink: 0;
  cursor: default;
  text-decoration: none;
  gap: 12px;
}

.logo-img {
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.6;
  transition: opacity .25s ease;
}

.logo-item:hover .logo-img {
  opacity: 1;
}

.logo-initial {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.logo-name {
  color: rgba(255,255,255,.7);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: color .25s ease;
}

.logo-item:hover .logo-name {
  color: rgba(255,255,255,.95);
}

/* Main Section */
.ats-section {
  padding: 80px 0 100px;
  background: var(--light-bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.ats-intro {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 64px;
}

.ats-intro h2 {
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 900;
  color: var(--navy);
  margin: 0 0 28px;
  line-height: 1.25;
}

.ats-bullets {
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ats-bullets li {
  font-size: 17px;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.ats-bullets li i {
  color: #f07c00;
  font-size: 14px;
  flex-shrink: 0;
}

.ats-soustitre {
  font-size: 19px;
  font-weight: 700;
  color: var(--navy);
  font-style: italic;
}

/* Layout */
.content-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;
}

/* Form Card */
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--navy);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-title i {
  color: var(--orange);
}

.form-subtitle {
  font-size: 14px;
  color: var(--body-text);
  margin: 0;
}

/* Stepper */
.stepper-nav {
  display: flex;
  align-items: center;
  margin-bottom: 36px;
}

.stepper-step {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.step-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: #fff;
  color: var(--body-text);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all .3s;
}

.step-info {
  display: flex;
  flex-direction: column;
}

.step-info strong {
  font-size: 14px;
  color: var(--body-text);
  font-weight: 700;
  transition: color .3s;
}

.step-info small {
  font-size: 11.5px;
  color: var(--body-text);
  opacity: .7;
}

.stepper-step.active .step-circle {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
}

.stepper-step.active .step-info strong {
  color: var(--navy);
}

.stepper-step.done .step-circle {
  background: #22c55e;
  border-color: #22c55e;
  color: #fff;
}

.stepper-line {
  height: 2px;
  flex: 0 0 48px;
  background: var(--border);
  margin-bottom: 8px;
  transition: background .35s;
}

.stepper-line.done {
  background: #22c55e;
}

/* Form Elements */
.form-section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-section-title i {
  color: var(--orange);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

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

.form-textarea {
  resize: vertical;
  min-height: 80px;
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

.btn--orange {
  background: linear-gradient(135deg, #f07c00 0%, #ff9500 100%);
  color: #fff;
}

.btn--orange:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(240, 124, 0, 0.3);
}

.btn--blue {
  background: linear-gradient(135deg, #041a57 0%, #00235a 100%);
  color: #fff;
}

.btn--blue:hover {
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

/* Sticky CTA */
.sticky-col {
  position: relative;
}

.sticky-cta-wrap {
  position: sticky;
  top: 100px;
}

.sticky-cta-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
  border-top: 4px solid #f07c00;
  text-align: center;
}

.sticky-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f07c00, #ffb52e);
  color: #fff;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.sticky-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--navy);
  margin: 0 0 10px;
}

.sticky-text {
  font-size: 14px;
  color: var(--body-text);
  margin: 0 0 22px;
  line-height: 1.6;
}

.sticky-note {
  margin-top: 14px;
  font-size: 12.5px;
  color: var(--body-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sticky-note i {
  color: #f07c00;
}

.sticky-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 20px 0;
}

.sticky-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 13.5px;
  color: #374151;
  text-align: left;
}

.sticky-feature i {
  color: #22c55e;
  font-size: 14px;
  flex-shrink: 0;
}

/* Mobile CTA Bar */
.mobile-cta-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid var(--border);
  padding: 12px 16px;
  z-index: 998;
  box-shadow: 0 -4px 20px rgba(0,0,0,.12);
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.mobile-note {
  text-align: center;
  font-size: 11px;
  color: var(--body-text);
}

/* Responsive */
@media (max-width: 900px) {
  .content-layout {
    grid-template-columns: 1fr !important;
  }
  .sticky-col {
    display: none;
  }
  .mobile-cta-bar {
    display: flex;
  }
  body {
    padding-bottom: 80px;
  }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .form-card {
    padding: 24px 20px;
  }
}
</style>
