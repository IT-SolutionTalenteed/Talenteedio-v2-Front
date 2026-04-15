<template>
  <div class="corporate-landing">
    <!-- ══ MINI HERO ══ -->
    <section class="corp-hero">
      <div class="container">
        <div class="corp-hero-content">
          <div class="corp-event-badge">
            <i class="fa-solid fa-building"></i>
            Africa Talent Summit — 5 &amp; 6 Novembre 2026
          </div>
          <h1 class="corp-hero-title">
            Accédez aux talents que<br>
            <em>votre croissance exige</em>
          </h1>
          <p class="corp-hero-desc">
            Rencontrez, les 5 et 6 novembre 2026, 2&nbsp;000 profils hautement qualifiés, présélectionnés pour répondre aux besoins réels des entreprises opérant en Afrique.
          </p>
        </div>
      </div>
    </section>

    <!-- ══ LOGO CAROUSEL ══ -->
    <div class="logo-carousel-wrap">
      <div class="logo-track">
        <div v-for="(logo, index) in duplicatedLogos" :key="index" class="logo-item">
          <span :class="['logo-text', logo.class]" v-html="logo.text"></span>
        </div>
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
                  Rejoindre le Summit
                </h2>
                <p class="form-subtitle">Accédez aux meilleurs talents d'Afrique et de la diaspora</p>
              </div>

              <form @submit.prevent="handleSubmit" novalidate>

                <div class="form-section-title">
                  <i class="fa-solid fa-user-tie"></i>
                  Contact principal
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input v-model="formData.nom" type="text" class="form-input" placeholder="Ex : Dupont" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Prénom</label>
                    <input v-model="formData.prenom" type="text" class="form-input" placeholder="Ex : Jean">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email professionnel <span class="required">*</span></label>
                  <input v-model="formData.email" type="email" class="form-input" placeholder="contact@entreprise.com" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Téléphone <span class="required">*</span></label>
                  <input v-model="formData.telephone" type="tel" class="form-input" placeholder="Ex : +352 691 000 000" required>
                </div>

                <div class="form-section-title">
                  <i class="fa-solid fa-building"></i>
                  Informations entreprise
                </div>

                <div class="form-group">
                  <label class="form-label">Nom de l'entreprise <span class="required">*</span></label>
                  <input v-model="formData.entreprise" type="text" class="form-input" placeholder="Ex : TechCorp Africa" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Secteur d'activité <span class="required">*</span></label>
                    <select v-model="formData.secteur" class="form-input" required>
                      <option value="">Sélectionner...</option>
                      <option v-for="secteur in secteurs" :key="secteur">{{ secteur }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Taille de l'entreprise <span class="required">*</span></label>
                    <select v-model="formData.taille" class="form-input" required>
                      <option value="">Sélectionner...</option>
                      <option v-for="taille in tailles" :key="taille">{{ taille }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ville</label>
                    <input v-model="formData.ville" type="text" class="form-input" placeholder="Ex : Abidjan">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Pays</label>
                    <select v-model="formData.pays" class="form-input">
                      <option value="">Sélectionner...</option>
                      <optgroup v-for="region in paysParRegion" :key="region.label" :label="region.label">
                        <option v-for="pays in region.pays" :key="pays">{{ pays }}</option>
                      </optgroup>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>

                <div v-if="error" class="form-error visible">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>{{ error }}</span>
                </div>

                <button type="submit" class="btn btn--orange btn--lg btn--block" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner"></span>
                  <template v-else>
                    <i class="fa-solid fa-handshake"></i>
                    Devenir partenaire
                  </template>
                </button>

                <p class="form-note">
                  En soumettant ce formulaire, vous acceptez nos
                  <a href="/legal/terms-and-conditions">conditions d'utilisation</a> et notre
                  <a href="/legal/privacy-policy">politique de confidentialité</a>.
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
              <h3 class="cta-title">Réserver un appel</h3>
              <p class="cta-text">
                Notre équipe est disponible pour vous présenter les opportunités du Summit et construire votre stratégie de recrutement.
              </p>
              <a href="https://calendly.com" target="_blank" rel="noopener"
                class="btn btn--orange btn--lg btn--block">
                <i class="fa-solid fa-calendar-check"></i>
                Réserver un créneau
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
            Africa Talent Summit Luxembourg
          </span>

          <h2 style="margin-top:16px">
            Le rendez-vous des <em>talents et des entreprises</em><br>
            qui bâtissent l'Afrique de demain
          </h2>

          <p>
            Les 5 et 6 novembre 2026, Luxembourg accueille la première édition de l'Africa Talent Summit — deux jours d'échanges, d'entretiens et de connexions entre les entreprises les plus ambitieuses d'Afrique et les talents de la diaspora.
          </p>

          <div class="event-kpis">
            <div v-for="kpi in kpis" :key="kpi.label" class="event-kpi">
              <span class="event-kpi-number">{{ kpi.number }}</span>
              <span class="event-kpi-label">{{ kpi.label }}</span>
            </div>
          </div>

          <a href="#contact-form" class="btn btn--orange btn--lg" style="margin-top:8px">
            <i class="fa-solid fa-handshake"></i>
            Devenir partenaire
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'CorporateLanding',
  data() {
    return {
      formData: {
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        entreprise: '',
        secteur: '',
        taille: '',
        ville: '',
        pays: ''
      },
      error: '',
      isSubmitting: false,
      logos: [
        { text: 'SOCIÉTÉ<br>GÉNÉRALE', class: 'logo-text--sm' },
        { text: 'Spotify', class: '' },
        { text: 'vodafone', class: '' },
        { text: 'American Airlines', class: '' },
        { text: 'duolingo', class: 'logo-text--bold' },
        { text: 'EY', class: 'logo-text--light' },
        { text: 'Ford', class: 'logo-text--border' },
        { text: 'Infosys', class: '' },
        { text: 'mercado<br>libre', class: 'logo-text--sm' }
      ],
      secteurs: [
        'Banque / Finance',
        'Assurance',
        'Technologie / IT',
        'Santé',
        'Industrie',
        'Commerce / Distribution',
        'BTP / Immobilier',
        'Énergie / Mines',
        'Agriculture / Agroalimentaire',
        'Télécommunications',
        'Consulting / Conseil',
        'Éducation / Formation',
        'Transport / Logistique',
        'Autre'
      ],
      tailles: [
        '1–10 employés',
        '11–50 employés',
        '51–200 employés',
        '201–500 employés',
        '500+ employés'
      ],
      paysParRegion: [
        {
          label: 'Europe',
          pays: ['France', 'Luxembourg', 'Belgique', 'Suisse', 'Royaume-Uni', 'Allemagne', 'Pays-Bas']
        },
        {
          label: 'Afrique de l\'Ouest',
          pays: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Ghana', 'Nigeria', 'Togo', 'Bénin', 'Guinée', 'Niger']
        },
        {
          label: 'Afrique Centrale',
          pays: ['Cameroun', 'Congo (RDC)', 'Congo (Brazzaville)', 'Gabon']
        },
        {
          label: 'Afrique du Nord',
          pays: ['Maroc', 'Tunisie', 'Algérie']
        },
        {
          label: 'Afrique de l\'Est & Australe',
          pays: ['Kenya', 'Afrique du Sud', 'Rwanda', 'Éthiopie']
        }
      ],
      benefits: [
        { icon: 'fa-solid fa-users', text: '2 000+ talents présélectionnés' },
        { icon: 'fa-solid fa-brain', text: 'Matching IA par profil et poste' },
        { icon: 'fa-solid fa-calendar-days', text: 'Entretiens planifiés sur 2 jours' },
        { icon: 'fa-solid fa-globe-africa', text: 'Accès aux marchés panafricains' },
        { icon: 'fa-solid fa-headset', text: 'Accompagnement dédié' }
      ],
      kpis: [
        { number: '2 000+', label: 'Talents' },
        { number: '2', label: 'Jours' },
        { number: '30+', label: 'Pays représentés' },
        { number: '100%', label: 'Présélectionné' }
      ]
    }
  },
  computed: {
    duplicatedLogos() {
      return [...this.logos, ...this.logos]
    }
  },
  methods: {
    handleSubmit() {
      this.error = ''

      const { nom, email, telephone, entreprise, secteur, taille } = this.formData

      if (!nom || !email || !telephone || !entreprise || !secteur || !taille) {
        this.error = 'Veuillez remplir tous les champs obligatoires.'
        return
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(email)) {
        this.error = 'Adresse e-mail invalide.'
        return
      }

      this.isSubmitting = true

      // TODO: POST /api/public/ats/corporate/contact
      setTimeout(() => {
        this.$router.push('/corporate-confirm')
        // ou window.location.href = '/static/corporate-confirm.html'
      }, 1200)
    }
  }
}
</script>

<style scoped>
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

@media (prefers-reduced-motion: reduce) {
  .logo-track { animation: none; }
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
}

.logo-text {
  color: rgba(255,255,255,.45);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  white-space: nowrap;
  line-height: 1.2;
  text-align: center;
  font-family: inherit;
  transition: color .25s ease;
}

.logo-item:hover .logo-text { color: rgba(255,255,255,.85); }

.logo-text--sm    { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; }
.logo-text--bold  { font-weight: 900; font-size: 16px; letter-spacing: -0.3px; }
.logo-text--light { font-weight: 300; font-size: 18px; letter-spacing: 3px; }
.logo-text--border {
  border: 1.5px solid rgba(255,255,255,.3);
  border-radius: 3px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
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

@media (max-width: 600px) {
  .event-kpis { gap: 28px; }
  .event-kpi-number { font-size: 34px; }
}
</style>
