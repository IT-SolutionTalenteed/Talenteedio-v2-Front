<template>
  <div class="home-page">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <PublicNav />

    <!-- ══ HERO SECTION — Style moderne inspiré de zai.html ══ -->
    <section class="hero-modern">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="animate-on-scroll stagger-1">
              <span class="hero-badge">
                {{ eventDateRange }}
              </span>
            </div>
            
            <h1 class="hero-title animate-on-scroll stagger-2">
              <span v-if="event">{{ event.titre }}</span>
              <span v-else>
                {{ t('home.hero.defaultTitle') }}
                <span class="gradient-text">{{ t('home.hero.defaultLocation') }}</span>
              </span>
            </h1>

            <p class="hero-description animate-on-scroll stagger-3">
              <span v-if="event">{{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}</span>
              <span v-else>{{ t('home.hero.defaultDescription') }}</span>
            </p>

            <div class="hero-actions animate-on-scroll stagger-4">
              <router-link to="/register" class="btn-primary">
                {{ t('home.hero.subscribe') }}
              </router-link>
              <router-link to="/blog" class="btn-secondary">
                {{ t('home.hero.viewProgram') }}
              </router-link>
            </div>

            <!-- Countdown -->
            <div class="countdown-modern animate-on-scroll stagger-5">
              <div class="countdown-item">
                <div class="countdown-value">{{ cd.days }}</div>
                <div class="countdown-label">{{ t('home.hero.days') }}</div>
              </div>
              <div class="countdown-item">
                <div class="countdown-value">{{ cd.hours }}</div>
                <div class="countdown-label">{{ t('home.hero.hours') }}</div>
              </div>
              <div class="countdown-item">
                <div class="countdown-value">{{ cd.minutes }}</div>
                <div class="countdown-label">{{ t('home.hero.minutes') }}</div>
              </div>
              <div class="countdown-item">
                <div class="countdown-value">{{ cd.seconds }}</div>
                <div class="countdown-label">{{ t('home.hero.seconds') }}</div>
              </div>
            </div>
          </div>

          <div class="hero-visual animate-on-scroll stagger-6">
            <div class="hero-image-container">
              <div class="hero-image-bg" :style="heroStyle"></div>
              <div class="hero-stats-overlay">
                <div class="stat-item">
                  <div class="stat-number">5000+</div>
                  <div class="stat-label">{{ t('home.stats.participants') }}</div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <div class="stat-number">50+</div>
                  <div class="stat-label">{{ t('home.stats.countries') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator">
        <svg class="scroll-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>

    <!-- 2. SECTION ILS RECRUTENT — Entreprises Participantes ══ -->
    <section v-if="event && event.entreprises && event.entreprises.length" class="section-partners">
      <div class="container">
        <div class="partners-header animate-on-scroll">
          <span class="section-label">{{ t('home.partners.label') }}</span>
          <h2 class="section-title">{{ t('home.partners.title') }}</h2>
          <p class="section-description">{{ t('home.partners.description') }}</p>
        </div>
      </div>
      <!-- Carrousel infini pleine largeur — style logo-track -->
      <div class="logo-carousel-wrap">
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
      <div class="partners-cta animate-on-scroll">
        <router-link to="/entreprises" class="btn-primary">
          {{ t('home.partners.viewAll') }}
        </router-link>
      </div>
    </section>

    <!-- 3. AFFICHAGE DES 4 CARDS ══ -->
    <section class="section-quicklinks">
      <div class="container">
        <div class="quicklinks-grid">

          <router-link to="/annonces" class="ql-card animate-on-scroll">
            <div class="ql-icon"><i class="fa-solid fa-briefcase"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.findJob.title') }}</h3>
              <p>{{ t('home.quicklinks.findJob.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.findJob.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link :to="categories.length ? `/evenements/categorie/${categories[0].id}` : '/'" class="ql-card animate-on-scroll stagger-1">
            <div class="ql-icon ql-icon--orange"><i class="fa-solid fa-calendar-days"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.events.title') }}</h3>
              <p>{{ t('home.quicklinks.events.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.events.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link to="/blog" class="ql-card animate-on-scroll stagger-2">
            <div class="ql-icon ql-icon--green"><i class="fa-solid fa-newspaper"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.articles.title') }}</h3>
              <p>{{ t('home.quicklinks.articles.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.articles.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link :to="isLoggedIn && userRole === 'talent' ? '/talent' : '/login'" class="ql-card ql-card--featured animate-on-scroll stagger-3">
            <div class="ql-icon ql-icon--white"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.matching.title') }}</h3>
              <p>{{ t('home.quicklinks.matching.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.matching.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

        </div>
      </div>
    </section>


    <!-- 4. SECTION À PROPOS ══ -->
    <section class="section-about">
      <div class="container">
        <div class="about-grid">
          <div class="about-content animate-on-scroll">
            <span class="section-label">{{ t('home.about.label') }}</span>
            <h2 class="section-title">
              {{ t('home.about.title') }}
            </h2>
            <p class="section-description">
              {{ t('home.about.description1') }}
            </p>
            <p class="section-description">
              {{ t('home.about.description2') }}
            </p>

            <div class="feature-cards">
              <div class="feature-card">
                <div class="feature-icon feature-icon--orange">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                </div>
                <h3>{{ t('home.about.networking.title') }}</h3>
                <p>{{ t('home.about.networking.description') }}</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon feature-icon--blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3>{{ t('home.about.innovation.title') }}</h3>
                <p>{{ t('home.about.innovation.description') }}</p>
              </div>
            </div>
          </div>

          <div class="about-visual animate-on-scroll stagger-2">
            <div class="image-grid">
              <div class="image-column">
                <div class="image-item image-tall">
                  <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&q=80" 
                       alt="Networking event" loading="lazy">
                </div>
                <div class="image-item image-square">
                  <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80" 
                       alt="Speaker" loading="lazy">
                </div>
              </div>
              <div class="image-column image-column--offset">
                <div class="image-item image-square">
                  <img src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=500&q=80" 
                       alt="Workshop" loading="lazy">
                </div>
                <div class="image-item image-tall">
                  <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&q=80" 
                       alt="Panel discussion" loading="lazy">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. SECTION STATISTIQUES — 5 000+ Participants attendus ══ -->
    <section class="section-stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card animate-on-scroll">
            <div class="stat-number-large" data-count="5000">0</div>
            <div class="stat-description">{{ t('home.stats.participants') }}</div>
          </div>
          <div class="stat-card animate-on-scroll stagger-1">
            <div class="stat-number-large" data-count="120">0</div>
            <div class="stat-description">{{ t('home.stats.speakers') }}</div>
          </div>
          <div class="stat-card animate-on-scroll stagger-2">
            <div class="stat-number-large" data-count="50">0</div>
            <div class="stat-description">{{ t('home.stats.countries') }}</div>
          </div>
          <div class="stat-card animate-on-scroll stagger-3">
            <div class="stat-number-large" data-count="30">0</div>
            <div class="stat-description">{{ t('home.stats.sessions') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. SECTION CTA — Prêt à rejoindre le mouvement? ══ -->
    <section class="section-cta">
      <div class="container">
        <div class="cta-card animate-on-scroll">
          <div class="cta-content">
            <h2 class="cta-title">
              {{ t('home.cta.title') }}
            </h2>
            <p class="cta-description">
              {{ t('home.cta.description') }}
            </p>
            <div class="cta-actions">
              <router-link to="/register" class="btn-primary">
                {{ t('home.cta.earlyBird') }}
              </router-link>
              <router-link to="/entreprises" class="btn-secondary">
                {{ t('home.cta.becomePartner') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. SECTION ARTICLES ══ -->
    <section class="section-triple">
      <div class="container">
        <div class="triple-header animate-on-scroll">
          <span class="section-label">{{ t('home.triple.watermark') }}</span>
          <h2 class="section-title">{{ t('home.triple.title') }}</h2>
          <p class="section-description">{{ t('home.triple.description') }}</p>
        </div>
        <div class="triple-cards">
          <!-- Articles dynamiques (3 premiers) -->
          <template v-if="articles.length">
            <div v-for="(article, index) in articles.slice(0, 3)" :key="article.id" class="triple-card animate-on-scroll" :class="`stagger-${index + 1}`">
              <div class="triple-card-img">
                <img v-if="article.image_url" :src="article.image_url" :alt="article.title" loading="lazy">
                <div v-else class="triple-card-placeholder">
                  <i class="fa-solid fa-newspaper"></i>
                </div>
              </div>
              <div class="triple-card-body">
                <div class="article-date">{{ formatDate(article.created_at) }}</div>
                <h3>{{ article.title }}</h3>
                <p>{{ truncate(stripHtml(article.content), 120) }}</p>
                <router-link :to="`/blog/${article.id}`" class="article-link">
                  {{ t('home.triple.readMore') }} <i class="fa-solid fa-chevron-right"></i>
                </router-link>
              </div>
            </div>
          </template>
          <!-- Fallback statique si aucun article -->
          <template v-else>
            <div class="triple-card animate-on-scroll">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/staff-tech-accounting-discussion-office-development-feedback-budget-communication-business-project-group-collaboration-financial-firm-people-planning-with-team-scaled.jpg"
                     alt="Think Tank" loading="lazy">
              </div>
              <div class="triple-card-body">
                <h3>{{ t('home.triple.thinkTank.title') }}</h3>
                <p>{{ t('home.triple.thinkTank.description') }}</p>
              </div>
            </div>
            <div class="triple-card animate-on-scroll stagger-1">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/all-their-input-is-vital-when-it-comes-to-decision-2026-01-09-10-57-28-utc-scaled.jpg"
                     alt="Hub de Recrutement Premium" loading="lazy">
              </div>
              <div class="triple-card-body">
                <h3>{{ t('home.triple.recruitmentHub.title') }}</h3>
                <p>{{ t('home.triple.recruitmentHub.description') }}</p>
              </div>
            </div>
            <div class="triple-card animate-on-scroll stagger-2">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/recording-the-facts-shot-of-a-group-of-people-sit-2026-01-09-11-19-42-utc-scaled.jpg"
                     alt="Levier de Diplomatie Économique" loading="lazy">
              </div>
              <div class="triple-card-body">
                <h3>{{ t('home.triple.diplomacy.title') }}</h3>
                <p>{{ t('home.triple.diplomacy.description') }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- 8. SECTION OPPORTUNITÉS — Offres d'emploi ══ -->
    <section class="section-jobs">
      <div class="container">
        <div class="jobs-header animate-on-scroll">
          <span class="section-label">{{ t('home.jobOffers.label') }}</span>
          <h2 class="section-title">{{ t('home.jobOffers.title') }}</h2>
          <p class="section-description">{{ t('home.jobOffers.description') }}</p>
        </div>

        <div v-if="offres.length" class="jobs-grid animate-on-scroll">
          <router-link
            v-for="(offre, index) in offres.slice(0, 6)"
            :key="offre.id"
            :to="isLoggedIn ? `/annonces/${offre.id}` : `/login?redirect=${encodeURIComponent('/annonces/' + offre.id)}`"
            class="job-card animate-on-scroll"
            :class="`stagger-${(index % 3) + 1}`"
          >
            <!-- Image de l'offre -->
            <div v-if="offre.image_url" class="job-visual">
              <div class="job-bg" :style="`background-image:url('${offre.image_url}')`"></div>
            </div>

            <!-- Header : logo + entreprise + deadline -->
            <div class="job-head">
              <div class="job-logo">
                <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                <span v-else class="job-logo-initial">{{ offre.entreprise ? offre.entreprise.nom.charAt(0) : '?' }}</span>
              </div>
              <div class="job-company-info">
                <span class="job-company">{{ offre.entreprise?.nom || '' }}</span>
                <span v-if="offre.date_limite" class="job-deadline">
                  <i class="fa-solid fa-calendar-xmark"></i> {{ formatDate(offre.date_limite) }}
                </span>
              </div>
            </div>

            <!-- Titre -->
            <h3 class="job-title">{{ offre.titre }}</h3>

            <!-- Salaire -->
            <div v-if="offre.fourchette_salariale" class="job-salary">
              <i class="fa-solid fa-euro-sign"></i>
              {{ offre.fourchette_salariale }}
            </div>

            <!-- Tags -->
            <div class="job-tags">
              <span v-if="offre.localisation" class="tag tag--location">
                <i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}
              </span>
              <span v-for="c in offre.job_contracts" :key="c.id" class="tag tag--contract">{{ c.name }}</span>
              <span v-for="s in offre.study_levels" :key="s.id" class="tag tag--study">{{ s.name }}</span>
            </div>

            <!-- Description -->
            <p class="job-desc">{{ truncate(stripHtml(offre.mission), 120) }}</p>

            <!-- Footer -->
            <div class="job-footer">
              <span class="job-date" v-if="offre.created_at">
                <i class="fa-regular fa-clock"></i> {{ timeAgo(offre.created_at) }}
              </span>
              <span class="btn-primary btn-sm">{{ t('home.jobOffers.apply') }}</span>
            </div>
          </router-link>
        </div>

        <div v-else class="no-jobs animate-on-scroll">
          {{ t('home.jobOffers.noOffers') }}
        </div>
        
        <div class="jobs-cta animate-on-scroll">
          <router-link
            :to="isLoggedIn ? '/annonces' : `/login?redirect=${encodeURIComponent('/annonces')}`"
            class="btn-primary"
          >
            {{ t('home.jobOffers.viewAll') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- 9. SECTION EVENT — Africa Talent Summit Luxembourg countdown ══ -->
    <section class="section-event" v-if="event">
      <!-- SVG defs pour les dégradés -->
      <svg width="0" height="0" style="position:absolute">
        <defs>
          <linearGradient id="grad-days" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f29f1f"/>
            <stop offset="100%" stop-color="#fff5cc"/>
          </linearGradient>
          <linearGradient id="grad-hours" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3a9bff"/>
            <stop offset="100%" stop-color="#c0e0ff"/>
          </linearGradient>
          <linearGradient id="grad-minutes" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f07c00"/>
            <stop offset="100%" stop-color="#f29f1f"/>
          </linearGradient>
          <linearGradient id="grad-seconds" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f29f1f"/>
            <stop offset="100%" stop-color="#ff6b6b"/>
          </linearGradient>
        </defs>
      </svg>
      
      <div class="event-info animate-on-scroll">
        <div class="event-info-arc"></div>
        <div class="event-info-arc2"></div>
        <span class="event-date">{{ eventDateRange }}</span>
        <h2>{{ event.titre || 'Africa Talent Summit Luxembourg' }}</h2>
        <div class="event-location" v-if="event.ville">
          <i class="fa-solid fa-location-dot"></i>
          <span>{{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}</span>
        </div>
        
        <!-- Countdown circles (même style que hero) -->
        <div class="event-countdown-circles">
          <div class="ecc-item">
            <div class="ecc-svg-wrap">
              <svg class="ecc-svg" viewBox="0 0 120 120">
                <circle class="ecc-track" cx="60" cy="60" r="52"/>
                <circle class="ecc-progress ecc-progress--days" cx="60" cy="60" r="52"
                  :style="`stroke-dashoffset: ${326.7 - (326.7 * (parseInt(cd.days) % 365) / 365)}`"/>
              </svg>
              <div class="ecc-text"><span class="ecc-num">{{ cd.days }}</span></div>
            </div>
            <span class="ecc-label">{{ t('home.hero.days') }}</span>
          </div>
          <div class="ecc-item">
            <div class="ecc-svg-wrap">
              <svg class="ecc-svg" viewBox="0 0 120 120">
                <circle class="ecc-track" cx="60" cy="60" r="52"/>
                <circle class="ecc-progress ecc-progress--hours" cx="60" cy="60" r="52"
                  :style="`stroke-dashoffset: ${326.7 - (326.7 * parseInt(cd.hours) / 24)}`"/>
              </svg>
              <div class="ecc-text"><span class="ecc-num">{{ cd.hours }}</span></div>
            </div>
            <span class="ecc-label">{{ t('home.hero.hours') }}</span>
          </div>
          <div class="ecc-item">
            <div class="ecc-svg-wrap">
              <svg class="ecc-svg" viewBox="0 0 120 120">
                <circle class="ecc-track" cx="60" cy="60" r="52"/>
                <circle class="ecc-progress ecc-progress--minutes" cx="60" cy="60" r="52"
                  :style="`stroke-dashoffset: ${326.7 - (326.7 * parseInt(cd.minutes) / 60)}`"/>
              </svg>
              <div class="ecc-text"><span class="ecc-num">{{ cd.minutes }}</span></div>
            </div>
            <span class="ecc-label">{{ t('home.hero.minutes') }}</span>
          </div>
          <div class="ecc-item">
            <div class="ecc-svg-wrap">
              <svg class="ecc-svg" viewBox="0 0 120 120">
                <circle class="ecc-track" cx="60" cy="60" r="52"/>
                <circle class="ecc-progress ecc-progress--seconds" cx="60" cy="60" r="52"
                  :style="`stroke-dashoffset: ${326.7 - (326.7 * parseInt(cd.seconds) / 60)}`"/>
              </svg>
              <div class="ecc-text"><span class="ecc-num">{{ cd.seconds }}</span></div>
            </div>
            <span class="ecc-label">{{ t('home.hero.seconds') }}</span>
          </div>
        </div>
        
        <router-link :to="`/evenements/${event.id}`" class="btn-primary">
          {{ t('home.eventSection.participate') }}
        </router-link>
      </div>
    </section>

    <!-- ══ FOOTER ══ -->
    <Footer />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t, locale } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const event      = ref(null)
const articles   = ref([])
const categories = ref([])
const offres   = ref([])
const cd       = ref({ days: '000', hours: '00', minutes: '00', seconds: '00' })
let   timer    = null

// Auth state
const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userRole = computed(() => localStorage.getItem('userRole') || '')

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

// ── Chargement des données ─────────────────────────────────
onMounted(async () => {
  // Initialize language from localStorage (using same key as i18n config)
  const savedLanguage = localStorage.getItem('locale')
  if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
    locale.value = savedLanguage
  }

  try {
    const [evRes, artRes, offRes] = await Promise.all([
      axios.get(`${apiBase}/public/featured-event`),
      axios.get(`${apiBase}/public/articles`),
      axios.get(`${apiBase}/public/offres`, { params: { per_page: 6 } }),
    ])
    event.value    = evRes.data
    articles.value = artRes.data
    offres.value   = offRes.data.data || offRes.data
  } catch (e) {
    console.error('Erreur chargement page accueil', e)
  }

  try {
    const catRes = await axios.get(`${apiBase}/public/categories-evenements`)
    categories.value = catRes.data
  } catch {}

  startCountdown()
  initAnimations()
  initCounterAnimation()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ── Countdown ─────────────────────────────────────────────
const countdownTarget = computed(() => {
  if (event.value?.date_debut) {
    const dateStr = event.value.date_debut.substring(0, 10)
    const timeStr = event.value.heure_debut_journee
      ? event.value.heure_debut_journee.substring(0, 5)
      : '08:00'
    return new Date(`${dateStr}T${timeStr}:00`)
  }
  return new Date('2026-11-05T08:00:00')
})

function startCountdown() {
  function tick() {
    const diff = Math.max(0, countdownTarget.value - new Date())
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000)  / 60000)
    const s = Math.floor((diff % 60000)    / 1000)
    cd.value = { days: pad(d, 3), hours: pad(h, 2), minutes: pad(m, 2), seconds: pad(s, 2) }
  }
  tick()
  timer = setInterval(tick, 1000)
}

// ── Style hero — image de fond dynamique ──────────────────
const heroStyle = computed(() => {
  if (event.value?.image_mise_en_avant_url) {
    return { backgroundImage: `url('${event.value.image_mise_en_avant_url}')` }
  }
  return {}
})

// ── Computed ──────────────────────────────────────────────
const eventDateRange = computed(() => {
  if (!event.value) return '5 - 6 Novembre 2026'
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  const d = (str) => {
    const dt = new Date(str)
    return dt.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
  }
  if (event.value.date_debut && event.value.date_fin) {
    return `${d(event.value.date_debut)} – ${d(event.value.date_fin)}`
  }
  if (event.value.date_debut) return d(event.value.date_debut)
  return '5 - 6 Novembre 2026'
})

// ── Utilitaires ───────────────────────────────────────────
function pad(n, w) {
  let s = String(n)
  while (s.length < w) s = '0' + s
  return s
}

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatDate(str) {
  if (!str) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(str).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
}

function timeAgo(str) {
  if (!str) return ''
  const diff = Date.now() - new Date(str).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return locale.value === 'fr' ? `Il y a ${m} min` : `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return locale.value === 'fr' ? `Il y a ${h}h` : `${h}h ago`
  const d = Math.floor(h / 24)
  return locale.value === 'fr' ? `Il y a ${d}j` : `${d}d ago`
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })
}

function initCounterAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const target = parseInt(el.dataset.count) || 0
        animateCounter(el, target)
        observer.unobserve(el)
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('.stat-number-large').forEach(el => {
    observer.observe(el)
  })
}

function animateCounter(el, target) {
  const duration = 2000
  const start = 0
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const current = Math.round(easeOutQuart * (target - start) + start)
    
    el.textContent = current.toLocaleString() + '+'
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}

// Language switching function
function switchLanguage(lang) {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<style>
/* ── Language Switcher ─────────────────────────────── */
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(240, 124, 0, 0.2);
}

.lang-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--muted);
}

.lang-btn.active {
  background: var(--orange);
  color: white;
  transform: scale(1.05);
}

.lang-btn:hover:not(.active) {
  background: rgba(240, 124, 0, 0.1);
  color: var(--orange);
}

/* ── Variables ─────────────────────────────────── */
:root {
  --navy:      #040a5d;
  --blue:       #192bc2;
  --orange:     #f07c00;
  --light-bg:   #f5f7fa;
  --border:     #e2e8f0;
  --body-text:  #6b7280;
  --bg:         #ffffff;
  --fg:         #1e293b;
  --muted:      #6b7280;
  --accent:     #f07c00;
  --accent-blue: #192bc2;
  --card:       #ffffff;
  --surface:    #ffffff;
  --surface2:   #f8fafc;
  --subtle:     #94a3b8;
  --shadow-lg:  0 8px 32px rgba(0,35,90,.12);
}

/* ── Global Styles ─────────────────────────────── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar like zai.html */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--light-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 4px;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--light-bg);
  color: var(--fg);
}

.home-page {
  width: 100%;
}

.font-display {
  font-family: 'Playfair Display', serif;
}

/* ── Animations ─────────────────────────────────── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(60px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
.stagger-5 { transition-delay: 0.5s; }
.stagger-6 { transition-delay: 0.6s; }

/* ── Buttons ─────────────────────────────────────── */
.btn-primary {
  background: linear-gradient(135deg, var(--orange) 0%, #d96e00 100%);
  color: white;
  padding: 16px 40px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(240, 124, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--navy);
  padding: 16px 40px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid var(--border);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  border-color: var(--orange);
  color: var(--orange);
  background: rgba(240, 124, 0, 0.05);
}

/* ── Hero Section ─────────────────────────────────── */
.hero-modern {
  background: linear-gradient(160deg, var(--navy) 0%, #040a5d 45%, var(--blue) 75%, var(--navy) 100%);
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 120px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  position: relative;
  z-index: 10;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
  .hero-visual {
    order: -1;
  }
  .hero-stats-overlay {
    position: relative;
    bottom: auto;
    left: auto;
    margin-top: 20px;
    align-self: center;
  }
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid rgba(240, 124, 0, 0.3);
  color: #f29f1f;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 32px;
  color: white;
}

.gradient-text {
  background: linear-gradient(135deg, #f29f1f 0%, #3a9bff 50%, var(--navy) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  max-width: 500px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 48px;
}

@media (max-width: 640px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}

/* Countdown */
.countdown-modern {
  display: flex;
  gap: 32px;
}

@media (max-width: 640px) {
  .countdown-modern {
    gap: 16px;
    justify-content: center;
  }
}

.countdown-item {
  text-align: center;
}

.countdown-value {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: white;
  line-height: 1;
}

.countdown-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 8px;
}

/* Hero Visual */
.hero-visual {
  position: relative;
}

.hero-image-container {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 16px;
  overflow: hidden;
}

.hero-image-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-image: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80');
}

.hero-image-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
}

.hero-stats-overlay {
  position: absolute;
  bottom: -32px;
  left: -32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(240, 124, 0, 0.2);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 200px;
}

@media (max-width: 768px) {
  .hero-stats-overlay {
    position: relative;
    bottom: auto;
    left: auto;
    margin-top: 20px;
    padding: 16px;
    gap: 16px;
    justify-content: center;
  }
}

.stat-item {
  text-align: center;
  flex-shrink: 0;
}

.stat-number {
  font-size: 30px;
  font-weight: 700;
  color: var(--orange);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-number--blue {
  color: var(--blue);
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: #e5e7eb;
  flex-shrink: 0;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40%, 43% {
    transform: translateX(-50%) translateY(-30px);
  }
  70% {
    transform: translateX(-50%) translateY(-15px);
  }
  90% {
    transform: translateX(-50%) translateY(-4px);
  }
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  color: rgba(240, 124, 0, 0.8);
}

/* ── Sections générales ─────────────────────────────── */
section {
  width: 100%;
}

/* ── About Section ─────────────────────────────────── */
.section-about {
  padding: 128px 0;
  background: white;
  position: relative;
  width: 100%;
}

.section-about::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(240, 124, 0, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(25, 43, 194, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 64px;
  }
}

.section-label {
  color: var(--orange);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
  display: block;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--navy);
  line-height: 1.2;
}

.section-description {
  color: var(--muted);
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 24px;
}

.feature-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 40px;
}

@media (max-width: 640px) {
  .feature-cards {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 24px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover {
  border-color: var(--orange);
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-icon--orange {
  background: rgba(240, 124, 0, 0.1);
  color: var(--orange);
}

.feature-icon--blue {
  background: rgba(25, 43, 194, 0.1);
  color: var(--blue);
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 12px;
}

.feature-card p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

/* About Visual */
.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.image-column--offset {
  padding-top: 32px;
}

.image-item {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.image-item:last-child {
  margin-bottom: 0;
}

.image-tall {
  aspect-ratio: 4/5;
}

.image-square {
  aspect-ratio: 1;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.image-item:hover img {
  transform: scale(1.1);
}

/* ── Stats Section ─────────────────────────────────── */
.section-stats {
  padding: 80px 0;
  background: linear-gradient(135deg, rgba(240, 124, 0, 0.05) 0%, rgba(25, 43, 194, 0.05) 50%, rgba(240, 124, 0, 0.05) 100%);
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  text-align: center;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 32px 16px;
}

.stat-number-large {
  font-size: clamp(3rem, 8vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--orange) 0%, var(--blue) 50%, var(--navy) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;
}

.stat-description {
  color: var(--muted);
  font-weight: 500;
}

/* ── CTA Section ─────────────────────────────────── */
.section-cta {
  padding: 128px 0;
  background: white;
  width: 100%;
}

.cta-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 80px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(240, 124, 0, 0.1) 0%, transparent 50%, rgba(25, 43, 194, 0.1) 100%);
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 24px;
  line-height: 1.2;
}

.cta-description {
  color: var(--muted);
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 40px;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 640px) {
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}

/* ── Quick Links Section ─────────────────────────────── */
.section-quicklinks {
  padding: 80px 0;
  background: var(--light-bg);
  width: 100%;
}

.quicklinks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .quicklinks-grid { 
    grid-template-columns: repeat(2, 1fr); 
  }
}

@media (max-width: 600px) {
  .quicklinks-grid { 
    grid-template-columns: 1fr; 
  }
}

.ql-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 44px 36px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  text-decoration: none;
  border: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 260px;
  position: relative;
  overflow: hidden;
}

.ql-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.ql-card:hover::before {
  left: 100%;
}

.ql-card:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,.25);
  transform: translateY(-8px);
}

.ql-card:nth-child(1) { 
  background: linear-gradient(135deg,#040a5d 0%,#192bc2 100%); 
}
.ql-card:nth-child(2) { 
  background: linear-gradient(135deg,#f07c00 0%,#f29f1f 100%); 
}
.ql-card:nth-child(3) { 
  background: linear-gradient(135deg,#2687e9 0%,#5ba3f0 100%); 
}
.ql-card:nth-child(4) { 
  background: linear-gradient(135deg,#f49f0a 0%,#ffb52e 100%); 
}

.ql-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #fff;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.ql-body {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ql-body h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  line-height: 1.3;
}

.ql-body p {
  font-size: 15px;
  color: rgba(255,255,255,.85);
  line-height: 1.65;
  margin: 0 0 20px;
  flex: 1;
}

.ql-link {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding: 10px 18px;
  background: rgba(255,255,255,.18);
  border-radius: 50px;
  align-self: flex-start;
  transition: all 0.3s ease;
}

.ql-card:hover .ql-link { 
  background: rgba(255,255,255,.28); 
}

.ql-link i { 
  font-size: 11px; 
  transition: transform .2s; 
}

.ql-card:hover .ql-link i { 
  transform: translateX(4px); 
}

/* ── Container ─────────────────────────────────── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }
}

/* ── Fade In Animation ─────────────────────────────── */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Responsive ─────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

@media (max-width: 640px) {
  .hero-modern {
    padding-top: 100px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn-primary,
  .hero-actions .btn-secondary {
    width: 100%;
    max-width: 280px;
  }
}

/* ── Legacy styles pour les sections API ─────────────── */

/* ── Topbar countdown ─────────────────────────────────── */
.topbar { background: #040a5d; height: 48px; display: flex; align-items: center; color: rgba(255,255,255,.6); }
.topbar .container { display: flex; justify-content: space-between; align-items: center; }
.topbar-left  { display: flex; align-items: center; gap: 12px; }
.topbar-right { display: flex; gap: 16px; }
.topbar-right a { color: rgba(255,255,255,.55); font-size: 14px; transition: color .15s; }
.topbar-right a:hover { color: #f07c00; }
.topbar-dot { width: 8px; height: 8px; border-radius: 50%; background: #f07c00; box-shadow: 0 0 7px #f07c00; animation: blink 2s infinite; flex-shrink: 0; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
.topbar-label { color: #fff; font-weight: 700; font-size: 15px; max-width: 340px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.countdown-blocks { display: flex; align-items: center; gap: 6px; }
.cd-block  { display: flex; flex-direction: row; align-items: center; gap: 3px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); border-radius: 6px; padding: 5px 12px; }
.cd-num    { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.cd-unit   { font-size: 13px; font-weight: 700; color: #f07c00; text-transform: uppercase; letter-spacing: 1px; }
.cd-sep    { font-size: 20px; font-weight: 800; color: rgba(255,255,255,.4); margin: 0 2px; padding-bottom: 8px; }
.topbar-link { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; background: #f07c00; color: #fff; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .15s; }
.topbar-link:hover { background: #d96b00; }
.topbar-right { display: flex; gap: 14px; }
.topbar-right a { color: rgba(255,255,255,.5); font-size: 13px; transition: color .15s; text-decoration: none; }
.topbar-right a:hover { color: #f07c00; }

/* ── Logo + tagline ───────────────────────────────────── */
.site-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-decoration: none;
}
.site-tagline {
  font-size: 11px;
  font-weight: 700;
  color: var(--orange, #f07c00);
  letter-spacing: 0.3px;
  line-height: 1;
  position: relative;
  top: -8px;
}


/* ── Label bleu ───────────────────────────────────────── */
.label-blue {
  display: inline-block;
  background: var(--blue);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  margin-bottom: 12px;
}

/* ── Mega menu ────────────────────────────────────────── */
.has-mega {
  position: relative;
}
.has-mega .mega-menu {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
  min-width: 240px;
  z-index: 200;
  border-top: 3px solid var(--blue);
}
.has-mega:hover .mega-menu,
.has-mega:focus-within .mega-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mega-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--navy);
  text-decoration: none;
  transition: background .15s;
}
.mega-item:hover {
  background: var(--light-bg, #f5f7fa);
}
.mega-item strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--navy);
}
.mega-item small {
  display: block;
  font-size: 12px;
  color: var(--body-text);
  margin-top: 2px;
}
.mega-item--empty {
  opacity: .6;
  cursor: default;
  pointer-events: none;
}
.mega-icon {
  font-size: 18px;
  color: var(--blue);
  margin-top: 2px;
  flex-shrink: 0;
}
.nav-chevron {
  font-size: 9px;
  margin-left: 3px;
  vertical-align: middle;
  transition: transform .2s;
}
.has-mega:hover .nav-chevron {
  transform: rotate(180deg);
}

/* ── 4 cards accès rapide ─────────────────────────────── */
.section-quicklinks {
  padding: 80px 0;
  background: var(--light-bg, #f5f7fa);
}
.quicklinks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .quicklinks-grid { grid-template-columns: repeat(2, 1fr); }
  .partners-title { font-size: 42px; }
}
@media (max-width: 600px) {
  .quicklinks-grid { grid-template-columns: 1fr; }
  .partners-title { font-size: 34px; }
  .partners-title::after { width: 70px; height: 3px; }
  .partners-desc { font-size: 16px; }
  .partners-label { font-size: 11px; padding: 6px 16px; }
}
.ql-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 44px 36px;
  border-radius: var(--radius-lg, 14px);
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  text-decoration: none;
  border: none;
  transition: box-shadow .2s, transform .2s;
  min-height: 260px;
}
.ql-card:hover {
  box-shadow: 0 10px 32px rgba(0,0,0,.22);
  transform: translateY(-5px);
}
.ql-card:nth-child(1) { background: linear-gradient(135deg,#040a5d 0%,#192bc2 100%); }
.ql-card:nth-child(2) { background: linear-gradient(135deg,#192bc2 0%,#2687e9 100%); }
.ql-card:nth-child(3) { background: linear-gradient(135deg,#2687e9 0%,#5ba3f0 100%); }
.ql-card:nth-child(4) { background: linear-gradient(135deg,#f49f0a 0%,#ffb52e 100%); }
.ql-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #fff;
  flex-shrink: 0;
}
.ql-body h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  line-height: 1.3;
}
.ql-body p {
  font-size: 15px;
  color: rgba(255,255,255,.85);
  line-height: 1.65;
  margin: 0 0 20px;
  flex: 1;
}
.ql-link {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding: 10px 18px;
  background: rgba(255,255,255,.18);
  border-radius: 50px;
  align-self: flex-start;
  transition: background .2s;
}
.ql-card:hover .ql-link { background: rgba(255,255,255,.28); }
.ql-link i { font-size: 11px; transition: transform .2s; }
.ql-card:hover .ql-link i { transform: translateX(4px); }

/* ── Section partenaires ──────────────────────────────── */
.section-partners {
  padding: 100px 0 80px;
  background: linear-gradient(180deg, #f8fafb 0%, #ffffff 100%);
  overflow: hidden;
  position: relative;
}
.section-partners::before {
  content: '';
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(58,155,255,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.partners-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}
.partners-label {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, var(--blue) 0%, #5db0ff 100%);
  padding: 8px 22px;
  border-radius: 50px;
  margin-bottom: 24px;
  position: relative;
}
.partners-title {
  font-family: 'Archivo', 'Barlow Condensed', sans-serif;
  font-size: 54px;
  font-weight: 900;
  line-height: 1.15;
  color: var(--navy-head);
  margin: 0 0 20px;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 20px;
}
.partners-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, var(--blue) 0%, var(--orange) 100%);
  border-radius: 2px;
}
.partners-desc {
  font-size: 18px;
  line-height: 1.7;
  color: #64748b;
  max-width: 640px;
  margin: 0 auto;
  font-weight: 400;
}

/* Carrousel infini */
.logo-carousel-wrap {
  background: #fff;
  overflow: hidden;
  padding: 24px 0;
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
.logo-item:hover .logo-img { opacity: 1; }
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
.logo-item:hover .logo-name { color: var(--navy, #040a5d); }
.partners-cta {
  text-align: center;
  margin-top: 36px;
}

/* ── Switcher langue ──────────────────────────────────── */
.lang-switch {
  background: transparent;
  border: 1.5px solid var(--blue);
  color: var(--blue);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: var(--radius-pill, 50px);
  cursor: pointer;
  transition: background .15s, color .15s;
}
.lang-switch:hover {
  background: var(--blue);
  color: #fff;
}
/* ── Offres home ── */
/* ── Grid ── */
.home-offres-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 1100px) { .home-offres-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .home-offres-grid { grid-template-columns: 1fr; } }

/* ── Card ── */
.home-offre-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: border-color .2s, box-shadow .2s, transform .2s;
  overflow: hidden;
}
.home-offre-card:hover {
  border-color: var(--blue);
  box-shadow: 0 8px 32px rgba(0,35,90,.12);
  transform: translateY(-3px);
}

/* Image bannière */
.home-offre-visual {
  margin: -20px -20px 0;
  height: 100px;
  position: relative;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}
.home-offre-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

/* Header */
.home-offre-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.home-offre-logo {
  width: 52px; height: 52px;
  border-radius: 10px;
  background: var(--light-bg);
  border: 1.5px solid var(--border);
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.home-offre-logo img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
.home-offre-logo-initial {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px; font-weight: 800; color: var(--blue);
}
.home-offre-company-info {
  flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0;
}
.home-offre-company {
  font-size: 13px; font-weight: 700; color: var(--navy);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.home-offre-deadline {
  font-size: 11px; color: #9ca3af;
}
.home-offre-deadline i { color: var(--orange); margin-right: 3px; }

/* Titre */
.home-offre-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px; font-weight: 700;
  color: var(--navy-head);
  margin: 0; line-height: 1.2; letter-spacing: -.3px;
}

/* Tags */
.home-offre-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 50px;
}
.tag--location { background: #dbeafe; color: #1d4ed8; }
.tag--contract { background: #fff7ed; color: #c2410c; }
.tag--study    { background: #dcfce7; color: #15803d; }

/* Description */
.home-offre-desc {
  font-size: 13px; color: #6b7280; line-height: 1.6; margin: 0; flex: 1;
}

/* Footer */
.home-offre-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}
.home-offre-date {
  font-size: 12px; color: #9ca3af;
  display: flex; align-items: center; gap: 5px;
}

/* ── Section Event ── */
.section-event {
  padding: 80px 0;
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  position: relative;
  overflow: hidden;
  min-height: 500px;
}

.event-info {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #fff;
  z-index: 2;
}

.event-info-arc,
.event-info-arc2 {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}

.event-info-arc {
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
}

.event-info-arc2 {
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(242,159,31,0.3) 0%, transparent 70%);
}

.event-date {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.event-info h2 {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 20px;
  line-height: 1.2;
  color: #fff;
}

.event-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 40px;
  color: rgba(255,255,255,0.9);
}

.event-countdown-circles {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 40px 0;
}

.ecc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ecc-svg-wrap {
  position: relative;
  width: 100px;
  height: 100px;
}

.ecc-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ecc-track {
  fill: none;
  stroke: rgba(255,255,255,0.2);
  stroke-width: 6;
}

.ecc-progress {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 326.7;
  transition: stroke-dashoffset 0.5s ease;
}

.ecc-progress--days { stroke: url(#grad-days); }
.ecc-progress--hours { stroke: url(#grad-hours); }
.ecc-progress--minutes { stroke: url(#grad-minutes); }
.ecc-progress--seconds { stroke: url(#grad-seconds); }

.ecc-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ecc-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.ecc-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .event-info h2 {
    font-size: 32px;
  }
  
  .event-countdown-circles {
    gap: 16px;
  }
  
  .ecc-svg-wrap {
    width: 80px;
    height: 80px;
  }
  
  .ecc-num {
    font-size: 22px;
  }
}


/* ── Partners Section ─────────────────────────────────── */
.section-partners {
  padding: 100px 0 80px;
  background: linear-gradient(180deg, #f8fafb 0%, #ffffff 100%);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.section-partners::before {
  content: '';
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(58,155,255,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.partners-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

/* Carrousel infini */
.logo-carousel-wrap {
  background: #fff;
  overflow: hidden;
  padding: 24px 0;
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

.logo-carousel-wrap::before { 
  left: 0;  
  background: linear-gradient(to right, #fff, transparent); 
}

.logo-carousel-wrap::after  { 
  right: 0; 
  background: linear-gradient(to left,  #fff, transparent); 
}

.logo-track {
  display: flex;
  align-items: center;
  gap: 0;
  width: max-content;
  animation: marquee 32s linear infinite;
}

.logo-track:hover { 
  animation-play-state: paused; 
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
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
  color: var(--blue);
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
  color: var(--navy); 
}

.partners-cta {
  text-align: center;
  margin-top: 36px;
}

/* ── Triple Section ─────────────────────────────────── */
.section-triple {
  padding: 128px 0;
  background: var(--light-bg);
  position: relative;
  width: 100%;
}

.section-triple::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(240, 124, 0, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(25, 43, 194, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.triple-header {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 1;
}

.triple-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .triple-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .triple-cards {
    grid-template-columns: 1fr;
  }
}

.triple-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.triple-card:hover {
  border-color: var(--orange);
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.triple-card-img {
  aspect-ratio: 16/9;
  overflow: hidden;
  position: relative;
}

.triple-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.triple-card:hover .triple-card-img img {
  transform: scale(1.1);
}

.triple-card-placeholder {
  width: 100%;
  height: 100%;
  background: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 48px;
}

.triple-card-body {
  padding: 32px 24px;
}

.article-date {
  font-size: 12px;
  color: var(--blue);
  margin-bottom: 12px;
  font-weight: 600;
}

.triple-card-body h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 16px;
  line-height: 1.3;
}

.triple-card-body p {
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 20px;
}

.article-link {
  color: var(--blue);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
}

.article-link:hover {
  color: var(--orange);
}

.article-link i {
  font-size: 11px;
  transition: transform 0.2s;
}

.article-link:hover i {
  transform: translateX(4px);
}

/* ── Jobs Section ─────────────────────────────────── */
.section-jobs {
  padding: 128px 0;
  background: white;
  width: 100%;
}

.jobs-header {
  text-align: center;
  margin-bottom: 80px;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 64px;
}

@media (max-width: 1100px) { 
  .jobs-grid { 
    grid-template-columns: repeat(2, 1fr); 
  } 
}

@media (max-width: 640px)  { 
  .jobs-grid { 
    grid-template-columns: 1fr; 
  } 
}

.job-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.job-card:hover {
  border-color: var(--blue);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-8px);
}

.job-visual {
  margin: -24px -24px 0;
  height: 120px;
  position: relative;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.job-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.job-head {
  display: flex;
  align-items: center;
  gap: 16px;
}

.job-logo {
  width: 56px; 
  height: 56px;
  border-radius: 12px;
  background: var(--light-bg);
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
}

.job-logo img { 
  width: 100%; 
  height: 100%; 
  object-fit: contain; 
  padding: 8px; 
}

.job-logo-initial {
  font-family: 'Playfair Display', serif;
  font-size: 24px; 
  font-weight: 800; 
  color: var(--blue);
}

.job-company-info {
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
  min-width: 0;
}

.job-company {
  font-size: 14px; 
  font-weight: 700; 
  color: var(--navy);
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

.job-deadline {
  font-size: 12px; 
  color: #9ca3af;
}

.job-deadline i { 
  color: var(--orange); 
  margin-right: 4px; 
}

.job-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px; 
  font-weight: 700;
  color: var(--navy);
  margin: 0; 
  line-height: 1.3; 
  letter-spacing: -0.3px;
}

.job-salary {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--orange);
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: .2px;
}

.job-salary i {
  font-size: 13px;
}

.job-tags { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
}

.tag {
  display: inline-flex; 
  align-items: center; 
  gap: 4px;
  font-size: 11px; 
  font-weight: 700;
  padding: 4px 12px; 
  border-radius: 50px;
}

.tag--location { 
  background: #dbeafe; 
  color: #1d4ed8; 
}

.tag--contract { 
  background: #fff7ed; 
  color: #c2410c; 
}

.tag--study { 
  background: #dcfce7; 
  color: #15803d; 
}

.job-desc {
  font-size: 14px; 
  color: #6b7280; 
  line-height: 1.6; 
  margin: 0; 
  flex: 1;
}

.job-footer {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.job-date {
  font-size: 12px; 
  color: #9ca3af;
  display: flex; 
  align-items: center; 
  gap: 6px;
}

.btn-sm {
  padding: 8px 20px;
  font-size: 12px;
}

.no-jobs {
  text-align: center;
  color: var(--body-text);
  padding: 64px 0;
  font-size: 16px;
}

.jobs-cta {
  text-align: center;
}

/* ── Event Section ─────────────────────────────────── */
.section-event {
  padding: 128px 0;
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  position: relative;
  overflow: hidden;
  min-height: 600px;
  width: 100%;
}

.event-info {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #fff;
  z-index: 2;
}

.event-info-arc,
.event-info-arc2 {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}

.event-info-arc {
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
}

.event-info-arc2 {
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(242,159,31,0.3) 0%, transparent 70%);
}

.event-date {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.event-info h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0 0 24px;
  line-height: 1.2;
  color: #fff;
}

.event-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 48px;
  color: rgba(255,255,255,0.9);
}

.event-countdown-circles {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 48px 0;
}

@media (max-width: 640px) {
  .event-countdown-circles {
    gap: 16px;
  }
}

.ecc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ecc-svg-wrap {
  position: relative;
  width: 100px;
  height: 100px;
}

@media (max-width: 640px) {
  .ecc-svg-wrap {
    width: 80px;
    height: 80px;
  }
}

.ecc-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ecc-track {
  fill: none;
  stroke: rgba(255,255,255,0.2);
  stroke-width: 6;
}

.ecc-progress {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 326.7;
  transition: stroke-dashoffset 0.5s ease;
}

.ecc-progress--days { stroke: url(#grad-days); }
.ecc-progress--hours { stroke: url(#grad-hours); }
.ecc-progress--minutes { stroke: url(#grad-minutes); }
.ecc-progress--seconds { stroke: url(#grad-seconds); }

.ecc-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ecc-num {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.ecc-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

</style>