<template>
  <div class="page-wrapper">
    <div class="company-landing">
      <PublicNav />

      <!-- ══ HERO ══ -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-particles">
          <span v-for="i in 12" :key="i" class="hero-particle"></span>
        </div>
        <div class="container">
          <div class="hero-content">
            <span class="hero-badge"><i class="fa-solid fa-crown"></i> Espace Recruteurs</span>
            <h1 class="hero-title">Recrutez les meilleurs<br><span class="hero-title-accent">talents africains</span></h1>
            <p class="hero-subtitle">Participez aux événements de speed recruiting, publiez vos offres et accédez au matching IA pour trouver les profils qui vous correspondent.</p>
            <div class="hero-stats">
              <div class="hero-stat"><span class="hero-stat-num">3 500+</span><span class="hero-stat-lbl">Talents inscrits</span></div>
              <div class="hero-stat-sep"></div>
              <div class="hero-stat"><span class="hero-stat-num">200+</span><span class="hero-stat-lbl">Entreprises partenaires</span></div>
              <div class="hero-stat-sep"></div>
              <div class="hero-stat"><span class="hero-stat-num">15 min</span><span class="hero-stat-lbl">Par entretien</span></div>
            </div>
          </div>
        </div>
        <div class="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f5f7fb"/>
          </svg>
        </div>
      </section>

      <!-- ══ PAGE CONFIRMATION (après inscription) ══ -->
      <section v-if="registered" class="confirm-section">
        <div class="container">
          <div class="confirm-card">
            <div class="confirm-icon">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h2 class="confirm-title">Demande envoyée avec succès !</h2>
            <p class="confirm-text">
              Votre dossier a bien été transmis à l'équipe Talenteed.<br>
              Notre équipe va examiner vos informations et vous contactera <strong>dans les plus brefs délais</strong>.
            </p>
            <div class="confirm-info-block">
              <div class="confirm-info-row">
                <i class="fa-regular fa-envelope"></i>
                <span>Un e-mail de confirmation vient d'être envoyé à <strong>{{ form.email }}</strong></span>
              </div>
              <div class="confirm-info-row">
                <i class="fa-regular fa-clock"></i>
                <span>Délai de traitement habituel : <strong>24 à 48 heures ouvrées</strong></span>
              </div>
              <div class="confirm-info-row">
                <i class="fa-solid fa-bell"></i>
                <span>Vous recevrez un e-mail dès que votre compte sera activé</span>
              </div>
            </div>
            <router-link to="/" class="btn btn--navy btn--lg">
              <i class="fa-solid fa-house"></i> Retour à l'accueil
            </router-link>
          </div>
        </div>
      </section>

      <!-- ══ CONTENU PRINCIPAL ══ -->
      <section v-else class="main-content">
        <div class="container">

          <!-- ── Trust bar ── -->
          <div class="trust-bar">
            <div class="trust-item"><i class="fa-solid fa-shield-halved"></i> Données sécurisées</div>
            <div class="trust-sep"></div>
            <div class="trust-item"><i class="fa-solid fa-headset"></i> Support dédié</div>
            <div class="trust-sep"></div>
            <div class="trust-item"><i class="fa-solid fa-bolt"></i> Accès rapide après validation</div>
            <div class="trust-sep"></div>
            <div class="trust-item"><i class="fa-solid fa-handshake"></i> Sans engagement</div>
          </div>

          <div class="content-layout">

            <!-- ── Formulaire d'inscription ── -->
            <div class="form-section">
              <div class="form-card">
                <div class="form-card-header">
                  <div class="form-card-icon"><i class="fa-solid fa-building"></i></div>
                  <div>
                    <h2 class="form-card-title">Créer votre espace recruteur</h2>
                    <p class="form-card-subtitle">Remplissez le formulaire — notre équipe valide votre compte sous 24h</p>
                  </div>
                </div>

                <form @submit.prevent="handleRegister" class="register-form" novalidate>

                  <!-- ── Bloc entreprise ── -->
                  <div class="form-block">
                    <div class="form-block-label">
                      <span class="form-block-num">01</span>
                      <span>Informations sur votre entreprise</span>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nom de l'entreprise <span class="req">*</span></label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-building input-icon"></i>
                          <input v-model="form.nom" type="text" class="form-input" placeholder="Ex: TechCorp Madagascar" required />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Secteur d'activité <span class="req">*</span></label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-tags input-icon"></i>
                          <select v-model="form.activity_sector_id" class="form-input form-select" required>
                            <option value="">Sélectionner un secteur</option>
                            <option v-for="sector in sectors" :key="sector.id" :value="sector.id">{{ sector.name }}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Taille de l'entreprise</label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-users input-icon"></i>
                          <select v-model="form.taille" class="form-input form-select">
                            <option value="">Sélectionner</option>
                            <option value="1-10">1 – 10 employés</option>
                            <option value="11-50">11 – 50 employés</option>
                            <option value="51-200">51 – 200 employés</option>
                            <option value="201-500">201 – 500 employés</option>
                            <option value="500+">500+ employés</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Site web</label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-globe input-icon"></i>
                          <input v-model="form.site_web" type="url" class="form-input" placeholder="https://votre-entreprise.com" />
                        </div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Ville</label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-location-dot input-icon"></i>
                          <input v-model="form.ville" type="text" class="form-input" placeholder="Ex: Antananarivo" />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Pays</label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-flag input-icon"></i>
                          <input v-model="form.pays" type="text" class="form-input" placeholder="Ex: Madagascar" />
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Adresse</label>
                      <div class="input-wrap">
                        <i class="fa-solid fa-map-pin input-icon"></i>
                        <input v-model="form.adresse" type="text" class="form-input" placeholder="Ex: 12 Rue de la Paix, Antananarivo" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Présentation de l'entreprise</label>
                      <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="Décrivez votre entreprise, vos activités et votre culture…"></textarea>
                    </div>
                  </div>

                  <!-- ── Bloc contact ── -->
                  <div class="form-block">
                    <div class="form-block-label">
                      <span class="form-block-num">02</span>
                      <span>Contact référent</span>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nom complet <span class="req">*</span></label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-user input-icon"></i>
                          <input v-model="form.name" type="text" class="form-input" placeholder="Prénom Nom" required />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Poste / Fonction</label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-briefcase input-icon"></i>
                          <input v-model="form.poste" type="text" class="form-input" placeholder="Ex: DRH, CEO, Responsable RH" />
                        </div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">E-mail professionnel <span class="req">*</span></label>
                        <div class="input-wrap">
                          <i class="fa-regular fa-envelope input-icon"></i>
                          <input v-model="form.email" type="email" class="form-input" placeholder="contact@votre-entreprise.com" required />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Téléphone</label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-phone input-icon"></i>
                          <input v-model="form.telephone" type="tel" class="form-input" placeholder="+261 34 00 000 00" />
                        </div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Mot de passe <span class="req">*</span></label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-lock input-icon"></i>
                          <input :type="showPwd ? 'text' : 'password'" v-model="form.password" class="form-input" placeholder="Minimum 8 caractères" required minlength="8" />
                          <button type="button" class="input-eye" @click="showPwd = !showPwd" tabindex="-1">
                            <i :class="showPwd ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                          </button>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Confirmer le mot de passe <span class="req">*</span></label>
                        <div class="input-wrap">
                          <i class="fa-solid fa-lock input-icon"></i>
                          <input :type="showPwdConf ? 'text' : 'password'" v-model="form.password_confirmation" class="form-input" placeholder="Répétez le mot de passe" required />
                          <button type="button" class="input-eye" @click="showPwdConf = !showPwdConf" tabindex="-1">
                            <i :class="showPwdConf ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ── Bloc plans ── -->
                  <div class="form-block">
                    <div class="form-block-label">
                      <span class="form-block-num">03</span>
                      <span>Choisissez votre plan <span class="req">*</span></span>
                    </div>

                    <div v-if="plans.length" class="plans-grid">
                      <div
                        v-for="plan in plans"
                        :key="plan.id"
                        class="plan-card"
                        :class="{ 'plan-card--selected': form.plan_id === plan.id, 'plan-card--popular': isPlanPopular(plan) }"
                        @click="form.plan_id = plan.id"
                      >
                        <div v-if="isPlanPopular(plan)" class="plan-card__popular-badge">
                          <i class="fa-solid fa-star"></i> Populaire
                        </div>
                        <div class="plan-card__top">
                          <div class="plan-card__name">{{ plan.name }}</div>
                          <div class="plan-card__price">
                            <span class="plan-card__amount">{{ formatPlanPrice(plan.price) }}</span>
                            <span class="plan-card__period">/mois</span>
                          </div>
                        </div>
                        <p v-if="plan.description" class="plan-card__desc">{{ plan.description }}</p>
                        <ul class="plan-card__features">
                          <li :class="{ 'feat--unlimited': plan.max_offres === null }">
                            <i class="fa-solid fa-briefcase"></i>
                            <span v-if="plan.max_offres !== null">{{ plan.max_offres }} offre(s) max</span>
                            <span v-else>Offres illimitées</span>
                          </li>
                          <li :class="{ 'feat--unlimited': plan.max_articles === null }">
                            <i class="fa-solid fa-file-lines"></i>
                            <span v-if="plan.max_articles !== null">{{ plan.max_articles }} article(s) max</span>
                            <span v-else>Articles illimités</span>
                          </li>
                          <li :class="{ 'feat--unlimited': plan.max_evenements === null }">
                            <i class="fa-solid fa-calendar-check"></i>
                            <span v-if="plan.max_evenements !== null">{{ plan.max_evenements }} événement(s) max</span>
                            <span v-else>Événements illimités</span>
                          </li>
                          <li :class="{ 'feat--unlimited': plan.max_entretiens_par_evenement === null }">
                            <i class="fa-solid fa-handshake"></i>
                            <span v-if="plan.max_entretiens_par_evenement !== null">{{ plan.max_entretiens_par_evenement }} entretiens/événement</span>
                            <span v-else>Entretiens illimités</span>
                          </li>
                          <li :class="{ 'feat--unlimited': plan.max_candidatures_par_offre === null }">
                            <i class="fa-solid fa-inbox"></i>
                            <span v-if="plan.max_candidatures_par_offre !== null">{{ plan.max_candidatures_par_offre }} candidatures/offre</span>
                            <span v-else>Candidatures illimitées</span>
                          </li>
                        </ul>
                        <div class="plan-card__select-indicator">
                          <i v-if="form.plan_id === plan.id" class="fa-solid fa-circle-check"></i>
                          <i v-else class="fa-regular fa-circle"></i>
                          <span>{{ form.plan_id === plan.id ? 'Sélectionné' : 'Choisir ce plan' }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="plans-loading">
                      <span class="spinner-blue"></span> Chargement des plans…
                    </div>
                  </div>

                  <!-- ── Alertes ── -->
                  <div v-if="error" class="form-alert form-alert--error">
                    <i class="fa-solid fa-triangle-exclamation"></i> {{ error }}
                  </div>

                  <!-- ── Submit ── -->
                  <button type="submit" class="btn-submit" :disabled="loading || !form.plan_id">
                    <span v-if="loading" class="spinner-white"></span>
                    <template v-else>
                      <i class="fa-solid fa-paper-plane"></i>
                      Soumettre ma demande d'inscription
                    </template>
                  </button>

                  <p class="form-legal">
                    En vous inscrivant, vous acceptez nos
                    <router-link to="/terms-and-conditions">Conditions générales</router-link> et notre
                    <router-link to="/privacy-policy">Politique de confidentialité</router-link>.
                  </p>
                </form>
              </div>
            </div>

            <!-- ── Colonne droite ── -->
            <div class="side-column">

              <!-- CTA Rappel -->
              <div class="side-card side-card--callback">
                <div class="side-card__icon"><i class="fa-solid fa-phone-volume"></i></div>
                <h3 class="side-card__title">Besoin d'un accompagnement ?</h3>
                <p class="side-card__text">Notre équipe vous rappelle et vous guide dans le choix de la formule adaptée à vos besoins.</p>

                <form @submit.prevent="handleCallback" class="callback-form">
                  <div class="input-wrap">
                    <i class="fa-solid fa-user input-icon"></i>
                    <input v-model="callbackForm.name" type="text" class="form-input" placeholder="Votre nom" required />
                  </div>
                  <div class="input-wrap">
                    <i class="fa-regular fa-envelope input-icon"></i>
                    <input v-model="callbackForm.email" type="email" class="form-input" placeholder="Votre e-mail" required />
                  </div>
                  <div class="input-wrap">
                    <i class="fa-solid fa-phone input-icon"></i>
                    <input v-model="callbackForm.phone" type="tel" class="form-input" placeholder="Votre téléphone" required />
                  </div>
                  <div class="input-wrap">
                    <textarea v-model="callbackForm.message" class="form-textarea" placeholder="Votre message (optionnel)" rows="3"></textarea>
                  </div>
                  <div v-if="callbackError" class="form-alert form-alert--error" style="margin-bottom:12px;">
                    <i class="fa-solid fa-triangle-exclamation"></i> {{ callbackError }}
                  </div>
                  <div v-if="callbackSuccess" class="form-alert form-alert--success" style="margin-bottom:12px;">
                    <i class="fa-solid fa-check-circle"></i> {{ callbackSuccess }}
                  </div>
                  <button type="submit" class="btn-callback" :disabled="callbackLoading">
                    <span v-if="callbackLoading" class="spinner-white"></span>
                    <template v-else><i class="fa-solid fa-phone"></i> Me faire rappeler</template>
                  </button>
                </form>
              </div>

              <!-- Avantages -->
              <div class="side-card side-card--benefits">
                <h3 class="side-card__title side-card__title--small">Pourquoi Talenteed ?</h3>
                <div class="benefit-item">
                  <div class="benefit-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                  <div><strong>Matching IA</strong><p>Notre IA analyse les profils et vos offres pour vous proposer les candidats les plus pertinents.</p></div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon"><i class="fa-solid fa-calendar-check"></i></div>
                  <div><strong>Speed recruiting</strong><p>Rencontrez 15+ talents en une journée lors de nos événements speed recruiting.</p></div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon"><i class="fa-solid fa-chart-line"></i></div>
                  <div><strong>Dashboard recruteur</strong><p>Gérez vos offres, candidatures et entretiens depuis un seul espace centralisé.</p></div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon"><i class="fa-solid fa-shield-halved"></i></div>
                  <div><strong>Compte vérifié</strong><p>Chaque compte entreprise est validé par notre équipe pour garantir la qualité des échanges.</p></div>
                </div>
              </div>

              <!-- Déjà inscrit -->
              <div class="side-card side-card--login">
                <p>Vous avez déjà un compte ?</p>
                <router-link to="/login" class="btn-login-link">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i> Se connecter
                </router-link>
              </div>

            </div>
          </div>
        </div>
      </section>

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
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  nom: '',
  description: '',
  adresse: '',
  activity_sector_id: '',
  plan_id: null,
  taille: '',
  ville: '',
  pays: '',
  site_web: '',
  telephone: '',
  poste: '',
})

const loading    = ref(false)
const error      = ref('')
const registered = ref(false)
const showPwd    = ref(false)
const showPwdConf = ref(false)
const sectors    = ref([])
const plans      = ref([])

const callbackForm    = ref({ name: '', email: '', phone: '', message: '' })
const callbackLoading = ref(false)
const callbackError   = ref('')
const callbackSuccess = ref('')

const formatPlanPrice = (price) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)

const isPlanPopular = (plan) => plan.name?.toLowerCase() === 'business'

const loadReferentiels = async () => {
  try {
    const [refRes, plansRes] = await Promise.all([
      axios.get(`${apiBase}/public/referentiels`),
      axios.get(`${apiBase}/plans`),
    ])
    sectors.value = refRes.data.activity_sectors || []
    plans.value   = (plansRes.data || []).filter(p => p.is_active)
  } catch (e) {
    console.error('Erreur chargement référentiels:', e)
  }
}

const handleRegister = async () => {
  error.value = ''

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  if (!form.value.plan_id) {
    error.value = 'Veuillez sélectionner un plan.'
    return
  }

  loading.value = true
  try {
    await axios.post(`${apiBase}/register`, {
      name:                  form.value.name,
      email:                 form.value.email,
      password:              form.value.password,
      password_confirmation: form.value.password_confirmation,
      role:                  'entreprise',
      company_name:          form.value.nom,
      company_description:   form.value.description || undefined,
      company_address:       form.value.adresse || undefined,
      company_size:          form.value.taille || undefined,
      company_poste:         form.value.poste || undefined,
      activity_sector_id:    form.value.activity_sector_id || undefined,
      plan_id:               form.value.plan_id,
      company_city:          form.value.ville || undefined,
      company_country:       form.value.pays || undefined,
      company_website:       form.value.site_web || undefined,
      company_phone:         form.value.telephone || undefined,
    })
    registered.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    const data = e.response?.data
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      error.value = Array.isArray(first) ? first[0] : first
    } else {
      error.value = data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}

const handleCallback = async () => {
  callbackError.value   = ''
  callbackSuccess.value = ''
  callbackLoading.value = true
  try {
    const res = await axios.post(`${apiBase}/public/callback`, callbackForm.value)
    callbackSuccess.value = res.data.message || 'Votre demande a bien été envoyée !'
    callbackForm.value = { name: '', email: '', phone: '', message: '' }
  } catch (e) {
    callbackError.value = e.response?.data?.message || 'Erreur lors de l\'envoi. Veuillez réessayer.'
  } finally {
    callbackLoading.value = false
  }
}

onMounted(loadReferentiels)
</script>

<style scoped>
/* ════════════════ VARIABLES ════════════════ */
:root {
  --navy:   #00235a;
  --blue:   #3a9bff;
  --orange: #f29f1f;
  --border: #e2e8f0;
}

.company-landing { background: #f5f7fb; min-height: 100vh; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* ════════════════ HERO ════════════════ */
.hero-section {
  position: relative;
  background: url('/images/Gemini_Generated_Image_gcxo7bgcxo7bgcxo.png') center/cover no-repeat;
  min-height: 520px;
  display: flex;
  align-items: center;
  padding: 100px 0 80px;
  overflow: hidden;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,35,90,.88) 0%, rgba(0,35,90,.70) 60%, rgba(58,155,255,.50) 100%);
}
.hero-particles {
  position: absolute; inset: 0; pointer-events: none;
}
.hero-particle {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,.15);
  animation: float-particle 6s ease-in-out infinite;
}
.hero-particle:nth-child(1)  { top:15%; left:10%; animation-delay:0s; width:6px; height:6px; }
.hero-particle:nth-child(2)  { top:30%; left:25%; animation-delay:.8s; }
.hero-particle:nth-child(3)  { top:60%; left:15%; animation-delay:1.4s; width:3px; height:3px; }
.hero-particle:nth-child(4)  { top:20%; right:20%; animation-delay:.3s; width:5px; height:5px; }
.hero-particle:nth-child(5)  { top:70%; right:30%; animation-delay:1.9s; }
.hero-particle:nth-child(6)  { top:45%; left:50%; animation-delay:2.4s; width:3px; height:3px; }
.hero-particle:nth-child(7)  { top:80%; left:60%; animation-delay:.6s; width:6px; height:6px; }
.hero-particle:nth-child(8)  { top:10%; right:40%; animation-delay:1.1s; }
.hero-particle:nth-child(9)  { top:55%; right:10%; animation-delay:3s; width:4px; height:4px; }
.hero-particle:nth-child(10) { top:35%; left:70%; animation-delay:1.7s; width:3px; height:3px; }
.hero-particle:nth-child(11) { top:90%; left:35%; animation-delay:2.2s; }
.hero-particle:nth-child(12) { top:5%;  left:80%; animation-delay:.5s; width:5px; height:5px; }
@keyframes float-particle {
  0%, 100% { transform: translateY(0) translateX(0); opacity: .15; }
  50%       { transform: translateY(-20px) translateX(8px); opacity: .4; }
}

.hero-content {
  position: relative; z-index: 1;
  max-width: 760px; margin: 0 auto; text-align: center; color: #fff;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(242,159,31,.18); color: #f29f1f;
  border: 1.5px solid rgba(242,159,31,.4);
  font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
  padding: 7px 18px; border-radius: 50px; margin-bottom: 24px;
}
.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 900; line-height: 1.15; margin: 0 0 18px;
  text-shadow: 0 2px 24px rgba(0,0,0,.3);
}
.hero-title-accent { color: #f29f1f; }
.hero-subtitle {
  font-size: 17px; line-height: 1.65; opacity: .9;
  max-width: 600px; margin: 0 auto 36px;
}
.hero-stats {
  display: flex; align-items: center; justify-content: center;
  gap: 0; flex-wrap: wrap; gap: 8px;
}
.hero-stat {
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 28px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
  border-radius: 12px; backdrop-filter: blur(8px);
}
.hero-stat-num { font-size: 24px; font-weight: 900; color: #f29f1f; line-height: 1; }
.hero-stat-lbl { font-size: 11px; color: rgba(255,255,255,.75); margin-top: 3px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.hero-stat-sep { width: 1px; height: 40px; background: rgba(255,255,255,.15); margin: 0 4px; }

.hero-wave {
  position: absolute; bottom: -1px; left: 0; right: 0;
}
.hero-wave svg { width: 100%; height: 80px; display: block; }

/* ════════════════ CONFIRMATION ════════════════ */
.confirm-section { padding: 80px 0; }
.confirm-card {
  max-width: 640px; margin: 0 auto;
  background: #fff; border-radius: 24px;
  padding: 56px 48px; text-align: center;
  box-shadow: 0 8px 48px rgba(0,35,90,.12);
}
.confirm-icon {
  width: 88px; height: 88px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex; align-items: center; justify-content: center;
  font-size: 40px; color: #fff; margin: 0 auto 28px;
  box-shadow: 0 8px 32px rgba(34,197,94,.35);
}
.confirm-title { font-size: 28px; font-weight: 800; color: #00235a; margin: 0 0 14px; }
.confirm-text { font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px; }
.confirm-info-block {
  background: #f8faff; border: 1.5px solid #e2e8f0; border-radius: 14px;
  padding: 24px; margin-bottom: 32px; text-align: left;
}
.confirm-info-row {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 10px 0; border-bottom: 1px solid #eef2f8;
  font-size: 14px; color: #475569; line-height: 1.5;
}
.confirm-info-row:last-child { border-bottom: none; }
.confirm-info-row i { color: #3a9bff; margin-top: 2px; flex-shrink: 0; width: 16px; text-align: center; }
.btn--navy {
  display: inline-flex; align-items: center; gap: 10px;
  background: #00235a; color: #fff;
  padding: 14px 32px; border-radius: 10px;
  font-size: 15px; font-weight: 700; text-decoration: none;
  transition: background .15s, transform .15s;
}
.btn--navy:hover { background: #001a45; transform: translateY(-1px); }

/* ════════════════ TRUST BAR ════════════════ */
.trust-bar {
  display: flex; align-items: center; justify-content: center;
  gap: 0; flex-wrap: wrap;
  background: #fff; border-radius: 14px; padding: 14px 24px;
  margin: -20px 0 40px; position: relative; z-index: 10;
  box-shadow: 0 4px 24px rgba(0,35,90,.08);
}
.trust-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: #374151;
  padding: 6px 20px;
}
.trust-item i { color: #3a9bff; }
.trust-sep { width: 1px; height: 24px; background: #e2e8f0; }

/* ════════════════ LAYOUT ════════════════ */
.main-content { padding: 0 0 80px; }
.content-layout {
  display: grid; grid-template-columns: 1fr 380px; gap: 36px; align-items: start;
}

/* ════════════════ FORM CARD ════════════════ */
.form-card {
  background: #fff; border-radius: 20px;
  box-shadow: 0 4px 32px rgba(0,35,90,.08);
  overflow: hidden;
}
.form-card-header {
  display: flex; align-items: center; gap: 18px;
  padding: 28px 36px; background: linear-gradient(135deg, #00235a, #0c3472);
  color: #fff;
}
.form-card-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: rgba(255,255,255,.15); border: 1.5px solid rgba(255,255,255,.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.form-card-title { font-size: 20px; font-weight: 800; margin: 0 0 4px; }
.form-card-subtitle { font-size: 13px; opacity: .75; margin: 0; }

.register-form { padding: 32px 36px 36px; }

/* ── Blocs numérotés ── */
.form-block { margin-bottom: 36px; }
.form-block-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 15px; font-weight: 700; color: #00235a;
  margin-bottom: 20px; padding-bottom: 10px;
  border-bottom: 2px solid #f0f4ff;
}
.form-block-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 8px;
  background: #00235a; color: #fff;
  font-size: 12px; font-weight: 800; flex-shrink: 0;
}

/* ── Champs ── */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 7px; }
.req { color: #f29f1f; }

.input-wrap {
  position: relative; display: flex; align-items: center;
}
.input-icon {
  position: absolute; left: 14px;
  font-size: 13px; color: #9ca3af; pointer-events: none; z-index: 1;
}
.input-eye {
  position: absolute; right: 12px;
  background: none; border: none; cursor: pointer;
  font-size: 13px; color: #9ca3af; padding: 4px;
  transition: color .15s;
}
.input-eye:hover { color: #3a9bff; }

.form-input {
  width: 100%; padding: 11px 14px 11px 38px;
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 14px; color: #1e293b;
  background: #fafbff;
  transition: border-color .2s, box-shadow .2s;
  box-sizing: border-box; outline: none;
  font-family: inherit;
}
.form-input:focus {
  border-color: #3a9bff;
  box-shadow: 0 0 0 3px rgba(58,155,255,.12);
  background: #fff;
}
.form-input::placeholder { color: #cbd5e1; }
.form-select { cursor: pointer; }
.form-textarea {
  width: 100%; padding: 11px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 14px; color: #1e293b; background: #fafbff;
  resize: vertical; font-family: inherit; outline: none;
  transition: border-color .2s, box-shadow .2s; box-sizing: border-box;
}
.form-textarea:focus {
  border-color: #3a9bff;
  box-shadow: 0 0 0 3px rgba(58,155,255,.12);
  background: #fff;
}

/* ════════════════ PLANS ════════════════ */
.plans-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 8px;
}
.plan-card {
  position: relative; border: 2px solid #e2e8f0; border-radius: 16px; padding: 22px 20px;
  cursor: pointer; background: #fff;
  transition: border-color .2s, box-shadow .2s, transform .15s;
}
.plan-card:hover {
  border-color: #3a9bff; box-shadow: 0 6px 24px rgba(0,35,90,.1); transform: translateY(-2px);
}
.plan-card--selected {
  border-color: #3a9bff;
  background: linear-gradient(145deg, #f0f5ff, #e8f0ff);
  box-shadow: 0 6px 28px rgba(58,155,255,.18);
}
.plan-card--popular { border-color: #f29f1f; }
.plan-card--popular.plan-card--selected { border-color: #f29f1f; }
.plan-card__popular-badge {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #f29f1f, #e08e0a);
  color: #fff; font-size: 11px; font-weight: 700;
  padding: 4px 14px; border-radius: 50px;
  display: flex; align-items: center; gap: 5px;
  white-space: nowrap;
}
.plan-card__top {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;
}
.plan-card__name { font-size: 16px; font-weight: 800; color: #00235a; }
.plan-card__price { text-align: right; }
.plan-card__amount { font-size: 20px; font-weight: 900; color: #3a9bff; display: block; }
.plan-card__period { font-size: 11px; color: #94a3b8; font-weight: 500; }
.plan-card--popular .plan-card__amount { color: #f29f1f; }
.plan-card__desc { font-size: 12px; color: #64748b; margin: 0 0 12px; line-height: 1.5; }
.plan-card__features { list-style: none; margin: 0 0 14px; padding: 0; }
.plan-card__features li {
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; color: #475569; padding: 4px 0;
  border-bottom: 1px solid #f1f5f9;
}
.plan-card__features li:last-child { border-bottom: none; }
.plan-card__features li i { color: #94a3b8; font-size: 11px; width: 14px; flex-shrink: 0; }
.plan-card__features li.feat--unlimited i { color: #3a9bff; }
.plan-card__features li.feat--unlimited { color: #00235a; font-weight: 600; }
.plan-card__select-indicator {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: #9ca3af; font-weight: 600;
  padding-top: 8px;
}
.plan-card--selected .plan-card__select-indicator { color: #3a9bff; }
.plan-card__select-indicator i { font-size: 16px; }

.plans-loading {
  display: flex; align-items: center; gap: 10px;
  color: #94a3b8; font-size: 14px; padding: 20px 0;
}

/* ════════════════ ALERTES ════════════════ */
.form-alert {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 13px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 16px;
}
.form-alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.form-alert--success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

/* ════════════════ SUBMIT ════════════════ */
.btn-submit {
  width: 100%; padding: 15px;
  background: linear-gradient(135deg, #00235a, #0c3472);
  color: #fff; border: none; border-radius: 10px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all .2s; font-family: inherit;
}
.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #001a45, #092a60);
  transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,35,90,.3);
}
.btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

.form-legal {
  text-align: center; font-size: 12px; color: #94a3b8; margin-top: 14px;
}
.form-legal a { color: #3a9bff; text-decoration: underline; }

/* ════════════════ SPINNERS ════════════════ */
.spinner-white, .spinner-blue {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: spin .6s linear infinite;
}
.spinner-blue { border-color: rgba(58,155,255,.3); border-top-color: #3a9bff; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ════════════════ COLONNE DROITE ════════════════ */
.side-column { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 100px; }
.side-card {
  background: #fff; border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,35,90,.08);
  padding: 28px;
}
.side-card--callback { border-top: 4px solid #f29f1f; }
.side-card__icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: linear-gradient(135deg, #f29f1f, #e08e0a);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 22px; margin-bottom: 16px;
}
.side-card__title { font-size: 17px; font-weight: 800; color: #00235a; margin: 0 0 8px; }
.side-card__title--small { font-size: 15px; margin-bottom: 20px; }
.side-card__text { font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 20px; }

.callback-form { display: flex; flex-direction: column; gap: 10px; }
.callback-form .input-wrap { position: relative; }
.callback-form .form-input { padding-left: 38px; }
.callback-form .form-textarea { padding: 10px 12px; }

.btn-callback {
  width: 100%; padding: 12px;
  background: linear-gradient(135deg, #f29f1f, #e08e0a);
  color: #fff; border: none; border-radius: 9px;
  font-size: 14px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s; font-family: inherit;
}
.btn-callback:hover:not(:disabled) {
  background: linear-gradient(135deg, #e08e0a, #c97a00);
  transform: translateY(-1px);
}
.btn-callback:disabled { opacity: .6; cursor: not-allowed; }

/* Avantages */
.side-card--benefits { border-top: 4px solid #3a9bff; }
.benefit-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 12px 0; border-bottom: 1px solid #f0f4ff;
}
.benefit-item:last-child { border-bottom: none; }
.benefit-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: #eef4ff; color: #3a9bff;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.benefit-item strong { display: block; font-size: 13px; font-weight: 700; color: #00235a; margin-bottom: 2px; }
.benefit-item p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }

/* Login link */
.side-card--login {
  text-align: center; padding: 20px 24px;
  background: #f8faff; border: 1.5px dashed #c7d7f0;
}
.side-card--login p { font-size: 13px; color: #64748b; margin: 0 0 12px; }
.btn-login-link {
  display: inline-flex; align-items: center; gap: 8px;
  color: #3a9bff; font-size: 14px; font-weight: 700;
  text-decoration: none; padding: 9px 20px; border-radius: 8px;
  border: 1.5px solid #3a9bff; transition: all .15s;
}
.btn-login-link:hover { background: #3a9bff; color: #fff; }

/* ════════════════ RESPONSIVE ════════════════ */
@media (max-width: 1024px) {
  .content-layout { grid-template-columns: 1fr; }
  .side-column { position: static; order: -1; }
}
@media (max-width: 768px) {
  .hero-stats { gap: 6px; }
  .hero-stat { padding: 10px 16px; }
  .hero-stat-sep { display: none; }
  .trust-bar { gap: 6px; }
  .trust-sep { display: none; }
  .form-card-header { flex-direction: column; gap: 12px; text-align: center; }
  .register-form { padding: 24px 20px 28px; }
}
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .plans-grid { grid-template-columns: 1fr; }
  .confirm-card { padding: 36px 24px; }
  .hero-title { font-size: 28px; }
}
</style>
