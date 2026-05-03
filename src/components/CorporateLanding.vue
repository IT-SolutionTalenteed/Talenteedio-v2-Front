<template>
  <div class="corporate-landing">
    <PublicNav />
    
    <!-- ══ MINI HERO ══ -->
    <section class="corp-hero">
      <div class="container">
        <div class="corp-hero-content">
          <div class="corp-event-badge">
            <i class="fa-solid fa-building"></i>
            {{ t('corporateLanding.hero.eventBadge') }}
          </div>
          <h1 class="corp-hero-title">
            {{ t('corporateLanding.hero.title') }}<br>
            <em>{{ t('corporateLanding.hero.titleEmphasis') }}</em>
          </h1>
          <p class="corp-hero-desc">
            {{ t('corporateLanding.hero.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- ══ LOGO CAROUSEL ══ -->
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

    <!-- ══ FORMULAIRE + CTA STICKY ══ -->
    <section class="corp-section" id="contact-form">
      <div class="container">
        <div class="content-layout">

          <!-- Formulaire de contact -->
          <div>
            <div class="form-card">
              <div class="form-header">
                <h2 class="form-title">
                  <i class="fa-solid fa-building-circle-check"></i>
                  {{ t('corporateLanding.form.title') }}
                </h2>
                <p class="form-subtitle">{{ t('corporateLanding.form.subtitle') }}</p>
              </div>

              <form @submit.prevent="handleSubmit" novalidate>

                <div class="form-section-title">
                  <i class="fa-solid fa-user-tie"></i>
                  {{ t('corporateLanding.form.contactSection') }}
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('corporateLanding.form.fields.lastName') }} <span class="required">*</span></label>
                    <input v-model="formData.nom" type="text" class="form-input" :placeholder="t('corporateLanding.form.placeholders.lastName')" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('corporateLanding.form.fields.firstName') }}</label>
                    <input v-model="formData.prenom" type="text" class="form-input" :placeholder="t('corporateLanding.form.placeholders.firstName')">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">{{ t('corporateLanding.form.fields.email') }} <span class="required">*</span></label>
                  <input v-model="formData.email" type="email" class="form-input" :placeholder="t('corporateLanding.form.placeholders.email')" required>
                </div>

                <div class="form-group">
                  <label class="form-label">{{ t('corporateLanding.form.fields.phone') }} <span class="required">*</span></label>
                  <input v-model="formData.telephone" type="tel" class="form-input" :placeholder="t('corporateLanding.form.placeholders.phone')" required>
                </div>

                <div class="form-section-title">
                  <i class="fa-solid fa-building"></i>
                  {{ t('corporateLanding.form.companySection') }}
                </div>

                <div class="form-group">
                  <label class="form-label">{{ t('corporateLanding.form.fields.company') }} <span class="required">*</span></label>
                  <input v-model="formData.entreprise" type="text" class="form-input" :placeholder="t('corporateLanding.form.placeholders.company')" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('corporateLanding.form.fields.sector') }} <span class="required">*</span></label>
                    <select v-model="formData.secteur_souhaite_id" class="form-input" required>
                      <option value="">{{ t('corporateLanding.form.placeholders.sector') }}</option>
                      <option v-for="secteur in activitySectors" :key="secteur.id" :value="secteur.id">
                        {{ secteur.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('corporateLanding.form.fields.size') }} <span class="required">*</span></label>
                    <select v-model="formData.taille" class="form-input" required>
                      <option value="">{{ t('corporateLanding.form.placeholders.size') }}</option>
                      <option v-for="taille in tailles" :key="taille">{{ taille }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ t('corporateLanding.form.fields.city') }}</label>
                    <input v-model="formData.ville" type="text" class="form-input" :placeholder="t('corporateLanding.form.placeholders.city')">
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('corporateLanding.form.fields.country') }}</label>
                    <select v-model="formData.pays" class="form-input">
                      <option value="">{{ t('corporateLanding.form.placeholders.country') }}</option>
                      <optgroup v-for="region in paysParRegion" :key="region.label" :label="region.label">
                        <option v-for="pays in region.pays" :key="pays">{{ pays }}</option>
                      </optgroup>
                      <option>{{ t('corporateLanding.regions.other') }}</option>
                    </select>
                  </div>
                </div>

                <div v-if="error" class="form-error visible">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>{{ error }}</span>
                </div>

                <!-- Consent Checkbox -->
                <div class="consent-checkbox-wrapper">
                  <label class="consent-checkbox">
                    <input type="checkbox" v-model="formData.consentAccepted" class="consent-input">
                    <span class="consent-text">
                      Je reconnais avoir lu <a href="/static/assets/talent_consent.pdf" target="_blank" rel="noopener noreferrer" class="consent-link">le consentement</a> et accepte de le signer électroniquement avec mon nom.
                    </span>
                  </label>
                </div>

                <button type="submit" class="btn btn--orange btn--lg btn--block" :disabled="isSubmitting || !formData.consentAccepted">
                  <span v-if="isSubmitting" class="spinner"></span>
                  <template v-else>
                    <i class="fa-solid fa-handshake"></i>
                    {{ t('corporateLanding.form.submit') }}
                  </template>
                </button>

                <p class="form-note">
                  {{ t('corporateLanding.form.note') }}
                  <a href="/legal/terms-and-conditions">{{ t('corporateLanding.form.terms') }}</a> {{ t('corporateLanding.form.and') }}
                  <a href="/legal/privacy-policy">{{ t('corporateLanding.form.privacy') }}</a>.
                </p>
              </form>
            </div>
          </div>

          <!-- ══ STICKY CTA DROITE ══ -->
          <div class="cta-section-sidebar">

            <div class="cta-card">
              <div class="cta-icon">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
              <h3 class="cta-title">{{ t('corporateLanding.cta.title') }}</h3>
              <p class="cta-text">
                {{ t('corporateLanding.cta.description') }}
              </p>
              <a href="https://calendly.com" target="_blank" rel="noopener"
                class="btn btn--orange btn--lg btn--block">
                <i class="fa-solid fa-calendar-check"></i>
                {{ t('corporateLanding.cta.button') }}
              </a>
            </div>

            <!-- Avantages -->
            <div class="benefits-list">
              <div v-for="benefit in benefits" :key="benefit.text" class="benefit-item">
                <i :class="benefit.icon"></i>
                <span>{{ benefit.text }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══ À PROPOS DE L'ÉVÉNEMENT ══ -->
    <section class="event-footer-section">
      <div class="container">
        <div class="event-footer-inner">

          <span class="section-badge" style="background:rgba(240,124,0,.2);color:#f07c00">
            {{ t('corporateLanding.eventFooter.badge') }}
          </span>

          <h2 style="margin-top:16px">
            {{ t('corporateLanding.eventFooter.title') }} <em>{{ t('corporateLanding.eventFooter.titleEmphasis') }}</em><br>
            {{ t('corporateLanding.eventFooter.titleEnd') }}
          </h2>

          <p>
            {{ t('corporateLanding.eventFooter.description') }}
          </p>

          <div class="event-kpis">
            <div v-for="kpi in kpis" :key="kpi.label" class="event-kpi">
              <span class="event-kpi-number">{{ kpi.number }}</span>
              <span class="event-kpi-label">{{ kpi.label }}</span>
            </div>
          </div>

          <a href="#contact-form" class="btn btn--orange btn--lg" style="margin-top:8px">
            <i class="fa-solid fa-handshake"></i>
            {{ t('corporateLanding.eventFooter.button') }}
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import api from '../services/api.js'

export default {
  name: 'CorporateLanding',
  components: {
    PublicNav,
    Footer
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      formData: {
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        entreprise: '',
        secteur_souhaite_id: '',
        taille: '',
        ville: '',
        pays: '',
        consentAccepted: false
      },
      error: '',
      isSubmitting: false,
      activitySectors: [],
      event: null
    }
  },
  computed: {
    tailles() {
      return [
        this.t('corporateLanding.sizes.1-10'),
        this.t('corporateLanding.sizes.11-50'),
        this.t('corporateLanding.sizes.51-200'),
        this.t('corporateLanding.sizes.201-500'),
        this.t('corporateLanding.sizes.500+')
      ]
    },
    paysParRegion() {
      return [
        {
          label: this.t('corporateLanding.regions.europe'),
          pays: ['France', 'Luxembourg', 'Belgique', 'Suisse', 'Royaume-Uni', 'Allemagne', 'Pays-Bas']
        },
        {
          label: this.t('corporateLanding.regions.westAfrica'),
          pays: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Ghana', 'Nigeria', 'Togo', 'Bénin', 'Guinée', 'Niger']
        },
        {
          label: this.t('corporateLanding.regions.centralAfrica'),
          pays: ['Cameroun', 'Congo (RDC)', 'Congo (Brazzaville)', 'Gabon']
        },
        {
          label: this.t('corporateLanding.regions.northAfrica'),
          pays: ['Maroc', 'Tunisie', 'Algérie']
        },
        {
          label: this.t('corporateLanding.regions.eastSouthAfrica'),
          pays: ['Kenya', 'Afrique du Sud', 'Rwanda', 'Éthiopie']
        }
      ]
    },
    benefits() {
      return [
        { icon: 'fa-solid fa-users', text: this.t('corporateLanding.benefits.talents') },
        { icon: 'fa-solid fa-brain', text: this.t('corporateLanding.benefits.matching') },
        { icon: 'fa-solid fa-calendar-days', text: this.t('corporateLanding.benefits.interviews') },
        { icon: 'fa-solid fa-globe-africa', text: this.t('corporateLanding.benefits.markets') },
        { icon: 'fa-solid fa-headset', text: this.t('corporateLanding.benefits.support') }
      ]
    },
    kpis() {
      return [
        { number: '2 000+', label: this.t('corporateLanding.eventFooter.kpis.talents') },
        { number: '2', label: this.t('corporateLanding.eventFooter.kpis.days') },
        { number: '30+', label: this.t('corporateLanding.eventFooter.kpis.countries') },
        { number: '100%', label: this.t('corporateLanding.eventFooter.kpis.preselected') }
      ]
    },
    carouselSlides() {
      if (!this.event?.entreprises?.length) return []
      const logos = this.event.entreprises
      const repeatCount = Math.max(1, Math.ceil(10 / logos.length))
      const result = []
      for (let i = 0; i < repeatCount; i++) result.push(...logos)
      return result
    }
  },
  async mounted() {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    
    try {
      const [sectorsRes, evRes] = await Promise.all([
        api.get('/public/ats/activity-sectors'),
        api.get(`${apiBase}/public/featured-event`)
      ])
      
      this.activitySectors = sectorsRes.data.data
      this.event = evRes.data
    } catch (err) {
      console.error('Erreur chargement données:', err)
    }
  },
  methods: {
    async handleSubmit() {
      this.error = ''

      const { nom, email, telephone, entreprise, secteur_souhaite_id, taille } = this.formData

      if (!nom || !email || !telephone || !entreprise || !secteur_souhaite_id || !taille) {
        this.error = this.t('corporateLanding.form.errors.required')
        return
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(email)) {
        this.error = this.t('corporateLanding.form.errors.invalidEmail')
        return
      }

      this.isSubmitting = true

      try {
        await api.post('/public/ats/corporate/register', {
          first_name: this.formData.prenom,
          last_name: this.formData.nom,
          email: this.formData.email,
          telephone: this.formData.telephone,
          entreprise: this.formData.entreprise,
          secteur_souhaite_id: this.formData.secteur_souhaite_id,
          taille_entreprise: this.formData.taille,
          ville: this.formData.ville,
          pays: this.formData.pays
        })

        this.$router.push({
          name: 'CorporateConfirm',
          query: { email: this.formData.email }
        })
      } catch (err) {
        console.error('Erreur inscription:', err)
        this.error = err.response?.data?.message || this.t('corporateLanding.form.errors.generic')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
@import '/static/assets/css/main.css';

/* ══ MINI HERO ══ */
.corp-hero {
  position: relative;
  background: linear-gradient(160deg, #020830 0%, #040a5d 50%, #0d1a8a 100%);
  color: #fff;
  padding: 48px 0 40px;
  text-align: center;
  overflow: hidden;
}

.corp-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg, transparent, transparent 35px,
    rgba(255,255,255,.015) 35px, rgba(255,255,255,.015) 70px
  );
}

.corp-hero-content { position: relative; z-index: 1; }

.corp-event-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(240,124,0,.15);
  border: 1.5px solid rgba(240,124,0,.4);
  color: #f07c00;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  padding: 7px 18px;
  border-radius: 50px;
  margin-bottom: 20px;
}

.corp-hero-title {
  font-size: clamp(22px, 3.5vw, 38px);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1.2;
  letter-spacing: -0.3px;
  margin: 0 0 14px;
}

.corp-hero-title em {
  font-style: normal;
  color: #f07c00;
}

.corp-hero-desc {
  font-size: clamp(14px, 1.8vw, 17px);
  line-height: 1.7;
  opacity: .85;
  margin: 0 auto;
  max-width: 680px;
}

/* ══ LOGO CAROUSEL ══ */
.logo-carousel-wrap {
  background: #fff;
  overflow: hidden;
  padding: 20px 0;
  position: relative;
  border-top: 1px solid #e8edf5;
  border-bottom: 1px solid #e8edf5;
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

.logo-carousel-wrap::before { left: 0;  background: linear-gradient(to right, #fff, transparent); }
.logo-carousel-wrap::after  { right: 0; background: linear-gradient(to left,  #fff, transparent); }

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

@media (prefers-reduced-motion: reduce) {
  .logo-track { animation: none; }
}

.logo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 100px;
  border-right: 1px solid #e8edf5;
  height: 100px;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-img {
  max-height: 44px;
  max-width: 120px;
  width: auto;
  object-fit: contain;
  opacity: 0.8;
  transition: opacity .2s;
}

.logo-item:hover .logo-img {
  opacity: 1;
}

.logo-initial {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f0f4ff;
  border: 1px solid #dce4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: var(--blue, #192bc2);
  flex-shrink: 0;
}

.logo-name {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  white-space: nowrap;
  text-align: center;
  transition: color .2s;
}

.logo-item:hover .logo-name {
  color: var(--navy, #040a5d);
}

/* ══ MAIN SECTION ══ */
.corp-section { padding: 60px 0 100px; background: var(--light-bg); }

/* ══ EVENT FOOTER SECTION ══ */
.event-footer-section {
  background: var(--navy);
  color: #fff;
  padding: 80px 0;
}

.event-footer-inner {
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.event-footer-section h2 {
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 900;
  margin: 0 0 20px;
  text-transform: uppercase;
}

.event-footer-section h2 em {
  color: #f07c00;
  font-style: normal;
}

.event-footer-section p {
  font-size: 16px;
  line-height: 1.8;
  opacity: .8;
  margin: 0 0 32px;
}

.event-kpis {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  margin: 40px 0;
}

.event-kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.event-kpi-number {
  font-size: 44px;
  font-weight: 900;
  color: #f07c00;
  line-height: 1;
}

.event-kpi-label {
  font-size: 13px;
  opacity: .7;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

/* ══ RESPONSIVE ══ */
@media (max-width: 960px) {
  .content-layout { grid-template-columns: 1fr !important; }
  .cta-section-sidebar { position: static !important; }
}

@media (max-width: 768px) {
  .logo-item {
    padding: 0 60px;
    height: 90px;
  }
  
  .logo-img {
    max-height: 36px;
    max-width: 100px;
  }
  
  .logo-initial {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .logo-name {
    font-size: 11px;
  }
}

@media (max-width: 600px) {
  .event-kpis { gap: 28px; }
  .event-kpi-number { font-size: 34px; }
}

/* Consent Checkbox */
.consent-checkbox-wrapper {
  margin: 20px 0;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.consent-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.consent-input {
  margin-top: 3px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.consent-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
}

.consent-link {
  color: var(--blue);
  text-decoration: underline;
  font-weight: 600;
}

.consent-link:hover {
  color: var(--orange);
}
</style>
