<template>
  <div>
    <!-- ══ TOPBAR ÉVÉNEMENT FEATURED ══ -->
    <div v-if="featuredEvent" class="topbar">
      <div class="topbar-inner container">
        <div class="topbar-left">
          <span class="topbar-pulse"></span>
          <span class="topbar-evt">{{ featuredEvent.titre }}</span>
        </div>
        <div class="topbar-countdown">
          <div class="cd-unit-wrap">
            <span class="cd-num">{{ countdown.days }}</span>
            <span class="cd-lbl">j</span>
          </div>
          <span class="cd-colon">:</span>
          <div class="cd-unit-wrap">
            <span class="cd-num">{{ countdown.hours }}</span>
            <span class="cd-lbl">h</span>
          </div>
          <span class="cd-colon">:</span>
          <div class="cd-unit-wrap">
            <span class="cd-num">{{ countdown.minutes }}</span>
            <span class="cd-lbl">m</span>
          </div>
          <span class="cd-colon">:</span>
          <div class="cd-unit-wrap">
            <span class="cd-num">{{ countdown.seconds }}</span>
            <span class="cd-lbl">s</span>
          </div>
        </div>
        <router-link :to="`/evenements/${featuredEvent.id}`" class="topbar-cta">
          {{ t('nav.learnMore') }} <i class="fa-solid fa-arrow-right"></i>
        </router-link>
      </div>
    </div>

    <!-- ══ HEADER ══ -->
    <header class="site-header" :class="{ 'site-header--scrolled': isScrolled }">
      <div class="container header-inner">

        <!-- Logo -->
        <router-link to="/" class="site-logo" @click="menuOpen = false">
          <img src="/logo.png" alt="Talenteed" height="56" />
          <span class="site-tagline">{{ t('home.tagline') }}</span>
        </router-link>

        <!-- Nav desktop -->
        <nav class="site-nav" :class="{ 'site-nav--open': menuOpen }">
          <button class="nav-close" @click="menuOpen = false" aria-label="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <ul class="nav-list">
            <li>
              <router-link to="/" exact-active-class="nav-link--active" class="nav-link" @click="menuOpen = false">
                {{ t('nav.home') }}
              </router-link>
            </li>

            <!-- Mega menu Annonces -->
            <li class="has-mega" @mouseenter="activeMega = 'jobs'" @mouseleave="activeMega = null">
              <button class="nav-link mega-trigger" :class="{ 'nav-link--active': activeMega === 'jobs' }">
                {{ t('nav.announcements') }}
                <i class="fa-solid fa-chevron-down nav-chevron" :class="{ 'nav-chevron--open': activeMega === 'jobs' }"></i>
              </button>
              <div class="mega-panel" :class="{ 'mega-panel--open': activeMega === 'jobs' }">
                <div class="mega-aside">
                  <div class="mega-aside-label">{{ t('nav.megaJobs.heroTitle') }}</div>
                  <p class="mega-aside-desc">{{ t('nav.megaJobs.heroDesc') }}</p>
                </div>
                <div class="mega-links">
                  <router-link to="/annonces" class="mega-link" @click="activeMega = null; menuOpen = false">
                    <span class="mega-link-icon"><i class="fa-solid fa-briefcase"></i></span>
                    <span class="mega-link-body">
                      <strong>{{ t('nav.jobs') }}</strong>
                      <small>{{ t('nav.jobsDesc') }}</small>
                    </span>
                    <i class="fa-solid fa-arrow-right mega-link-arrow"></i>
                  </router-link>
                  <router-link to="/entreprises" class="mega-link" @click="activeMega = null; menuOpen = false">
                    <span class="mega-link-icon"><i class="fa-solid fa-building"></i></span>
                    <span class="mega-link-body">
                      <strong>{{ t('nav.companies') }}</strong>
                      <small>{{ t('nav.companiesDesc') }}</small>
                    </span>
                    <i class="fa-solid fa-arrow-right mega-link-arrow"></i>
                  </router-link>
                </div>
              </div>
            </li>

            <!-- Mega menu Événements -->
            <li class="has-mega" @mouseenter="activeMega = 'events'" @mouseleave="activeMega = null">
              <button class="nav-link mega-trigger" :class="{ 'nav-link--active': activeMega === 'events' }">
                {{ t('nav.events') }}
                <i class="fa-solid fa-chevron-down nav-chevron" :class="{ 'nav-chevron--open': activeMega === 'events' }"></i>
              </button>
              <div class="mega-panel" :class="{ 'mega-panel--open': activeMega === 'events' }">
                <div class="mega-aside">
                  <div class="mega-aside-label">{{ t('nav.megaEvents.heroTitle') }}</div>
                  <p class="mega-aside-desc">{{ t('nav.megaEvents.heroDesc') }}</p>
                </div>
                <div class="mega-links">
                  <template v-if="categories.length">
                    <router-link
                      v-for="cat in categories"
                      :key="cat.id"
                      :to="`/evenements/categorie/${cat.id}`"
                      class="mega-link"
                      @click="activeMega = null; menuOpen = false"
                    >
                      <span class="mega-link-icon"><i class="fa-solid fa-calendar-days"></i></span>
                      <span class="mega-link-body">
                        <strong>{{ cat.titre }}</strong>
                      </span>
                      <i class="fa-solid fa-arrow-right mega-link-arrow"></i>
                    </router-link>
                  </template>
                  <div v-else class="mega-link mega-link--empty">
                    <span class="mega-link-icon"><i class="fa-solid fa-calendar-xmark"></i></span>
                    <span class="mega-link-body"><strong>{{ t('nav.noEvents') }}</strong></span>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <router-link to="/blog" active-class="nav-link--active" class="nav-link" @click="menuOpen = false">
                {{ t('nav.articles') }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Actions droite -->
        <div class="header-actions">

          <!-- Favoris talent -->
          <div v-if="isLoggedIn && userRole === 'talent'" class="fav-wrap" ref="favoriWrapRef">
            <button class="fav-btn" :class="{ 'fav-btn--active': favoris.length > 0 }" @click="favoriOpen = !favoriOpen" aria-label="Mes favoris">
              <i :class="favoris.length > 0 ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              <span v-if="favoris.length" class="fav-count">{{ favoris.length > 9 ? '9+' : favoris.length }}</span>
            </button>
            <Transition name="drop">
              <div v-if="favoriOpen" class="fav-dropdown">
                <div class="fav-dropdown-head">
                  <span><i class="fa-solid fa-heart"></i> {{ t('favorites.title') }}</span>
                  <span class="fav-total">{{ favoris.length }}</span>
                </div>
                <div v-if="!favoris.length" class="fav-empty">
                  <i class="fa-regular fa-heart"></i>
                  <p>{{ t('favorites.empty') }}</p>
                </div>
                <ul v-else class="fav-list">
                  <li v-for="offre in favoris" :key="offre.id" class="fav-item">
                    <router-link :to="`/annonces/${offre.id}`" class="fav-item-link" @click="favoriOpen = false">
                      <div class="fav-logo">
                        <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" />
                        <span v-else>{{ offre.entreprise?.nom?.charAt(0) || '?' }}</span>
                      </div>
                      <div class="fav-info">
                        <p class="fav-titre">{{ offre.titre }}</p>
                        <p class="fav-ent">{{ offre.entreprise?.nom || '—' }}</p>
                      </div>
                    </router-link>
                    <button class="fav-rm" @click="removeFavori(offre.id)"><i class="fa-solid fa-xmark"></i></button>
                  </li>
                </ul>
                <router-link v-if="favoris.length" to="/favoris" class="fav-footer" @click="favoriOpen = false">
                  {{ t('favorites.viewAll') }} <i class="fa-solid fa-arrow-right"></i>
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- Langue -->
          <div class="lang-wrap">
            <button class="lang-btn">
              <span>{{ locale === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
              <i class="fa-solid fa-chevron-down lang-chevron"></i>
            </button>
            <div class="lang-dropdown">
              <button class="lang-option" :class="{ 'lang-option--active': locale === 'fr' }" @click="setLocale('fr')">
                <span>🇫🇷</span> {{ t('language.french') }}
                <i v-if="locale === 'fr'" class="fa-solid fa-check"></i>
              </button>
              <button class="lang-option" :class="{ 'lang-option--active': locale === 'en' }" @click="setLocale('en')">
                <span>🇬🇧</span> {{ t('language.english') }}
                <i v-if="locale === 'en'" class="fa-solid fa-check"></i>
              </button>
            </div>
          </div>

          <!-- Non-connecté -->
          <template v-if="!isLoggedIn">
            <router-link to="/register" class="btn-nav btn-nav--outline">{{ t('nav.subscription') }}</router-link>
            <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn-nav btn-nav--filled">{{ t('nav.login') }}</router-link>
          </template>

          <!-- Connecté -->
          <div v-else class="user-wrap" ref="userWrapRef">
            <button class="user-pill" @click.stop="userOpen = !userOpen">
              <span class="user-avatar"><i class="fa-solid fa-user"></i></span>
              <span class="user-name">{{ userName }}</span>
              <i class="fa-solid fa-chevron-down user-chevron" :class="{ 'user-chevron--open': userOpen }"></i>
            </button>
            <Transition name="drop">
              <div v-if="userOpen" class="user-dropdown">
                <router-link :to="dashboardRoute" class="user-item" @click="userOpen = false">
                  <i class="fa-solid fa-gauge"></i> {{ t('nav.dashboard') }}
                </router-link>
                <div class="user-sep"></div>
                <button class="user-item user-item--danger" @click="logout">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i> {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>

        </div>

        <!-- Burger -->
        <button class="burger" :class="{ 'burger--open': menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>

      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useFavoris } from '../composables/useFavoris.js'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route   = useRoute()
const router  = useRouter()
const { locale, t } = useI18n()

const categories    = ref([])
const isScrolled    = ref(false)
const menuOpen      = ref(false)
const activeMega    = ref(null)
const featuredEvent = ref(null)
const countdown     = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let   countdownTimer = null

const isLoggedIn = ref(!!localStorage.getItem('token'))
const userRole   = ref(localStorage.getItem('userRole') || '')
const userName   = computed(() => {
  const n = localStorage.getItem('userName') || localStorage.getItem('userEmail') || ''
  return n.split(' ')[0].toUpperCase() || t('nav.myAccount')
})
const dashboardRoute = computed(() =>
  ({ admin: '/admin', talent: '/talent', entreprise: '/entreprise' }[userRole.value] || '/login')
)

function setLocale(l) {
  locale.value = l
  localStorage.setItem('locale', l)
}

const { favoris, loadFavoris, removeFavori } = useFavoris()
const favoriOpen    = ref(false)
const favoriWrapRef = ref(null)
const userOpen      = ref(false)
const userWrapRef   = ref(null)

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  userOpen.value = false
  router.push('/login')
}

watch(() => route.fullPath, () => {
  isLoggedIn.value = !!localStorage.getItem('token')
  userRole.value   = localStorage.getItem('userRole') || ''
  if (isLoggedIn.value && userRole.value === 'talent') loadFavoris()
  menuOpen.value = favoriOpen.value = userOpen.value = false
  activeMega.value = null
})

function onClickOutside(e) {
  if (favoriWrapRef.value && !favoriWrapRef.value.contains(e.target)) favoriOpen.value = false
  if (userWrapRef.value   && !userWrapRef.value.contains(e.target))   userOpen.value   = false
}

function onScroll() { isScrolled.value = window.scrollY > 50 }

function pad(n) { return String(n).padStart(2, '0') }
function tickCountdown(target) {
  const diff = target - Date.now()
  if (diff <= 0) { countdown.value = { days:'00', hours:'00', minutes:'00', seconds:'00' }; return }
  const s = Math.floor(diff / 1000)
  countdown.value = { days: pad(Math.floor(s/86400)), hours: pad(Math.floor((s%86400)/3600)), minutes: pad(Math.floor((s%3600)/60)), seconds: pad(s%60) }
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
  loadFavoris()
  try {
    const [catRes, evRes] = await Promise.all([
      axios.get(`${apiBase}/public/categories-evenements`),
      axios.get(`${apiBase}/public/featured-event`),
    ])
    categories.value = catRes.data
    if (evRes.data) {
      featuredEvent.value = evRes.data
      const target = new Date(`${evRes.data.date_debut.substring(0,10)}T${(evRes.data.heure_debut_journee||'00:00').substring(0,5)}:00`).getTime()
      tickCountdown(target)
      countdownTimer = setInterval(() => tickCountdown(target), 1000)
    }
  } catch {}
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap');

/* ════════════════════════════════
   TOPBAR
════════════════════════════════ */
.topbar {
  background: #00235a;
  height: 48px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* ligne lumineuse animée */
.topbar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(58,155,255,.08) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: topbar-sweep 4s linear infinite;
}
@keyframes topbar-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.topbar-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f29f1f;
  box-shadow: 0 0 0 0 rgba(242,159,31,.6);
  animation: pulse-ring 2s ease-out infinite;
  flex-shrink: 0;
}
@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(242,159,31,.6); }
  70%  { box-shadow: 0 0 0 7px rgba(242,159,31,0); }
  100% { box-shadow: 0 0 0 0 rgba(242,159,31,0); }
}

.topbar-evt {
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Countdown */
.topbar-countdown {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.cd-unit-wrap {
  display: flex;
  align-items: baseline;
  gap: 2px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 6px;
  padding: 3px 9px;
}

.cd-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  min-width: 22px;
  text-align: center;
}

.cd-lbl {
  font-size: 10px;
  font-weight: 700;
  color: #f29f1f;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.cd-colon {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: rgba(255,255,255,.3);
  padding-bottom: 2px;
}

.topbar-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: #f29f1f;
  border-radius: 50px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background .15s, transform .15s;
  font-family: 'Open Sans', sans-serif;
}
.topbar-cta:hover { background: #e08e0a; transform: translateY(-1px); }
.topbar-cta i { font-size: 10px; }

/* ════════════════════════════════
   HEADER
════════════════════════════════ */
.site-header {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 0 #e0e4ef;
  transition: box-shadow .25s;
  font-family: 'Open Sans', sans-serif;
}
.site-header--scrolled {
  box-shadow: 0 4px 24px rgba(0,35,90,.10);
}

.header-inner {
  display: flex;
  align-items: center;
  height: 72px;
  gap: 24px;
}

/* ── Logo ── */
.site-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  text-decoration: none;
  flex-shrink: 0;
}
.site-logo img { height: 52px; width: auto; }
.site-tagline {
  font-size: 10px;
  font-weight: 700;
  color: #f29f1f;
  letter-spacing: .5px;
  text-transform: uppercase;
}

/* ── Nav ── */
.site-nav { flex: 1; display: flex; justify-content: center; }

.nav-list {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0; padding: 0;
  list-style: none;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  letter-spacing: .2px;
  font-family: 'Open Sans', sans-serif;
  transition: color .15s, background .15s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px; left: 14px; right: 14px;
  height: 2px;
  background: #3a9bff;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .2s ease;
}
.nav-link:hover,
.nav-link--active {
  color: #00235a;
}
.nav-link:hover::after,
.nav-link--active::after {
  transform: scaleX(1);
}

.nav-chevron {
  font-size: 9px;
  transition: transform .2s;
}
.nav-chevron--open { transform: rotate(180deg); }

/* ── Mega panel ── */
.has-mega { position: relative; }
.has-mega::after {
  content: '';
  position: absolute;
  top: 100%; left: 0; right: 0;
  height: 12px;
}

.mega-panel {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  display: flex;
  flex-direction: row;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,35,90,.16), 0 0 0 1px rgba(0,35,90,.06);
  min-width: 660px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
  z-index: 300;
}

.mega-panel--open {
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: translateX(-50%) translateY(0) !important;
}

/* Aside gauche */
.mega-aside {
  background: linear-gradient(160deg, #00235a 0%, #00235a 60%, #1a3a8a 100%);
  padding: 36px 32px 36px 36px;
  min-width: 260px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  flex-shrink: 0;
}

.mega-aside-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 30px;
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: .3px;
}

.mega-aside-desc {
  font-size: 13px;
  color: rgba(255,255,255,.65);
  line-height: 1.7;
  margin: 0;
}

/* Liens droite */
.mega-links {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  background: #fff;
}

.mega-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 12px;
  border-radius: 0;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #f0f2f8;
  transition: background .15s;
  cursor: pointer;
}
.mega-link:last-child { border-bottom: none; }
.mega-link:hover { background: #f7f9ff; border-radius: 10px; }
.mega-link:hover .mega-link-arrow { color: #3a9bff; transform: translateX(2px); }
.mega-link--empty { opacity: .5; pointer-events: none; }

.mega-link-icon {
  display: none;
}

.mega-link-body {
  flex: 1;
  min-width: 0;
}
.mega-link-body strong {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: #00235a;
  margin-bottom: 3px;
}
.mega-link-body small {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.45;
}

.mega-link-arrow {
  font-size: 12px;
  color: #c5cdd8;
  transition: color .15s, transform .15s;
  flex-shrink: 0;
}

/* ── Actions ── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

/* Favoris */
.fav-wrap { position: relative; }
.fav-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  width: 38px; height: 38px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  color: #9ca3af;
  transition: color .15s, background .15s;
}
.fav-btn:hover { color: #f43f5e; background: #fff5f7; }
.fav-btn--active { color: #f43f5e; }
.fav-count {
  position: absolute; top: 2px; right: 2px;
  background: #f43f5e; color: #fff;
  font-size: 9px; font-weight: 800;
  min-width: 15px; height: 15px;
  border-radius: 50px; padding: 0 3px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff;
}
.fav-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 300px; background: #fff; border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0,35,90,.14);
  border: 1px solid #e0e4ef;
  border-top: 3px solid #f43f5e;
  z-index: 400; overflow: hidden;
}
.fav-dropdown-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 15px; font-size: 13px; font-weight: 700; color: #00235a;
  border-bottom: 1px solid #f0f2f8;
}
.fav-dropdown-head i { color: #f43f5e; margin-right: 5px; }
.fav-total { background: #f43f5e; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 50px; }
.fav-empty { padding: 20px 15px; text-align: center; color: #94a3b8; }
.fav-empty i { font-size: 24px; opacity: .25; display: block; margin-bottom: 7px; }
.fav-empty p { font-size: 12px; margin: 0; }
.fav-list { margin: 0; padding: 6px; max-height: 280px; overflow-y: auto; }
.fav-item { display: flex; align-items: center; border-radius: 8px; transition: background .12s; }
.fav-item:hover { background: #f8f9ff; }
.fav-item-link { flex: 1; display: flex; align-items: center; gap: 9px; padding: 8px 7px; text-decoration: none; min-width: 0; }
.fav-logo { width: 32px; height: 32px; border-radius: 7px; flex-shrink: 0; background: #f4f5fb; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fav-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.fav-logo span { font-size: 12px; font-weight: 800; color: #3a9bff; }
.fav-titre { font-size: 12px; font-weight: 600; color: #1e293b; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-ent   { font-size: 11px; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-rm { flex-shrink: 0; background: none; border: none; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #cbd5e1; transition: background .12s, color .12s; margin-right: 7px; }
.fav-rm:hover { background: #fee2e2; color: #f43f5e; }
.fav-footer { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 15px; font-size: 12px; font-weight: 700; color: #3a9bff; text-decoration: none; border-top: 1px solid #f0f2f8; transition: background .12s; }
.fav-footer:hover { background: #f8f9ff; }

/* Langue */
.lang-wrap { position: relative; }
.lang-wrap::after {
  content: '';
  position: absolute;
  top: 100%; left: 0; right: 0;
  height: 10px;
}
.lang-btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  padding: 7px 10px; border-radius: 8px;
  font-size: 16px;
  transition: background .15s;
}
.lang-btn:hover, .lang-wrap:hover .lang-btn { background: #f5f7fc; }
.lang-chevron {
  font-size: 9px; color: #9ca3af;
  transition: transform .2s;
}
.lang-wrap:hover .lang-chevron { transform: rotate(180deg); }
.lang-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,35,90,.13);
  border: 1px solid #e0e4ef;
  padding: 6px; min-width: 150px; z-index: 300;
  display: none; flex-direction: column; gap: 2px;
}
.lang-wrap:hover .lang-dropdown { display: flex; }
.lang-option {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 8px 12px; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: #374151;
  background: none; border: none; cursor: pointer;
  transition: background .12s;
  font-family: 'Open Sans', sans-serif;
}
.lang-option:hover { background: #f5f7fc; }
.lang-option--active { font-weight: 700; color: #00235a; }
.lang-option i { margin-left: auto; font-size: 10px; color: #3a9bff; }

/* Boutons auth */
.btn-nav {
  display: inline-flex; align-items: center;
  padding: 8px 18px; border-radius: 8px;
  font-size: 13px; font-weight: 700;
  text-decoration: none; cursor: pointer;
  white-space: nowrap; border: 2px solid transparent;
  font-family: 'Open Sans', sans-serif;
  transition: all .15s;
}
.btn-nav--outline {
  color: #00235a;
  border-color: #e0e4ef;
  background: #fff;
}
.btn-nav--outline:hover { border-color: #00235a; background: #f5f8ff; }
.btn-nav--filled {
  background: #00235a;
  color: #fff;
  border-color: #00235a;
}
.btn-nav--filled:hover { background: #001a45; transform: translateY(-1px); }

/* User */
.user-wrap { position: relative; }
.user-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 8px;
  background: none; border: 1.5px solid #e0e4ef; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #374151;
  font-family: 'Open Sans', sans-serif;
  transition: border-color .15s, background .15s;
}
.user-pill:hover { border-color: #3a9bff; color: #00235a; background: #f5f8ff; }
.user-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: #eef2ff; display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #3a9bff; flex-shrink: 0;
}
.user-name { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-chevron { font-size: 9px; color: #9ca3af; transition: transform .2s; }
.user-chevron--open { transform: rotate(180deg); }
.user-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,35,90,.12);
  border: 1px solid #e0e4ef; padding: 6px; min-width: 180px; z-index: 400;
}
.user-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 12px; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: #374151;
  text-decoration: none; background: none; border: none;
  cursor: pointer; transition: background .12s, color .12s;
  font-family: 'Open Sans', sans-serif;
}
.user-item i { font-size: 13px; color: #9ca3af; width: 16px; text-align: center; }
.user-item:hover { background: #f5f8ff; color: #00235a; }
.user-item:hover i { color: #3a9bff; }
.user-item--danger:hover { background: #fff5f5; color: #ef4444; }
.user-item--danger:hover i { color: #ef4444; }
.user-sep { height: 1px; background: #f0f2f8; margin: 4px 6px; }

/* Transitions dropdown */
.drop-enter-active, .drop-leave-active { transition: opacity .16s ease, transform .16s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

/* Burger */
.burger {
  display: none;
  flex-direction: column; justify-content: center; gap: 5px;
  padding: 8px; background: none; border: none; cursor: pointer;
}
.burger span { width: 22px; height: 2px; background: #00235a; border-radius: 2px; display: block; transition: transform .25s, opacity .25s; }
.burger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger--open span:nth-child(2) { opacity: 0; }
.burger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Bouton fermer nav mobile */
.nav-close { display: none; }

/* Container */
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* ════════════════════════════════
   RESPONSIVE
════════════════════════════════ */
@media (max-width: 900px) {
  .burger { display: flex; }

  .site-nav {
    display: none;
    position: fixed; inset: 0; z-index: 1100;
    background: #00235a;
    flex-direction: column; align-items: center; justify-content: flex-start;
    padding: 72px 24px 40px; overflow-y: auto;
  }
  .site-nav--open { display: flex; }

  .nav-close {
    display: flex; align-items: center; justify-content: center;
    position: absolute; top: 18px; right: 18px;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.2);
    color: #fff; font-size: 20px; cursor: pointer;
    transition: background .15s;
  }
  .nav-close:hover { background: rgba(255,255,255,.22); }

  .nav-list { flex-direction: column; gap: 2px; width: 100%; max-width: 340px; }

  .nav-link {
    color: rgba(255,255,255,.8); font-size: 15px; padding: 11px 16px;
    width: 100%; border-radius: 10px;
  }
  .nav-link::after { display: none; }
  .nav-link:hover, .nav-link--active { background: rgba(255,255,255,.1); color: #fff; }

  .has-mega::after { display: none; }
  .mega-trigger { color: rgba(255,255,255,.4) !important; font-size: 11px !important;
    letter-spacing: 1.5px; padding: 14px 16px 6px !important; cursor: default; text-transform: uppercase; }
  .mega-trigger .nav-chevron { display: none; }

  .mega-panel {
    display: flex !important;
    flex-direction: column;
    position: static; transform: none;
    box-shadow: none; border: none;
    background: transparent;
    min-width: unset; opacity: 1; pointer-events: auto;
    padding: 0 0 10px;
  }
  .mega-aside { display: none; }
  .mega-links { padding: 0; gap: 2px; }
  .mega-link {
    padding: 10px 16px; border-radius: 10px;
    color: rgba(255,255,255,.85);
  }
  .mega-link:hover { background: rgba(255,255,255,.1); }
  .mega-link-body strong { color: rgba(255,255,255,.9); font-size: 14px; }
  .mega-link-body small  { color: rgba(255,255,255,.5); font-size: 12px; }
  .mega-link-icon { background: rgba(255,255,255,.1); color: #f29f1f; }
  .mega-link-arrow { display: none; }

  .header-actions .lang-wrap,
  .header-actions .fav-wrap { display: none; }
  .topbar-cta { display: none; }
  .topbar-evt { max-width: 180px; }
}

@media (max-width: 600px) {
  .header-actions { display: none; }
  .burger { margin-left: auto; }
  .site-logo img { height: 44px; }
  .topbar-evt { max-width: 120px; }
  .topbar-countdown { display: none; }
}
</style>
