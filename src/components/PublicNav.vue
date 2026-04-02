<template>
  <div>
    <!-- ══ TOP BAR (countdown événement featured) ══ -->
    <div v-if="featuredEvent" class="topbar">
      <div class="container">
        <div class="topbar-left">
          <span class="topbar-dot"></span>
          <span class="topbar-label">{{ featuredEvent.titre }}</span>
        </div>
        <div class="countdown-blocks">
          <div class="cd-block"><span class="cd-num">{{ countdown.days }}</span><span class="cd-unit">J</span></div>
          <span class="cd-sep">:</span>
          <div class="cd-block"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-unit">H</span></div>
          <span class="cd-sep">:</span>
          <div class="cd-block"><span class="cd-num">{{ countdown.minutes }}</span><span class="cd-unit">M</span></div>
          <span class="cd-sep">:</span>
          <div class="cd-block"><span class="cd-num">{{ countdown.seconds }}</span><span class="cd-unit">S</span></div>
        </div>
        <div class="cta">
          <router-link :to="`/evenements/${featuredEvent.id}`" class="topbar-link">
            {{ t('nav.learnMore') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- ══ HEADER ══ -->
    <header class="site-header" :class="{ scrolled: isScrolled }">
      <div class="container">
        <div class="header-inner">

          <!-- Logo -->
          <router-link to="/" class="site-logo" @click="menuOpen = false">
            <img src="/logo.png" alt="Talenteed" width="185" height="64">
            <span class="site-tagline">{{ t('home.tagline') }}</span>
          </router-link>

          <!-- Nav desktop -->
          <nav class="site-nav" :class="{ open: menuOpen }">
            <ul>
              <li>
                <router-link to="/" exact-active-class="active" @click="menuOpen = false">{{ t('nav.home') }}</router-link>
              </li>

              <!-- Mega menu Annonces -->
              <li class="has-mega">
                <a href="#" @click.prevent class="mega-trigger">
                  {{ t('nav.announcements') }} <i class="fa-solid fa-chevron-down nav-chevron"></i>
                </a>
                <div class="mega-menu">
                  <div class="mega-hero">
                    <div class="mega-hero-icon"><i class="fa-solid fa-briefcase"></i></div>
                    <div class="mega-hero-title">{{ t('nav.megaJobs.heroTitle') }}</div>
                    <div class="mega-hero-desc">{{ t('nav.megaJobs.heroDesc') }}</div>
                  </div>
                  <div class="mega-divider"></div>
                  <div class="mega-items">
                    <router-link to="/annonces" class="mega-item" @click="menuOpen = false">
                      <i class="fa-solid fa-briefcase mega-icon"></i>
                      <div><strong>{{ t('nav.jobs') }}</strong><small>{{ t('nav.jobsDesc') }}</small></div>
                    </router-link>
                    <router-link to="/entreprises" class="mega-item" @click="menuOpen = false">
                      <i class="fa-solid fa-building mega-icon"></i>
                      <div><strong>{{ t('nav.companies') }}</strong><small>{{ t('nav.companiesDesc') }}</small></div>
                    </router-link>
                  </div>
                </div>
              </li>

              <!-- Mega menu Événements -->
              <li class="has-mega">
                <a href="#" @click.prevent class="mega-trigger">
                  {{ t('nav.events') }} <i class="fa-solid fa-chevron-down nav-chevron"></i>
                </a>
                <div class="mega-menu">
                  <div class="mega-hero">
                    <div class="mega-hero-icon mega-hero-icon--orange"><i class="fa-solid fa-calendar-days"></i></div>
                    <div class="mega-hero-title">{{ t('nav.megaEvents.heroTitle') }}</div>
                    <div class="mega-hero-desc">{{ t('nav.megaEvents.heroDesc') }}</div>
                  </div>
                  <div class="mega-divider"></div>
                  <div class="mega-items">
                    <template v-if="categories.length">
                      <router-link
                        v-for="cat in categories" :key="cat.id"
                        :to="`/evenements/categorie/${cat.id}`"
                        class="mega-item"
                        @click="menuOpen = false"
                      >
                        <i class="fa-solid fa-calendar-days mega-icon"></i>
                        <div><strong>{{ cat.titre }}</strong></div>
                      </router-link>
                    </template>
                    <div v-else class="mega-item mega-item--empty">
                      <i class="fa-solid fa-calendar-xmark mega-icon"></i>
                      <div><strong>{{ t('nav.noEvents') }}</strong></div>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <router-link to="/blog" active-class="active" @click="menuOpen = false">{{ t('nav.articles') }}</router-link>
              </li>
            </ul>
          </nav>

          <!-- Actions droite -->
          <div class="header-btns">

            <!-- Favoris (talent) -->
            <div v-if="isLoggedIn && userRole === 'talent'" class="favori-wrap" ref="favoriWrapRef">
              <button class="fav-btn" :class="{ 'fav-btn--active': favoris.length > 0 }" @click="favoriOpen = !favoriOpen" aria-label="Mes favoris">
                <i :class="favoris.length > 0 ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                <span v-if="favoris.length" class="fav-badge">{{ favoris.length > 9 ? '9+' : favoris.length }}</span>
              </button>
              <Transition name="drop-anim">
                <div v-if="favoriOpen" class="favori-dropdown">
                  <div class="favori-head">
                    <span><i class="fa-solid fa-heart"></i> {{ t('favorites.title') }}</span>
                    <span class="fav-count">{{ favoris.length }}</span>
                  </div>
                  <div v-if="!favoris.length" class="favori-empty">
                    <i class="fa-regular fa-heart"></i>
                    <p>{{ t('favorites.empty') }}</p>
                  </div>
                  <ul v-else class="favori-list">
                    <li v-for="offre in favoris" :key="offre.id" class="favori-item">
                      <router-link :to="`/annonces/${offre.id}`" class="favori-link" @click="favoriOpen = false">
                        <div class="favori-logo">
                          <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" />
                          <span v-else>{{ offre.entreprise?.nom?.charAt(0) || '?' }}</span>
                        </div>
                        <div class="favori-info">
                          <p class="favori-titre">{{ offre.titre }}</p>
                          <p class="favori-ent">{{ offre.entreprise?.nom || '—' }}</p>
                        </div>
                      </router-link>
                      <button class="favori-rm" @click="removeFavori(offre.id)"><i class="fa-solid fa-xmark"></i></button>
                    </li>
                  </ul>
                  <router-link v-if="favoris.length" to="/favoris" class="favori-footer" @click="favoriOpen = false">
                    {{ t('favorites.viewAll') }} <i class="fa-solid fa-arrow-right"></i>
                  </router-link>
                </div>
              </Transition>
            </div>

            <!-- Switcher langue -->
            <div class="has-lang">
              <button class="lang-trigger">
                <span>{{ locale === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
                {{ t(`language.${locale === 'fr' ? 'french' : 'english'}`) }}
                <i class="fa-solid fa-chevron-down nav-chevron"></i>
              </button>
              <div class="lang-menu">
                <button class="lang-item" :class="{ active: locale === 'fr' }" @click="setLocale('fr')">
                  <span>🇫🇷</span> {{ t('language.french') }}
                  <i v-if="locale === 'fr'" class="fa-solid fa-check lang-check"></i>
                </button>
                <button class="lang-item" :class="{ active: locale === 'en' }" @click="setLocale('en')">
                  <span>🇬🇧</span> {{ t('language.english') }}
                  <i v-if="locale === 'en'" class="fa-solid fa-check lang-check"></i>
                </button>
              </div>
            </div>

            <!-- Non-connecté -->
            <template v-if="!isLoggedIn">
              <router-link to="/register" class="btn btn--orange btn--sm">{{ t('nav.subscription') }}</router-link>
              <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn btn--blue btn--sm">{{ t('nav.login') }}</router-link>
            </template>

            <!-- Connecté : dropdown utilisateur -->
            <div v-else class="user-wrap" ref="userWrapRef">
              <button class="user-pill" @click.stop="userOpen = !userOpen">
                <span class="user-avatar"><i class="fa-solid fa-user"></i></span>
                <span class="user-name">{{ userName }}</span>
                <i class="fa-solid fa-chevron-down user-chevron" :class="{ open: userOpen }"></i>
              </button>
              <Transition name="drop-anim">
                <div v-if="userOpen" class="user-dropdown">
                  <router-link :to="dashboardRoute" class="user-item" @click="userOpen = false">
                    <i class="fa-solid fa-gauge"></i> {{ t('nav.dashboard') }}
                  </router-link>
                  <div class="user-divider"></div>
                  <button class="user-item user-item--danger" @click="logout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> {{ t('nav.logout') }}
                  </button>
                </div>
              </Transition>
            </div>

          </div>

          <!-- Burger mobile -->
          <button class="menu-toggle" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>

        </div>
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
const featuredEvent = ref(null)
const countdown     = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let   countdownTimer = null

// ── Auth ─────────────────────────────────────────────────
const isLoggedIn = ref(!!localStorage.getItem('token'))
const userRole   = ref(localStorage.getItem('userRole') || '')
const userName   = computed(() => {
  const n = localStorage.getItem('userName') || localStorage.getItem('userEmail') || ''
  return n.split(' ')[0].toUpperCase() || t('nav.myAccount')
})
const dashboardRoute = computed(() =>
  ({ admin: '/admin', talent: '/talent', entreprise: '/entreprise' }[userRole.value] || '/login')
)

// ── Langue ───────────────────────────────────────────────
function setLocale(l) { 
  locale.value = l
  localStorage.setItem('locale', l)
}

// ── Favoris ──────────────────────────────────────────────
const { favoris, loadFavoris, removeFavori } = useFavoris()
const favoriOpen    = ref(false)
const favoriWrapRef = ref(null)

// ── User dropdown ────────────────────────────────────────
const userOpen    = ref(false)
const userWrapRef = ref(null)

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  userOpen.value = false
  router.push('/login')
}

// ── Sync auth sur navigation ──────────────────────────────
watch(() => route.fullPath, () => {
  isLoggedIn.value = !!localStorage.getItem('token')
  userRole.value   = localStorage.getItem('userRole') || ''
  if (isLoggedIn.value && userRole.value === 'talent') loadFavoris()
  menuOpen.value = false
  favoriOpen.value = false
  userOpen.value = false
})

// ── Click outside ────────────────────────────────────────
function onClickOutside(e) {
  if (favoriWrapRef.value && !favoriWrapRef.value.contains(e.target)) favoriOpen.value = false
  if (userWrapRef.value   && !userWrapRef.value.contains(e.target))   userOpen.value   = false
}

// ── Scroll ───────────────────────────────────────────────
function onScroll() { isScrolled.value = window.scrollY > 50 }

// ── Countdown ────────────────────────────────────────────
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
/* ── Topbar ──────────────────────────────────────────── */
.topbar { background: #040a5d; height: 52px; color: rgba(255,255,255,.6); display: flex; align-items: center; }
.topbar .container { display: flex; align-items: center; justify-content: space-between; gap: 24px; width: 100%; }
.topbar-left  { display: flex; align-items: center; gap: 10px; min-width: 0; }
.topbar-right { display: flex; align-items: center; justify-content: flex-end; flex: 1; }
.topbar-right a { color: rgba(255,255,255,.5); font-size: 13px; transition: color .15s; text-decoration: none; }
.topbar-right a:hover { color: #f07c00; }
.topbar-dot { width: 8px; height: 8px; border-radius: 50%; background: #f07c00; box-shadow: 0 0 7px #f07c00; animation: blink 2s infinite; flex-shrink: 0; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
.topbar-label { color: #fff; font-weight: 700; font-size: 15px; max-width: 340px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.countdown-blocks { display: flex; align-items: center; gap: 6px; }
.cd-block { display: flex; flex-direction: row; align-items: center; gap: 3px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); border-radius: 6px; padding: 5px 12px; }
.cd-num   { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.cd-unit  { font-size: 13px; font-weight: 700; color: #f07c00; text-transform: uppercase; letter-spacing: 1px; }
.cd-sep   { font-size: 20px; font-weight: 800; color: rgba(255,255,255,.4); margin: 0 2px; padding-bottom: 8px; }
.topbar-link { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; background: #f07c00; color: #fff; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .15s; }
.topbar-link:hover { background: #d96b00; }

/* ── Header ──────────────────────────────────────────── */
.site-header {
  background: #fff; position: sticky; top: 0; z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  transition: box-shadow .25s;
}
.site-header.scrolled { box-shadow: 0 4px 24px rgba(4,10,93,.12); }
.header-inner { display: flex; align-items: center; height: 80px; gap: 20px; }

/* Logo */
.site-logo { display: flex; flex-direction: column; align-items: center; gap: 0; text-decoration: none; flex-shrink: 0; }
.site-logo img { height: 72px; width: auto; }
.site-tagline { font-size: 12px; font-weight: 700; color: #f07c00; letter-spacing: .4px; text-align: center; }

/* Nav */
.site-nav { flex: 1; display: flex; justify-content: center; }
.site-nav ul { display: flex; gap: 4px; align-items: center; margin: 0; padding: 0; }
.site-nav a {
  font-size: 13px; font-weight: 600; color: #040a5d;
  padding: 6px 12px; border-radius: 8px;
  text-decoration: none; text-transform: uppercase; letter-spacing: .3px;
  white-space: nowrap; transition: color .15s, background .15s;
}
.site-nav a:hover, .site-nav a.active { color: #192bc2; background: rgba(58,155,255,.06); }

/* Mega menu */
.has-mega { position: relative; }
.mega-trigger { cursor: pointer; }
.mega-menu {
  display: none;
  position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%);
  background: #fff; border-radius: 16px;
  box-shadow: 0 16px 48px rgba(4,10,93,.18);
  padding: 0; min-width: 520px; z-index: 200;
  border: 1px solid #e8edf5;
  overflow: hidden;
  flex-direction: row; gap: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
  transform: translateX(-50%) translateY(-6px);
}
.has-mega:hover .mega-menu,
.has-mega:focus-within .mega-menu,
.mega-menu:hover { 
  display: flex;
  flex-direction: row;
  align-items: stretch;
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.has-mega::before {
  content: '';
  position: absolute;
  top: 100%; left: 0; right: 0;
  height: 14px; background: transparent;
}
.mega-item {
  display: flex; align-items: center; gap: 14px;
  padding: 11px 16px; border-radius: 10px;
  color: #040a5d; text-decoration: none;
  transition: background .15s, transform .15s;
}
.mega-item:hover { background: #f0f4ff; transform: translateX(3px); }
.mega-item strong { display: block; font-size: 13.5px; font-weight: 700; color: #040a5d; }
.mega-item small  { display: block; font-size: 12px; color: #6b7280; margin-top: 2px; line-height: 1.4; }
.mega-item--empty { opacity: .6; cursor: default; pointer-events: none; }
.mega-icon {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: #eef1fd; display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #192bc2;
}
.nav-chevron { font-size: 9px; margin-left: 3px; vertical-align: middle; transition: transform .2s; }
.has-mega:hover .nav-chevron { transform: rotate(180deg); }

/* Mega hero */
.mega-hero {
  display: flex; flex-direction: column; justify-content: space-between; gap: 16px;
  padding: 24px 20px;
  background: linear-gradient(160deg, #040a5d 0%, #192bc2 100%);
  min-width: 200px; max-width: 210px; flex-shrink: 0;
}
.mega-hero-icon {
  width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: #fff;
}
.mega-hero-icon--orange { background: rgba(240,124,0,.3); border-color: rgba(240,124,0,.4); }
.mega-hero-title { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.35; }
.mega-hero-desc  { font-size: 12px; color: rgba(255,255,255,.65); line-height: 1.55; }
.mega-divider { width: 1px; background: #e8edf5; flex-shrink: 0; }

/* Items column */
.mega-items { display: flex; flex-direction: column; gap: 4px; flex: 1; padding: 0 8px; justify-content: center; }

/* Header buttons area */
.header-btns { display: flex; gap: 10px; align-items: center; margin-left: auto; flex-shrink: 0; }

/* Langue */
.has-lang { position: relative; }
.lang-trigger {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #040a5d;
  padding: 6px 12px; border-radius: 8px; border: none;
  background: none; cursor: pointer; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .3px;
  transition: color .15s, background .15s;
}
.lang-trigger:hover, .has-lang:hover .lang-trigger { color: #192bc2; background: rgba(58,155,255,.06); }
.has-lang:hover .nav-chevron { transform: rotate(180deg); }
.lang-menu {
  display: none;
  position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  background: #fff; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
  padding: 8px; min-width: 160px; z-index: 200;
  border-top: 3px solid #192bc2;
  flex-direction: column; gap: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
  transform: translateX(-50%) translateY(-5px);
}
.has-lang:hover .lang-menu,
.lang-menu:hover { 
  display: flex;
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
/* Zone de hover étendue pour le menu langue */
.has-lang::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 12px;
  background: transparent;
}
.lang-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 14px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: #040a5d;
  background: none; border: none; cursor: pointer; text-align: left;
  transition: background .12s;
}
.lang-item:hover   { background: #f5f7fa; }
.lang-item.active  { font-weight: 700; color: #192bc2; }
.lang-check { margin-left: auto; font-size: 11px; color: #192bc2; }

/* Favoris */
.favori-wrap { position: relative; }
.fav-btn {
  position: relative; background: none; border: none; cursor: pointer;
  width: 38px; height: 38px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; color: #9ca3af; transition: color .15s, background .15s;
}
.fav-btn:hover { color: #f43f5e; background: #fff5f7; }
.fav-btn--active { color: #f43f5e; }
.fav-badge {
  position: absolute; top: 1px; right: 1px;
  background: #f43f5e; color: #fff; font-size: 9px; font-weight: 800;
  min-width: 16px; height: 16px; border-radius: 50px; padding: 0 3px;
  display: flex; align-items: center; justify-content: center; border: 2px solid #fff;
}
.favori-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 300px; background: #fff; border-radius: 14px;
  box-shadow: 0 8px 40px rgba(4,10,93,.13); border: 1px solid #eef0f8;
  border-top: 3px solid #f43f5e; z-index: 400; overflow: hidden;
}
.favori-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 15px 11px; font-size: 13px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #f4f5fb; }
.favori-head i { color: #f43f5e; margin-right: 5px; }
.fav-count { background: #f43f5e; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 50px; }
.favori-empty { padding: 22px 15px; text-align: center; color: #94a3b8; }
.favori-empty i { font-size: 26px; opacity: .25; display: block; margin-bottom: 7px; }
.favori-empty p { font-size: 13px; margin: 0; }
.favori-list { margin: 0; padding: 7px; max-height: 280px; overflow-y: auto; }
.favori-item { display: flex; align-items: center; border-radius: 8px; transition: background .12s; }
.favori-item:hover { background: #f8f9ff; }
.favori-link { flex: 1; display: flex; align-items: center; gap: 9px; padding: 8px 7px; text-decoration: none; min-width: 0; }
.favori-logo { width: 34px; height: 34px; border-radius: 7px; flex-shrink: 0; background: #f4f5fb; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.favori-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.favori-logo span { font-size: 13px; font-weight: 800; color: #192bc2; }
.favori-info { flex: 1; min-width: 0; }
.favori-titre { font-size: 12.5px; font-weight: 600; color: #1e293b; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-ent   { font-size: 11px; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-rm { flex-shrink: 0; background: none; border: none; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #cbd5e1; transition: background .12s, color .12s; margin-right: 7px; }
.favori-rm:hover { background: #fee2e2; color: #f43f5e; }
.favori-footer { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 15px; font-size: 12px; font-weight: 700; color: #192bc2; text-decoration: none; border-top: 1px solid #f4f5fb; transition: background .12s; }
.favori-footer:hover { background: #f8f9ff; }

/* User pill */
.user-wrap { position: relative; }
.user-pill {
  display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 8px;
  background: none; border: 1.5px solid #e5e7eb; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #374151; transition: border-color .15s, background .15s, color .15s;
}
.user-pill:hover { border-color: #192bc2; color: #192bc2; background: #f0f3ff; }
.user-avatar { width: 26px; height: 26px; border-radius: 50%; background: #eef1fd; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #192bc2; flex-shrink: 0; }
.user-name   { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-chevron { font-size: 9px; color: #9ca3af; transition: transform .2s; }
.user-chevron.open { transform: rotate(180deg); }
.user-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(4,10,93,.12); border: 1px solid #eef0f8; padding: 6px; min-width: 180px; z-index: 400;
}
.user-item {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: #374151; text-decoration: none; background: none; border: none; cursor: pointer; transition: background .12s, color .12s;
}
.user-item i       { font-size: 13px; color: #9ca3af; width: 16px; text-align: center; }
.user-item:hover   { background: #f8f9ff; color: #192bc2; }
.user-item:hover i { color: #192bc2; }
.user-item--danger:hover   { background: #fff5f5; color: #ef4444; }
.user-item--danger:hover i { color: #ef4444; }
.user-divider { height: 1px; background: #f0f2f8; margin: 4px 6px; }

/* Animations */
.drop-anim-enter-active, .drop-anim-leave-active { transition: opacity .16s ease, transform .16s ease; }
.drop-anim-enter-from, .drop-anim-leave-to { opacity: 0; transform: translateY(-6px); }

/* Boutons */
.btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 20px; border-radius: 50px;
  font-size: 12.5px; font-weight: 700; text-decoration: none; border: 2px solid transparent;
  cursor: pointer; white-space: nowrap; transition: all .15s; letter-spacing: .2px;
}
.btn--orange { background: #f07c00; color: #fff; border-color: #f07c00; }
.btn--orange:hover { background: #d96e00; border-color: #d96e00; transform: translateY(-1px); }
.btn--blue   { background: #192bc2; color: #fff; border-color: #192bc2; }
.btn--blue:hover   { background: #1222a8; border-color: #1222a8; transform: translateY(-1px); }
.btn--sm { padding: 7px 16px; font-size: 12px; }

/* Burger */
.menu-toggle {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  padding: 8px; background: none; border: none; cursor: pointer; margin-left: 8px;
}
.menu-toggle span { width: 24px; height: 2px; background: #040a5d; border-radius: 2px; display: block; transition: transform .25s, opacity .25s; }
.menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-toggle.open span:nth-child(2) { opacity: 0; }
.menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .menu-toggle { display: flex; }
  .site-nav {
    display: none; position: fixed; inset: 0; z-index: 500;
    background: #040a5d; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px;
  }
  .site-nav.open { display: flex; }
  .site-nav ul { flex-direction: column; gap: 4px; width: 100%; max-width: 300px; }
  .site-nav a { color: rgba(255,255,255,.85); font-size: 16px; padding: 11px 16px; display: block; border-radius: 10px; }
  .site-nav a:hover, .site-nav a.active { background: rgba(255,255,255,.1); color: #fff; }
  .mega-menu { position: static; transform: none; box-shadow: none; border: none; background: rgba(255,255,255,.07); border-top: none; margin-top: 4px; flex-direction: column; min-width: unset; }
  .mega-hero { display: none; }
  .mega-divider { display: none; }
  .mega-items { padding: 0; }
  .has-mega:hover .mega-menu, .has-mega:focus-within .mega-menu { display: flex; }
  .mega-item strong { color: rgba(255,255,255,.85); }
  .mega-item small  { color: rgba(255,255,255,.5); }
  .mega-item:hover  { background: rgba(255,255,255,.08); }
  .mega-icon { color: #f07c00; }
  .header-btns .has-lang,
  .header-btns .user-wrap,
  .header-btns .btn { display: none; }
  .topbar-label { max-width: 140px; }
  .topbar-link { display: none; }
}

@media (max-width: 480px) {
  .site-logo img { height: 52px; }
}
</style>
