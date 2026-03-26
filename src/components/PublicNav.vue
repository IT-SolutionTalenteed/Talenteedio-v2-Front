<template>
  <div>
    <!-- ══ TOP BAR ══ -->
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <template v-if="featuredEvent">
            <span class="topbar-event-dot"></span>
            <span class="topbar-event-label">{{ featuredEvent.titre }}</span>
            <div class="countdown-blocks">
              <div class="cd-block"><span class="cd-num">{{ countdown.days }}</span><span class="cd-unit">J</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-block"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-unit">H</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-block"><span class="cd-num">{{ countdown.minutes }}</span><span class="cd-unit">M</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-block"><span class="cd-num">{{ countdown.seconds }}</span><span class="cd-unit">S</span></div>
            </div>
          </template>
        </div>
        <div class="topbar-right">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://x.com/" target="_blank" rel="noopener" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>
    </div>

    <!-- ══ HEADER ══ -->
    <header class="site-header" :class="{ scrolled: isScrolled }">
      <div class="container">
        <div class="header-inner">

          <!-- Logo -->
          <router-link to="/" class="site-logo" @click="closeAll">
            <img src="/logo.png" alt="Talenteed" width="148" height="52">
            <span class="site-tagline">Le média alternatif pour les RH</span>
          </router-link>

          <!-- Nav desktop -->
          <nav class="site-nav" :class="{ open: menuOpen }">
            <ul>
              <li>
                <router-link to="/" class="nav-link" @click="closeAll">Accueil</router-link>
              </li>

              <!-- Mega : Annonces -->
              <li class="has-mega" :class="{ 'mega-open': activeMega === 'annonces' }">
                <button class="nav-link nav-link--trigger" @click.stop="toggleMega('annonces')">
                  Annonces
                  <i class="fa-solid fa-chevron-down mega-chevron"></i>
                </button>
                <div class="mega-panel" @click.stop>
                  <div class="mega-grid mega-grid--2">
                    <router-link to="/annonces" class="mega-card" @click="closeAll">
                      <div class="mega-card-icon mega-card-icon--blue">
                        <i class="fa-solid fa-briefcase"></i>
                      </div>
                      <div class="mega-card-body">
                        <strong>Offres d'emploi</strong>
                        <span>Trouvez votre prochain poste</span>
                      </div>
                      <i class="fa-solid fa-arrow-right mega-card-arrow"></i>
                    </router-link>
                    <router-link to="/entreprises" class="mega-card" @click="closeAll">
                      <div class="mega-card-icon mega-card-icon--indigo">
                        <i class="fa-solid fa-building"></i>
                      </div>
                      <div class="mega-card-body">
                        <strong>Entreprises</strong>
                        <span>Découvrez nos partenaires</span>
                      </div>
                      <i class="fa-solid fa-arrow-right mega-card-arrow"></i>
                    </router-link>
                  </div>
                </div>
              </li>

              <!-- Mega : Événements -->
              <li class="has-mega" :class="{ 'mega-open': activeMega === 'evenements' }">
                <button class="nav-link nav-link--trigger" @click.stop="toggleMega('evenements')">
                  Événements
                  <i class="fa-solid fa-chevron-down mega-chevron"></i>
                </button>
                <div class="mega-panel" @click.stop>
                  <div v-if="categories.length" class="mega-grid mega-grid--auto">
                    <router-link
                      v-for="cat in categories"
                      :key="cat.id"
                      :to="`/evenements/categorie/${cat.id}`"
                      class="mega-card"
                      @click="closeAll"
                    >
                      <div class="mega-card-icon mega-card-icon--orange">
                        <i class="fa-solid fa-calendar-days"></i>
                      </div>
                      <div class="mega-card-body">
                        <strong>{{ cat.titre }}</strong>
                        <span>Voir les événements</span>
                      </div>
                      <i class="fa-solid fa-arrow-right mega-card-arrow"></i>
                    </router-link>
                  </div>
                  <div v-else class="mega-empty">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <span>Aucun événement disponible</span>
                  </div>
                </div>
              </li>

              <li>
                <router-link to="/blog" class="nav-link" @click="closeAll">Articles</router-link>
              </li>

              <!-- Switcher langue -->
              <li>
                <button class="lang-btn" @click="toggleLocale">
                  <i class="fa-solid fa-globe"></i>
                  {{ locale === 'fr' ? 'EN' : 'FR' }}
                </button>
              </li>
            </ul>

            <!-- Mobile close -->
            <button class="nav-close" @click="menuOpen = false" aria-label="Fermer le menu">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </nav>

          <!-- Actions droite -->
          <div class="header-actions">
            <!-- Favoris -->
            <div v-if="isLoggedIn && userRole === 'talent'" class="favori-wrap" ref="favoriWrapRef">
              <button
                class="icon-btn"
                :class="{ 'icon-btn--active': favoris.length > 0 }"
                @click="favoriOpen = !favoriOpen"
                aria-label="Mes favoris"
              >
                <i :class="favoris.length > 0 ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                <span v-if="favoris.length" class="icon-badge">{{ favoris.length > 9 ? '9+' : favoris.length }}</span>
              </button>

              <Transition name="dropdown">
                <div v-if="favoriOpen" class="favori-dropdown">
                  <div class="favori-head">
                    <span><i class="fa-solid fa-heart"></i> Mes favoris</span>
                    <span class="favori-count-badge">{{ favoris.length }}</span>
                  </div>
                  <div v-if="!favoris.length" class="favori-empty">
                    <i class="fa-regular fa-heart"></i>
                    <p>Aucun favori pour l'instant</p>
                  </div>
                  <ul v-else class="favori-list">
                    <li v-for="offre in favoris" :key="offre.id" class="favori-item">
                      <router-link :to="`/annonces/${offre.id}`" class="favori-link" @click="favoriOpen = false">
                        <div class="favori-logo">
                          <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise?.nom" />
                          <span v-else>{{ offre.entreprise?.nom?.charAt(0) || '?' }}</span>
                        </div>
                        <div class="favori-info">
                          <p class="favori-titre">{{ offre.titre }}</p>
                          <p class="favori-ent">{{ offre.entreprise?.nom || '—' }}</p>
                        </div>
                      </router-link>
                      <button class="favori-rm" @click="removeFavori(offre.id)" title="Retirer">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </li>
                  </ul>
                  <router-link v-if="favoris.length" to="/favoris" class="favori-footer" @click="favoriOpen = false">
                    Voir tous mes favoris <i class="fa-solid fa-arrow-right"></i>
                  </router-link>
                </div>
              </Transition>
            </div>

            <!-- Auth -->
            <template v-if="isLoggedIn">
              <router-link :to="dashboardRoute" class="btn btn--primary">
                <i class="fa-solid fa-gauge"></i> Dashboard
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn--ghost">Connexion</router-link>
              <router-link to="/register" class="btn btn--primary">S'inscrire</router-link>
            </template>
          </div>

          <!-- Burger mobile -->
          <button class="burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>

        </div>
      </div>

      <!-- Overlay mega menus -->
      <div v-if="activeMega" class="mega-overlay" @click="closeAll"></div>
    </header>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useFavoris } from '../composables/useFavoris.js'

const apiBase       = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route         = useRoute()
const categories    = ref([])
const isScrolled    = ref(false)
const menuOpen      = ref(false)
const activeMega    = ref(null)
const featuredEvent = ref(null)
const countdown     = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let   countdownTimer = null

const isLoggedIn = ref(!!localStorage.getItem('token'))
const userRole   = ref(localStorage.getItem('userRole') || '')

const dashboardRoute = computed(() => {
  return { admin: '/admin', talent: '/talent', entreprise: '/entreprise' }[userRole.value] || '/login'
})

const locale = ref(localStorage.getItem('locale') || 'fr')
function toggleLocale() {
  locale.value = locale.value === 'fr' ? 'en' : 'fr'
  localStorage.setItem('locale', locale.value)
}

// ── Mega menus ──────────────────────────────────────────
function toggleMega(name) {
  activeMega.value = activeMega.value === name ? null : name
}

function closeAll() {
  activeMega.value = null
  menuOpen.value   = false
  favoriOpen.value = false
}

// Fermer les megas à chaque navigation
watch(() => route.fullPath, () => closeAll())

// ── Favoris ─────────────────────────────────────────────
const { favoris, loadFavoris, removeFavori } = useFavoris()
const favoriOpen    = ref(false)
const favoriWrapRef = ref(null)

function onClickOutside(e) {
  if (favoriWrapRef.value && !favoriWrapRef.value.contains(e.target)) {
    favoriOpen.value = false
  }
  if (!e.target.closest('.has-mega')) {
    activeMega.value = null
  }
}

// ── Scroll ──────────────────────────────────────────────
function onScroll() { isScrolled.value = window.scrollY > 50 }

// ── Countdown ───────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0') }

function tickCountdown(target) {
  const diff = target - Date.now()
  if (diff <= 0) { countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }; return }
  const s = Math.floor(diff / 1000)
  countdown.value = {
    days:    pad(Math.floor(s / 86400)),
    hours:   pad(Math.floor((s % 86400) / 3600)),
    minutes: pad(Math.floor((s % 3600) / 60)),
    seconds: pad(s % 60),
  }
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
      const dateStr = evRes.data.date_debut.substring(0, 10)
      const timeStr = (evRes.data.heure_debut_journee || '00:00').substring(0, 5)
      const target  = new Date(`${dateStr}T${timeStr}:00`).getTime()
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
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOP BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.topbar {
  background: #040a5d;
  height: 36px;
  display: flex; align-items: center;
  font-size: 11.5px;
  color: rgba(255,255,255,.65);
}
.topbar .container { display: flex; justify-content: space-between; align-items: center; }
.topbar-left  { display: flex; align-items: center; gap: 10px; }
.topbar-right { display: flex; gap: 14px; }
.topbar-right a { color: rgba(255,255,255,.5); font-size: 12px; transition: color .15s; }
.topbar-right a:hover { color: #f07c00; }

.topbar-event-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #f07c00;
  box-shadow: 0 0 6px #f07c00;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .4 } }

.topbar-event-label {
  color: rgba(255,255,255,.8);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.countdown-blocks { display: flex; align-items: center; gap: 3px; }
.cd-block  { display: flex; align-items: baseline; gap: 1px; }
.cd-num    { font-size: 12px; font-weight: 700; color: #fff; min-width: 18px; text-align: center; }
.cd-unit   { font-size: 8px; font-weight: 700; color: #f07c00; text-transform: uppercase; }
.cd-sep    { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.3); margin: 0 1px; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.site-header {
  background: #fff;
  position: sticky; top: 0; z-index: 200;
  border-bottom: 1px solid #f0f0f5;
  transition: box-shadow .25s, border-color .25s;
}
.site-header.scrolled {
  box-shadow: 0 4px 24px rgba(4,10,93,.10);
  border-color: transparent;
}

.header-inner {
  display: flex; align-items: center; gap: 0;
  height: 68px;
}

/* Logo */
.site-logo {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1px; text-decoration: none; flex-shrink: 0; margin-right: 32px;
}
.site-logo img { display: block; }
.site-tagline {
  font-size: 10px; font-weight: 700; color: #f07c00;
  letter-spacing: .4px; line-height: 1;
  position: relative; top: -6px;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.site-nav { display: flex; flex: 1; }
.site-nav ul {
  display: flex; list-style: none; margin: 0; padding: 0;
  align-items: center; gap: 2px; flex: 1;
}

.nav-link {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px;
  font-size: 13.5px; font-weight: 600;
  color: #1e2a4a;
  text-decoration: none;
  border-radius: 8px;
  background: none; border: none; cursor: pointer;
  transition: color .15s, background .15s;
  white-space: nowrap;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute; bottom: 0; left: 14px; right: 14px; height: 2px;
  background: #192bc2; border-radius: 2px;
  transform: scaleX(0); transform-origin: center;
  transition: transform .2s;
}
.nav-link:hover { color: #192bc2; background: rgba(25,43,194,.05); }
.nav-link:hover::after,
.nav-link.router-link-active::after { transform: scaleX(1); }
.nav-link.router-link-active { color: #192bc2; }

.nav-link--trigger { user-select: none; }

.mega-chevron {
  font-size: 9px; color: #94a3b8;
  transition: transform .2s, color .2s;
}
.mega-open .mega-chevron { transform: rotate(180deg); color: #192bc2; }
.mega-open .nav-link--trigger { color: #192bc2; background: rgba(25,43,194,.05); }

.lang-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px;
  font-size: 12px; font-weight: 700; letter-spacing: .5px;
  color: #64748b;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 50px; cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.lang-btn:hover { border-color: #192bc2; color: #192bc2; background: #fff; }
.lang-btn i { font-size: 11px; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MEGA PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.has-mega { position: relative; }

.mega-panel {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%; transform: translateX(-50%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(4,10,93,.14), 0 2px 8px rgba(0,0,0,.06);
  border: 1px solid #f0f0f5;
  padding: 12px;
  min-width: 320px;
  z-index: 300;
  /* Animation */
  opacity: 0; pointer-events: none;
  transform: translateX(-50%) translateY(-6px);
  transition: opacity .18s ease, transform .18s ease;
}
.mega-open .mega-panel {
  opacity: 1; pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

/* Petit triangle */
.mega-panel::before {
  content: '';
  position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
  width: 12px; height: 6px;
  background: #fff;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  filter: drop-shadow(0 -1px 1px rgba(0,0,0,.06));
}

.mega-grid { display: flex; flex-direction: column; gap: 4px; }
.mega-grid--auto { min-width: 260px; }

.mega-overlay {
  position: fixed; inset: 0; z-index: 150;
  background: transparent;
}

/* Card mega */
.mega-card {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 14px; border-radius: 10px;
  text-decoration: none;
  transition: background .15s;
  cursor: pointer;
}
.mega-card:hover { background: #f8fafc; }
.mega-card:hover .mega-card-arrow { opacity: 1; transform: translateX(0); }

.mega-card-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.mega-card-icon--blue   { background: #e8f0fe; color: #192bc2; }
.mega-card-icon--indigo { background: #ede9fe; color: #6d28d9; }
.mega-card-icon--orange { background: #fff7ed; color: #f07c00; }

.mega-card-body { flex: 1; min-width: 0; }
.mega-card-body strong {
  display: block; font-size: 14px; font-weight: 700; color: #1e2a4a; margin-bottom: 2px;
}
.mega-card-body span { display: block; font-size: 12px; color: #94a3b8; }

.mega-card-arrow {
  font-size: 11px; color: #94a3b8;
  opacity: 0; transform: translateX(-4px);
  transition: opacity .15s, transform .15s;
  flex-shrink: 0;
}

.mega-empty {
  display: flex; align-items: center; gap: 10px;
  padding: 14px; font-size: 13px; color: #94a3b8;
}
.mega-empty i { font-size: 18px; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ACTIONS DROITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.header-actions {
  display: flex; align-items: center; gap: 8px;
  margin-left: auto; flex-shrink: 0;
}

.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 8px;
  font-size: 13px; font-weight: 700;
  text-decoration: none; cursor: pointer;
  border: none; transition: all .15s; white-space: nowrap;
}
.btn--primary {
  background: #192bc2; color: #fff;
  box-shadow: 0 2px 8px rgba(25,43,194,.3);
}
.btn--primary:hover { background: #0f1d96; box-shadow: 0 4px 14px rgba(25,43,194,.4); transform: translateY(-1px); }
.btn--ghost {
  background: transparent; color: #1e2a4a;
  border: 1.5px solid #e2e8f0;
}
.btn--ghost:hover { border-color: #192bc2; color: #192bc2; background: rgba(25,43,194,.04); }

/* Icon btn (favoris) */
.icon-btn {
  position: relative;
  background: none; border: 1.5px solid #e2e8f0;
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #94a3b8; cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.icon-btn:hover          { border-color: #f43f5e; color: #f43f5e; background: #fff5f7; }
.icon-btn--active        { border-color: #fecdd3; color: #f43f5e; background: #fff5f7; }

.icon-badge {
  position: absolute; top: -5px; right: -5px;
  background: #f43f5e; color: #fff;
  font-size: 9px; font-weight: 800;
  min-width: 17px; height: 17px;
  border-radius: 50px; padding: 0 4px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff; line-height: 1;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DROPDOWN FAVORIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.favori-wrap { position: relative; }

.dropdown-enter-active, .dropdown-leave-active { transition: opacity .18s, transform .18s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

.favori-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 310px; background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(4,10,93,.14), 0 2px 8px rgba(0,0,0,.06);
  border: 1px solid #f0f0f5;
  border-top: 3px solid #f43f5e;
  z-index: 400; overflow: hidden;
}

.favori-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 12px;
  font-size: 13px; font-weight: 700; color: #1e2a4a;
  border-bottom: 1px solid #f4f4f8;
}
.favori-head i { color: #f43f5e; margin-right: 6px; }
.favori-count-badge {
  background: #f43f5e; color: #fff;
  font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 50px;
}

.favori-empty { padding: 24px 16px; text-align: center; color: #94a3b8; }
.favori-empty i { font-size: 28px; opacity: .3; display: block; margin-bottom: 8px; }
.favori-empty p { font-size: 13px; margin: 0; }

.favori-list { list-style: none; margin: 0; padding: 8px; max-height: 300px; overflow-y: auto; }
.favori-item { display: flex; align-items: center; border-radius: 8px; transition: background .12s; }
.favori-item:hover { background: #f8fafc; }

.favori-link {
  flex: 1; display: flex; align-items: center; gap: 10px;
  padding: 9px 8px; text-decoration: none; min-width: 0;
}
.favori-logo {
  width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  background: #f4f4f8;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.favori-logo img  { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.favori-logo span { font-size: 14px; font-weight: 800; color: #192bc2; }
.favori-info { flex: 1; min-width: 0; }
.favori-titre { font-size: 13px; font-weight: 700; color: #1e2a4a; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-ent   { font-size: 11px; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.favori-rm {
  flex-shrink: 0; background: none; border: none; cursor: pointer;
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #cbd5e1;
  transition: background .12s, color .12s;
  margin-right: 8px;
}
.favori-rm:hover { background: #fee2e2; color: #f43f5e; }

.favori-footer {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 12px 16px;
  font-size: 12px; font-weight: 700; color: #192bc2;
  text-decoration: none; border-top: 1px solid #f4f4f8;
  transition: background .12s;
}
.favori-footer:hover { background: #f8fafc; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BURGER MOBILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  padding: 8px; background: none; border: none; cursor: pointer; margin-left: 8px;
}
.burger span {
  width: 22px; height: 2px; background: #1e2a4a;
  border-radius: 2px; display: block;
  transition: transform .25s, opacity .25s, background .15s;
}
.burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Bouton fermer (mobile) */
.nav-close {
  display: none; position: absolute; top: 20px; right: 20px;
  background: rgba(255,255,255,.1); border: none; cursor: pointer;
  width: 40px; height: 40px; border-radius: 50%;
  font-size: 18px; color: #fff;
  align-items: center; justify-content: center;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MOBILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (max-width: 900px) {
  .burger { display: flex; }

  .site-nav {
    display: none;
    position: fixed; inset: 0; z-index: 500;
    background: #040a5d;
    flex-direction: column; align-items: center; justify-content: center;
    padding: 40px 24px;
  }
  .site-nav.open { display: flex; }
  .nav-close { display: flex; }

  .site-nav ul { flex-direction: column; gap: 4px; width: 100%; max-width: 280px; }
  .nav-link {
    color: rgba(255,255,255,.85); font-size: 17px; padding: 12px 16px;
    width: 100%; justify-content: space-between;
  }
  .nav-link::after { display: none; }
  .nav-link:hover, .mega-open .nav-link--trigger { background: rgba(255,255,255,.08); color: #fff; }
  .nav-link.router-link-active { color: #fff; background: rgba(255,255,255,.12); }
  .mega-chevron { color: rgba(255,255,255,.5); }

  .mega-panel {
    position: static; transform: none; opacity: 1;
    pointer-events: auto;
    background: rgba(255,255,255,.06);
    box-shadow: none; border: none; border-radius: 8px;
    margin-top: 4px; padding: 6px;
  }
  .mega-panel::before { display: none; }
  .mega-card { padding: 10px 12px; }
  .mega-card:hover { background: rgba(255,255,255,.08); }
  .mega-card-body strong { color: rgba(255,255,255,.9); }
  .mega-card-body span  { color: rgba(255,255,255,.5); }
  .mega-card-arrow { opacity: 1; transform: none; color: rgba(255,255,255,.3); }

  .lang-btn { color: rgba(255,255,255,.6); border-color: rgba(255,255,255,.2); background: transparent; }
  .lang-btn:hover { border-color: #fff; color: #fff; background: transparent; }

  .header-actions .btn--ghost { display: none; }

  .mega-overlay { display: none; }
}

@media (max-width: 480px) {
  .site-logo img { width: 120px; }
  .header-actions .btn--primary { padding: 7px 12px; font-size: 12px; }
}
</style>
