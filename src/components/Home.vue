<template>
  <div>

    <PublicNav />

    <!-- ══ HERO — Événement mis en avant ══ -->
    <section class="hero">
      <div class="hero-bg" :style="heroStyle"></div>
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-inner">
          <div class="hero-content fade-in">
            <span class="hero-date">{{ eventDateRange }}</span>
            <h1 class="hero-title" v-if="event">{{ event.titre }}</h1>
            <h1 class="hero-title" v-else>{{ t('home.hero.defaultTitle') }} <span class="orange">{{ t('home.hero.defaultLocation') }}</span></h1>
            <p class="hero-desc" v-if="event">
              {{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}
            </p>
            <p class="hero-desc" v-else>{{ t('home.hero.defaultDescription') }}</p>
            <p class="hero-cta-label">{{ t('home.hero.subscriptionsOpen') }}</p>
            <router-link to="/register" class="btn btn--blue btn--lg hero-btn">
              {{ t('home.hero.subscribe') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
            </router-link>
          </div>
          <div class="hero-right">
            <!-- Countdown circles -->
            <div class="countdown-circles" id="countdown">

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

              <div class="cc-item">
                <div class="cc-svg-wrap">
                  <svg class="cc-svg" viewBox="0 0 120 120">
                    <circle class="cc-track" cx="60" cy="60" r="52"/>
                    <circle class="cc-progress cc-progress--days" cx="60" cy="60" r="52"
                      :style="`stroke-dashoffset: ${326.7 - (326.7 * (parseInt(cd.days) % 365) / 365)}`"/>
                  </svg>
                  <div class="cc-text"><span class="cc-num">{{ cd.days }}</span></div>
                </div>
                <span class="cc-label">{{ t('home.hero.days') }}</span>
              </div>

              <div class="cc-item">
                <div class="cc-svg-wrap">
                  <svg class="cc-svg" viewBox="0 0 120 120">
                    <circle class="cc-track" cx="60" cy="60" r="52"/>
                    <circle class="cc-progress cc-progress--hours" cx="60" cy="60" r="52"
                      :style="`stroke-dashoffset: ${326.7 - (326.7 * parseInt(cd.hours) / 24)}`"/>
                  </svg>
                  <div class="cc-text"><span class="cc-num">{{ cd.hours }}</span></div>
                </div>
                <span class="cc-label">{{ t('home.hero.hours') }}</span>
              </div>

              <div class="cc-item">
                <div class="cc-svg-wrap">
                  <svg class="cc-svg" viewBox="0 0 120 120">
                    <circle class="cc-track" cx="60" cy="60" r="52"/>
                    <circle class="cc-progress cc-progress--minutes" cx="60" cy="60" r="52"
                      :style="`stroke-dashoffset: ${326.7 - (326.7 * parseInt(cd.minutes) / 60)}`"/>
                  </svg>
                  <div class="cc-text"><span class="cc-num">{{ cd.minutes }}</span></div>
                </div>
                <span class="cc-label">{{ t('home.hero.minutes') }}</span>
              </div>

              <div class="cc-item">
                <div class="cc-svg-wrap">
                  <svg class="cc-svg" viewBox="0 0 120 120">
                    <circle class="cc-track" cx="60" cy="60" r="52"/>
                    <circle class="cc-progress cc-progress--seconds" cx="60" cy="60" r="52"
                      :style="`stroke-dashoffset: ${326.7 - (326.7 * parseInt(cd.seconds) / 60)}`"/>
                  </svg>
                  <div class="cc-text"><span class="cc-num">{{ cd.seconds }}</span></div>
                </div>
                <span class="cc-label">{{ t('home.hero.seconds') }}</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 4 CARDS ACCÈS RAPIDE ══ -->
    <section class="section-quicklinks">
      <div class="container">
        <div class="quicklinks-grid">

          <router-link to="/annonces" class="ql-card">
            <div class="ql-icon"><i class="fa-solid fa-briefcase"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.findJob.title') }}</h3>
              <p>{{ t('home.quicklinks.findJob.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.findJob.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link :to="categories.length ? `/evenements/categorie/${categories[0].id}` : '/'" class="ql-card">
            <div class="ql-icon ql-icon--orange"><i class="fa-solid fa-calendar-days"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.events.title') }}</h3>
              <p>{{ t('home.quicklinks.events.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.events.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link to="/blog" class="ql-card">
            <div class="ql-icon ql-icon--green"><i class="fa-solid fa-newspaper"></i></div>
            <div class="ql-body">
              <h3>{{ t('home.quicklinks.articles.title') }}</h3>
              <p>{{ t('home.quicklinks.articles.description') }}</p>
              <span class="ql-link">{{ t('home.quicklinks.articles.action') }} <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </router-link>

          <router-link :to="isLoggedIn && userRole === 'talent' ? '/talent' : '/login'" class="ql-card ql-card--featured">
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

    <!-- ══ ENTREPRISES PARTICIPANTES ══ -->
    <section v-if="event && event.entreprises && event.entreprises.length" class="section-partners">
      <div class="container">
        <div class="partners-header fade-in">
          <span class="partners-label">{{ t('home.partners.label') }}</span>
          <h2 class="partners-title">{{ t('home.partners.title') }}</h2>
          <p class="partners-desc">{{ t('home.partners.description') }}</p>
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
            <span v-else class="logo-text">{{ entreprise.nom }}</span>
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
            <span v-else class="logo-text">{{ entreprise.nom }}</span>
          </router-link>
        </div>
      </div>
      <div class="partners-cta fade-in">
        <router-link to="/entreprises" class="btn btn--blue">
          {{ t('home.partners.viewAll') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
        </router-link>
      </div>
    </section>

    <!-- ══ TRIPLE ANCRAGE ══ -->
    <section class="section-triple">
      <div class="triple-watermark">{{ t('home.triple.watermark') }}</div>
      <div class="container">
        <div class="triple-header fade-in">
          <h2>{{ t('home.triple.title') }}</h2>
          <p>{{ t('home.triple.description') }}</p>
        </div>
        <div class="triple-cards">
          <!-- Articles dynamiques (3 premiers) -->
          <template v-if="articles.length">
            <div v-for="article in articles.slice(0, 3)" :key="article.id" class="triple-card fade-in">
              <div class="triple-card-img">
                <img v-if="article.image_url" :src="article.image_url" :alt="article.title" loading="lazy">
                <div v-else class="triple-card-placeholder">
                  <i class="fa-solid fa-newspaper"></i>
                </div>
              </div>
              <div class="triple-card-body">
                <div style="font-size:12px;color:var(--blue);margin-bottom:6px;">{{ formatDate(article.created_at) }}</div>
                <h3>{{ article.title }}</h3>
                <p>{{ truncate(stripHtml(article.content), 120) }}</p>
                <router-link :to="`/blog/${article.id}`" style="color:var(--blue);font-weight:600;font-size:14px;margin-top:8px;display:inline-block;">
                  {{ t('home.triple.readMore') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
                </router-link>
              </div>
            </div>
          </template>
          <!-- Fallback statique si aucun article -->
          <template v-else>
            <div class="triple-card fade-in">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/staff-tech-accounting-discussion-office-development-feedback-budget-communication-business-project-group-collaboration-financial-firm-people-planning-with-team-scaled.jpg"
                     alt="Think Tank" loading="lazy">
              </div>
              <div class="triple-card-body"><h3>{{ t('home.triple.thinkTank.title') }}</h3><p>{{ t('home.triple.thinkTank.description') }}</p></div>
            </div>
            <div class="triple-card fade-in">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/all-their-input-is-vital-when-it-comes-to-decision-2026-01-09-10-57-28-utc-scaled.jpg"
                     alt="Hub de Recrutement Premium" loading="lazy">
              </div>
              <div class="triple-card-body"><h3>{{ t('home.triple.recruitmentHub.title') }}</h3><p>{{ t('home.triple.recruitmentHub.description') }}</p></div>
            </div>
            <div class="triple-card fade-in">
              <div class="triple-card-img">
                <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/recording-the-facts-shot-of-a-group-of-people-sit-2026-01-09-11-19-42-utc-scaled.jpg"
                     alt="Levier de Diplomatie Économique" loading="lazy">
              </div>
              <div class="triple-card-body"><h3>{{ t('home.triple.diplomacy.title') }}</h3><p>{{ t('home.triple.diplomacy.description') }}</p></div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- ══ OFFRES D'EMPLOI ══ -->
    <section id="offres" style="padding:80px 0;background:var(--light-bg);">
      <div class="container">
        <div class="roles-header fade-in" style="text-align:center;margin-bottom:48px;">
          <span class="label-blue">{{ t('home.jobOffers.label') }}</span>
          <h2>{{ t('home.jobOffers.title') }}</h2>
          <p>{{ t('home.jobOffers.description') }}</p>
        </div>

        <div v-if="offres.length" class="home-offres-grid fade-in">
          <router-link
            v-for="offre in offres.slice(0, 6)"
            :key="offre.id"
            :to="isLoggedIn ? `/annonces/${offre.id}` : `/login?redirect=${encodeURIComponent('/annonces/' + offre.id)}`"
            class="home-offre-card"
          >
            <!-- Image de l'offre -->
            <div v-if="offre.image_url" class="home-offre-visual">
              <div class="home-offre-bg" :style="`background-image:url('${offre.image_url}')`"></div>
            </div>

            <!-- Header : logo + entreprise + deadline -->
            <div class="home-offre-head">
              <div class="home-offre-logo">
                <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                <span v-else class="home-offre-logo-initial">{{ offre.entreprise ? offre.entreprise.nom.charAt(0) : '?' }}</span>
              </div>
              <div class="home-offre-company-info">
                <span class="home-offre-company">{{ offre.entreprise?.nom || '' }}</span>
                <span v-if="offre.date_limite" class="home-offre-deadline">
                  <i class="fa-solid fa-calendar-xmark"></i> {{ formatDate(offre.date_limite) }}
                </span>
              </div>
            </div>

            <!-- Titre -->
            <h3 class="home-offre-title">{{ offre.titre }}</h3>

            <!-- Tags -->
            <div class="home-offre-tags">
              <span v-if="offre.localisation" class="tag tag--location">
                <i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}
              </span>
              <span v-for="c in offre.job_contracts" :key="c.id" class="tag tag--contract">{{ c.name }}</span>
              <span v-for="s in offre.study_levels" :key="s.id" class="tag tag--study">{{ s.name }}</span>
            </div>

            <!-- Description -->
            <p class="home-offre-desc">{{ truncate(stripHtml(offre.mission), 120) }}</p>

            <!-- Footer -->
            <div class="home-offre-footer">
              <span class="home-offre-date" v-if="offre.created_at">
                <i class="fa-regular fa-clock"></i> {{ timeAgo(offre.created_at) }}
              </span>
              <span class="btn btn--blue btn--sm">{{ t('home.jobOffers.apply') }}</span>
            </div>
          </router-link>
        </div>

        <div v-else style="text-align:center;color:var(--body-text);padding:40px 0;">
          {{ t('home.jobOffers.noOffers') }}
        </div>
        <div style="text-align:center;margin-top:40px;">
          <router-link
            :to="isLoggedIn ? '/annonces' : `/login?redirect=${encodeURIComponent('/annonces')}`"
            class="btn btn--blue btn--lg"
          >
            {{ t('home.jobOffers.viewAll') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
          </router-link>
        </div>
      </div>
    </section>
    <section class="section-event" v-if="event">
      <div class="event-info fade-in visible">
        <div class="event-info-arc"></div>
        <div class="event-info-arc2"></div>
        <span class="event-date">{{ eventDateRange }}</span>
        <h2>{{ event.titre }}</h2>
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
        
        <router-link :to="`/evenements/${event.id}`" class="btn btn--blue btn--lg" style="position:relative;z-index:2;">
          {{ t('home.eventSection.participate') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
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
  try {
    const [evRes, artRes, offRes] = await Promise.all([
      axios.get(`${apiBase}/public/featured-event`),
      axios.get(`${apiBase}/public/articles`),
      axios.get(`${apiBase}/public/offres-home`),
    ])
    event.value    = evRes.data
    articles.value = artRes.data
    offres.value   = offRes.data
  } catch (e) {
    console.error('Erreur chargement page accueil', e)
  }

  try {
    const catRes = await axios.get(`${apiBase}/public/categories-evenements`)
    categories.value = catRes.data
  } catch {}

  startCountdown()
  initFadeIn()
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

function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.15 })
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
}
</script>

<style>
/* ── Variables ─────────────────────────────────── */
:root {
  --navy:      #00235a;
  --navy-head: #1c244b;
  --blue:      #3a9bff;
  --orange:    #f29f1f;
  --border:    #e0e4ef;
  --light-bg:  #f5f7fc;
  --shadow-lg: 0 8px 32px rgba(0,35,90,.12);
}

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
  background: linear-gradient(180deg, #040a5d 0%, #0d1a8a 100%);
  overflow: hidden;
  padding: 36px 0;
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
  padding: 0 48px;
  border-right: 1px solid rgba(255,255,255,.1);
  height: 64px;
  flex-shrink: 0;
  text-decoration: none;
}
.logo-img {
  max-height: 44px;
  max-width: 140px;
  width: auto;
  object-fit: contain;
  opacity: 0.75;
  transition: opacity .2s;
}
.logo-item:hover .logo-img { opacity: 1; }
.logo-text {
  color: rgba(255,255,255,.45);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  white-space: nowrap;
  line-height: 1.2;
  text-align: center;
}
.logo-item:hover .logo-text { color: rgba(255,255,255,.85); }
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

</style>
