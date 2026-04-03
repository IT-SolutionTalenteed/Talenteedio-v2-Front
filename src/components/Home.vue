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
            <!-- Countdown -->
            <div class="countdown-inner" id="countdown">
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.days }}</span><span class="cd-label">{{ t('home.hero.days') }}</span></div></div>
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.hours }}</span><span class="cd-label">{{ t('home.hero.hours') }}</span></div></div>
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.minutes }}</span><span class="cd-label">{{ t('home.hero.minutes') }}</span></div></div>
              <div class="cd-item"><div class="cd-box"><span class="cd-num">{{ cd.seconds }}</span><span class="cd-label">{{ t('home.hero.seconds') }}</span></div></div>
            </div>
          </div>
          <div class="hero-right"></div>
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
          <span class="label-blue">{{ t('home.partners.label') }}</span>
          <h2>{{ t('home.partners.title') }}</h2>
          <p>{{ t('home.partners.description') }}</p>
        </div>
        <div class="partners-grid fade-in">
          <router-link
            v-for="entreprise in event.entreprises"
            :key="entreprise.id"
            to="/entreprises"
            class="partner-card"
          >
            <div class="partner-logo">
              <img v-if="entreprise.logo_url"
                   :src="entreprise.logo_url"
                   :alt="entreprise.nom">
              <span v-else class="partner-initials">
                {{ entreprise.nom.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="partner-name">{{ entreprise.nom }}</span>
          </router-link>
        </div>
        <div class="partners-cta fade-in">
          <router-link to="/entreprises" class="btn btn--blue">
            {{ t('home.partners.viewAll') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
          </router-link>
        </div>
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
                <img v-else src="https://africatalentsummit.com/wp-content/uploads/2026/02/staff-tech-accounting-discussion-office-development-feedback-budget-communication-business-project-group-collaboration-financial-firm-people-planning-with-team-scaled.jpg"
                     :alt="article.title" loading="lazy">
              </div>
              <div class="triple-card-body">
                <div style="font-size:12px;color:var(--blue);margin-bottom:6px;">{{ formatDate(article.created_at) }}</div>
                <h3>{{ article.title }}</h3>
                <p>{{ truncate(stripHtml(article.content), 120) }}</p>
                <router-link to="/login" style="color:var(--blue);font-weight:600;font-size:14px;margin-top:8px;display:inline-block;">
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

        <div v-if="offres.length" class="home-offres-list fade-in">
          <router-link
            v-for="offre in offres"
            :key="offre.id"
            :to="isLoggedIn ? `/annonces/${offre.id}` : `/login?redirect=${encodeURIComponent('/annonces/' + offre.id)}`"
            class="offre-card offre-card--link"
          >
            <!-- Visuel gauche -->
            <div class="offre-visual">
              <div class="offre-bg" :style="offre.image_url ? `background-image:url('${offre.image_url}')` : ''" :class="{ 'offre-bg--default': !offre.image_url }"></div>
              <div class="offre-logo">
                <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                <span v-else class="offre-logo-initial">{{ offre.entreprise ? offre.entreprise.nom.charAt(0) : '?' }}</span>
              </div>
            </div>
            <!-- Contenu -->
            <div class="offre-body">
              <h3 class="offre-title">{{ offre.titre }}</h3>
              <p class="offre-entreprise">{{ offre.entreprise?.nom || '—' }}</p>
              <p class="offre-desc">{{ truncate(stripHtml(offre.mission), 110) }}</p>
              <div class="offre-meta">
                <span v-if="offre.localisation"><i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}</span>
                <span v-if="offre.date_limite"><i class="fa-solid fa-calendar"></i> {{ formatDate(offre.date_limite) }}</span>
              </div>
            </div>
            <!-- Action -->
            <div class="offre-action">
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
      <div class="event-img">
        <img src="https://africatalentsummit.com/wp-content/uploads/2026/02/back-thinking-window-with-business-black-man-standing-his-office-looking-city-view-id-scaled.jpg"
             alt="Professionnel africain" loading="lazy">
      </div>
      <div class="event-info fade-in">
        <div class="event-info-arc"></div>
        <div class="event-info-arc2"></div>
        <span class="event-date">{{ eventDateRange }}</span>
        <h2>{{ event.titre }}</h2>
        <div class="event-location" v-if="event.ville">
          <i class="fa-solid fa-location-dot"></i>
          <span>{{ event.ville }}{{ event.pays ? ', ' + event.pays : '' }}</span>
        </div>
        <div class="event-countdown">
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.days, 3) }}</span><span class="ecd-label">{{ t('home.hero.days') }}</span></div>
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.hours, 2) }}</span><span class="ecd-label">{{ t('home.hero.hours') }}</span></div>
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.minutes, 2) }}</span><span class="ecd-label">{{ t('home.hero.minutes') }}</span></div>
          <div class="ecd-item"><span class="ecd-num">{{ pad(cd.seconds, 2) }}</span><span class="ecd-label">{{ t('home.hero.seconds') }}</span></div>
        </div>
        <router-link :to="`/evenements/${event.id}`" class="btn btn--blue btn--lg" style="position:relative;z-index:2;">
          {{ t('home.eventSection.participate') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
        </router-link>
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="section-cta">
      <div class="cta-watermark">{{ t('home.cta.watermark') }}</div>
      <div class="container">
        <span class="cta-label">{{ t('home.cta.label') }}</span>
        <h2>{{ t('home.cta.title') }}</h2>
        <router-link to="/register" class="btn btn--blue btn--lg">
          {{ t('home.cta.action') }} <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
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

function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.15 })
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
}
</script>

<style>
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
}
@media (max-width: 600px) {
  .quicklinks-grid { grid-template-columns: 1fr; }
}
.ql-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 28px;
  border-radius: var(--radius-lg, 14px);
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  text-decoration: none;
  border: none;
  transition: box-shadow .2s, transform .2s;
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
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
  flex-shrink: 0;
}
.ql-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}
.ql-body p {
  font-size: 14px;
  color: rgba(255,255,255,.82);
  line-height: 1.6;
  margin: 0 0 16px;
  flex: 1;
}
.ql-link {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}
.ql-link i { font-size: 11px; transition: transform .2s; }
.ql-card:hover .ql-link i { transform: translateX(4px); }

/* ── Section partenaires ──────────────────────────────── */
.section-partners {
  padding: 80px 0;
  background: #fff;
}
.partners-header {
  text-align: center;
  margin-bottom: 48px;
}
.partners-header h2 {
  margin: 8px 0 12px;
}
.partners-header p {
  color: var(--body-text);
  font-size: 16px;
}
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}
.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 16px 22px;
  background: var(--light-bg, #f5f7fa);
  border: 1.5px solid transparent;
  border-radius: var(--radius-lg, 14px);
  text-decoration: none;
  transition: border-color .2s, box-shadow .2s, transform .2s;
  cursor: pointer;
}
.partner-card:hover {
  border-color: var(--blue);
  box-shadow: 0 6px 24px rgba(0,0,0,.10);
  transform: translateY(-4px);
}
.partner-logo {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  flex-shrink: 0;
}
.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}
.partner-initials {
  font-size: 28px;
  font-weight: 800;
  color: var(--blue);
  line-height: 1;
}
.partner-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  text-align: center;
  line-height: 1.3;
}
.partners-cta {
  text-align: center;
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
.home-offres-list { display: flex; flex-direction: column; gap: 16px; }
.offre-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  display: grid; grid-template-columns: 160px 1fr auto;
  border: 1.5px solid transparent; overflow: hidden;
  transition: border-color .2s, box-shadow .2s, transform .15s;
}
.offre-card:hover { border-color: #192bc2; box-shadow: 0 6px 20px rgba(0,0,0,.10); transform: translateY(-2px); }
.offre-card--link { text-decoration: none; }
.offre-visual { position: relative; width: 160px; min-height: 110px; align-self: stretch; flex-shrink: 0; }
.offre-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.offre-bg--default { background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%); }
.offre-logo {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 52px; height: 52px; border-radius: 10px;
  background: #fff; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
}
.offre-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.offre-logo-initial { font-size: 20px; font-weight: 800; color: #192bc2; }
.offre-body { padding: 16px 20px; }
.offre-title { font-size: 16px; font-weight: 700; color: #040a5d; margin: 0 0 3px; }
.offre-entreprise { font-size: 13px; color: #6b7280; margin: 0 0 8px; }
.offre-desc { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0 0 10px; }
.offre-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: #6b7280; }
.offre-meta i { color: #f07c00; margin-right: 4px; }
.offre-action { padding: 16px 16px 16px 0; display: flex; align-items: center; flex-shrink: 0; }
@media (max-width: 640px) {
  .offre-card { grid-template-columns: 100px 1fr; }
  .offre-action { grid-column: 1 / -1; padding: 0 16px 16px; }
}
</style>
