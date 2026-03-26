<template>
  <div>
    <!-- ══ TOP BAR ══ -->
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <template v-if="featuredEvent">
            <span class="countdown-label">
              <i class="fa-solid fa-calendar-star"></i>
              {{ featuredEvent.titre }} —
            </span>
            <div class="countdown-blocks">
              <div class="cd-block"><span class="cd-num">{{ countdown.days }}</span><span class="cd-unit">J</span></div>
              <div class="cd-sep">:</div>
              <div class="cd-block"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-unit">H</span></div>
              <div class="cd-sep">:</div>
              <div class="cd-block"><span class="cd-num">{{ countdown.minutes }}</span><span class="cd-unit">M</span></div>
              <div class="cd-sep">:</div>
              <div class="cd-block"><span class="cd-num">{{ countdown.seconds }}</span><span class="cd-unit">S</span></div>
            </div>
          </template>
        </div>
        <div class="topbar-right">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://x.com/" target="_blank" rel="noopener" aria-label="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>
    </div>

    <!-- ══ HEADER ══ -->
    <header class="site-header" :class="{ scrolled: isScrolled }" id="site-header-nav">
      <div class="container">
        <div class="header-inner">
          <router-link to="/" class="site-logo">
            <img src="/logo.png" alt="Talenteed" width="160" height="56">
            <span class="site-tagline">Le média alternatif pour les RH</span>
          </router-link>

          <!-- Boutons auth -->
          <div class="header-btns">
            <!-- Icône favoris (talent uniquement) -->
            <div v-if="isLoggedIn && userRole === 'talent'" class="favori-wrap" ref="favoriWrapRef">
              <button
                class="btn-nav-favori"
                :class="{ 'btn-nav-favori--active': favoris.length > 0 }"
                @click="favoriOpen = !favoriOpen"
                aria-label="Mes favoris"
              >
                <i :class="favoris.length > 0 ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                <span v-if="favoris.length" class="favori-badge">
                  {{ favoris.length > 9 ? '9+' : favoris.length }}
                </span>
              </button>

              <!-- Dropdown favoris -->
              <div v-if="favoriOpen" class="favori-dropdown">
                <div class="favori-dropdown-header">
                  <span><i class="fa-solid fa-heart"></i> Mes favoris</span>
                  <span class="favori-count">{{ favoris.length }}</span>
                </div>

                <div v-if="!favoris.length" class="favori-empty">
                  <i class="fa-regular fa-heart"></i>
                  <p>Aucun favori pour l'instant</p>
                </div>

                <ul v-else class="favori-list">
                  <li v-for="offre in favoris" :key="offre.id" class="favori-item">
                    <router-link :to="`/annonces/${offre.id}`" class="favori-item-link" @click="favoriOpen = false">
                      <div class="favori-logo">
                        <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise?.nom" />
                        <span v-else>{{ offre.entreprise?.nom?.charAt(0) || '?' }}</span>
                      </div>
                      <div class="favori-info">
                        <p class="favori-titre">{{ offre.titre }}</p>
                        <p class="favori-entreprise">{{ offre.entreprise?.nom || '—' }}</p>
                        <div class="favori-tags">
                          <span v-for="c in offre.job_contracts?.slice(0,1)" :key="c.id" class="favori-tag">{{ c.name }}</span>
                        </div>
                      </div>
                    </router-link>
                    <button class="favori-remove" @click="removeFavori(offre.id)" title="Retirer des favoris">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </li>
                </ul>

                <router-link v-if="favoris.length" to="/talent" class="favori-see-all" @click="favoriOpen = false">
                  Voir tous mes favoris <i class="fa-solid fa-arrow-right"></i>
                </router-link>
              </div>
            </div>

            <template v-if="isLoggedIn">
              <router-link :to="dashboardRoute" class="btn btn--blue btn--sm">
                <i class="fa-solid fa-gauge" style="margin-right:5px;"></i>DASHBOARD
              </router-link>
            </template>
            <template v-else>
              <router-link to="/register" class="btn btn--orange btn--sm">S'INSCRIRE</router-link>
              <router-link to="/login"    class="btn btn--blue   btn--sm">SE CONNECTER</router-link>
            </template>
          </div>

          <button class="menu-toggle" :class="{ open: menuOpen }" aria-label="Menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
            <span></span><span></span><span></span>
          </button>

          <nav class="site-nav" :class="{ open: menuOpen }" @click="closeOnLink">
            <ul>
              <li><router-link to="/">ACCUEIL</router-link></li>

              <!-- Mega menu Annonces -->
              <li class="has-mega">
                <a href="#" @click.prevent class="mega-trigger">
                  ANNONCES <i class="fa-solid fa-chevron-down nav-chevron"></i>
                </a>
                <div class="mega-menu">
                  <router-link to="/annonces" class="mega-item">
                    <i class="fa-solid fa-briefcase mega-icon"></i>
                    <div>
                      <strong>Jobs</strong>
                      <small>Toutes les offres d'emploi</small>
                    </div>
                  </router-link>
                  <router-link to="/entreprises" class="mega-item">
                    <i class="fa-solid fa-building mega-icon"></i>
                    <div>
                      <strong>Entreprises</strong>
                      <small>Les entreprises partenaires</small>
                    </div>
                  </router-link>
                </div>
              </li>

              <!-- Mega menu Événements -->
              <li class="has-mega">
                <a href="#" @click.prevent class="mega-trigger">
                  ÉVÉNEMENTS <i class="fa-solid fa-chevron-down nav-chevron"></i>
                </a>
                <div class="mega-menu">
                  <template v-if="categories.length">
                    <router-link
                      v-for="cat in categories"
                      :key="cat.id"
                      :to="`/evenements/categorie/${cat.id}`"
                      class="mega-item"
                    >
                      <i class="fa-solid fa-calendar-days mega-icon"></i>
                      <div>
                        <strong>{{ cat.titre }}</strong>
                      </div>
                    </router-link>
                  </template>
                  <div v-else class="mega-item mega-item--empty">
                    <i class="fa-solid fa-calendar-xmark mega-icon"></i>
                    <div><strong>Aucun événement disponible</strong></div>
                  </div>
                </div>
              </li>

              <li><router-link to="/blog">ARTICLES</router-link></li>

              <!-- Switcher Fr / En -->
              <li>
                <button class="lang-switch" @click="toggleLocale">
                  {{ locale === 'fr' ? 'EN' : 'FR' }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useFavoris } from '../composables/useFavoris.js'

const apiBase      = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const categories   = ref([])
const isScrolled   = ref(false)
const menuOpen     = ref(false)
const featuredEvent = ref(null)
const countdown    = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let   countdownTimer = null

const isLoggedIn     = ref(!!localStorage.getItem('token'))
const userRole       = ref(localStorage.getItem('userRole') || '')

// ── Favoris ────────────────────────────────────────────────
const { favoris, loadFavoris, removeFavori } = useFavoris()
const favoriOpen    = ref(false)
const favoriWrapRef = ref(null)

const onClickOutside = (e) => {
  if (favoriWrapRef.value && !favoriWrapRef.value.contains(e.target)) {
    favoriOpen.value = false
  }
}

const dashboardRoute = computed(() => {
  const routes = { admin: '/admin', talent: '/talent', entreprise: '/entreprise' }
  return routes[userRole.value] || '/login'
})

const locale = ref(localStorage.getItem('locale') || 'fr')
function toggleLocale() {
  locale.value = locale.value === 'fr' ? 'en' : 'fr'
  localStorage.setItem('locale', locale.value)
}

function onScroll() {
  isScrolled.value = window.scrollY > 50
}

function closeOnLink(e) {
  if (e.target.closest('a') || e.target.closest('button.lang-switch')) {
    menuOpen.value = false
  }
}

function pad(n) { return String(n).padStart(2, '0') }

function tickCountdown(target) {
  const diff = target - Date.now()
  if (diff <= 0) {
    countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
    return
  }
  const totalSeconds = Math.floor(diff / 1000)
  countdown.value = {
    days:    pad(Math.floor(totalSeconds / 86400)),
    hours:   pad(Math.floor((totalSeconds % 86400) / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
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
      const dateStr  = evRes.data.date_debut.substring(0, 10)
      const timeStr  = (evRes.data.heure_debut_journee || '00:00').substring(0, 5)
      const target   = new Date(`${dateStr}T${timeStr}:00`).getTime()
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
/* ── Top bar ── */
.topbar {
  background: var(--navy, #040a5d);
  padding: 8px 0;
  font-size: 12px;
  color: rgba(255,255,255,.75);
}
.topbar .container { display: flex; justify-content: space-between; align-items: center; }
.topbar-left { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.countdown-label { color: rgba(255,255,255,.75); display: flex; align-items: center; gap: 6px; font-size: 11px; white-space: nowrap; }
.countdown-blocks { display: flex; align-items: center; gap: 4px; }
.cd-block { display: flex; align-items: baseline; gap: 2px; }
.cd-num { font-size: 14px; font-weight: 700; color: #fff; line-height: 1; min-width: 20px; text-align: center; }
.cd-unit { font-size: 9px; font-weight: 700; color: var(--orange, #f07c00); letter-spacing: .5px; }
.cd-sep { font-size: 14px; font-weight: 700; color: rgba(255,255,255,.4); margin: 0 1px; line-height: 1; }
.topbar-right { display: flex; gap: 12px; }
.topbar-right a { color: rgba(255,255,255,.65); font-size: 13px; transition: color .15s; }
.topbar-right a:hover { color: var(--orange, #f07c00); }

/* ── Header ── */
.site-header {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  transition: box-shadow .25s;
}
.site-header.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,.13); }

.header-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 0;
  height: 70px;
}

/* Logo */
.site-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-decoration: none;
  flex-shrink: 0;
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

/* Auth buttons */
.header-btns {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Nav */
.site-nav { display: flex; }
.site-nav ul { display: flex; list-style: none; margin: 0; padding: 0; align-items: center; gap: 4px; }
.site-nav ul li a,
.site-nav ul li .mega-trigger {
  display: block;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .3px;
  color: var(--navy, #040a5d);
  text-decoration: none;
  border-radius: 6px;
  transition: color .15s, background .15s;
  cursor: pointer;
  background: none;
  border: none;
}
.site-nav ul li a:hover,
.site-nav ul li .mega-trigger:hover { color: var(--blue); background: rgba(25,43,194,.06); }
.site-nav ul li a.router-link-exact-active { color: var(--blue); }

/* Mega menu */
.has-mega { position: relative; }
.has-mega .mega-menu {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
  padding: 10px;
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
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 14px; border-radius: 8px;
  color: var(--navy); text-decoration: none;
  transition: background .15s;
}
.mega-item:hover { background: var(--light-bg, #f5f7fa); }
.mega-item strong { display: block; font-size: 14px; font-weight: 700; color: var(--navy); }
.mega-item small  { display: block; font-size: 12px; color: var(--body-text); margin-top: 2px; }
.mega-item--empty { opacity: .6; cursor: default; pointer-events: none; }
.mega-icon { font-size: 18px; color: var(--blue); margin-top: 2px; flex-shrink: 0; }
.nav-chevron { font-size: 9px; margin-left: 3px; vertical-align: middle; transition: transform .2s; }
.has-mega:hover .nav-chevron { transform: rotate(180deg); }

/* Langue */
.lang-switch {
  background: transparent;
  border: 1.5px solid var(--blue);
  color: var(--blue);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 50px;
  cursor: pointer;
  transition: background .15s, color .15s;
}
.lang-switch:hover { background: var(--blue); color: #fff; }

/* Menu mobile toggle */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 8px;
}
.menu-toggle span {
  width: 22px; height: 2px;
  background: var(--navy);
  border-radius: 2px;
  transition: transform .25s, opacity .25s;
  display: block;
}
.menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-toggle.open span:nth-child(2) { opacity: 0; }
.menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Favoris nav ── */
.favori-wrap { position: relative; }

.btn-nav-favori {
  position: relative;
  background: none; border: none; cursor: pointer;
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; color: var(--navy);
  transition: background .15s, color .15s;
}
.btn-nav-favori:hover         { background: rgba(244,63,94,.1); color: #f43f5e; }
.btn-nav-favori--active       { color: #f43f5e; }

.favori-badge {
  position: absolute;
  top: 2px; right: 2px;
  background: #f43f5e; color: #fff;
  font-size: 9px; font-weight: 800;
  min-width: 16px; height: 16px;
  border-radius: 50px; padding: 0 4px;
  display: flex; align-items: center; justify-content: center;
  line-height: 1; border: 2px solid #fff;
}

.favori-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
  border-top: 3px solid #f43f5e;
  z-index: 400;
  overflow: hidden;
}

.favori-dropdown-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 10px;
  font-size: 13px; font-weight: 700; color: var(--navy);
  border-bottom: 1px solid var(--border, #e2e8f0);
}
.favori-dropdown-header i { color: #f43f5e; margin-right: 6px; }
.favori-count {
  background: #f43f5e; color: #fff;
  font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 50px;
}

.favori-empty {
  padding: 28px 16px; text-align: center; color: var(--body-text);
}
.favori-empty i { font-size: 32px; opacity: .25; display: block; margin-bottom: 10px; }
.favori-empty p { font-size: 13px; margin: 0; }

.favori-list { list-style: none; margin: 0; padding: 8px; max-height: 340px; overflow-y: auto; }
.favori-item {
  display: flex; align-items: center; gap: 0;
  border-radius: 8px;
  transition: background .15s;
}
.favori-item:hover { background: var(--light-bg, #f5f7fa); }

.favori-item-link {
  flex: 1; display: flex; align-items: center; gap: 10px;
  padding: 10px 8px; text-decoration: none;
  min-width: 0;
}

.favori-logo {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  background: var(--light-bg, #f5f7fa);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.favori-logo img  { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.favori-logo span { font-size: 15px; font-weight: 800; color: var(--blue); }

.favori-info { flex: 1; min-width: 0; }
.favori-titre      { font-size: 13px; font-weight: 700; color: var(--navy); margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-entreprise { font-size: 11px; color: var(--body-text); margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-tags       { display: flex; gap: 4px; }
.favori-tag        { font-size: 10px; font-weight: 700; padding: 1px 8px; border-radius: 50px; background: #e8f0fe; color: var(--blue); }

.favori-remove {
  flex-shrink: 0; background: none; border: none; cursor: pointer;
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #94a3b8;
  transition: background .15s, color .15s;
  margin-right: 6px;
}
.favori-remove:hover { background: #fee2e2; color: #f43f5e; }

.favori-see-all {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 12px 16px;
  font-size: 12px; font-weight: 700; color: var(--blue);
  text-decoration: none; border-top: 1px solid var(--border, #e2e8f0);
  transition: background .15s;
}
.favori-see-all:hover { background: var(--light-bg, #f5f7fa); }

@media (max-width: 768px) {
  .menu-toggle { display: flex; }
  .site-nav {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(4,10,93,.97);
    z-index: 300;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }
  .site-nav.open { display: flex; }
  .site-nav ul { flex-direction: column; gap: 8px; width: 100%; max-width: 300px; }
  .site-nav ul li a,
  .site-nav ul li .mega-trigger { color: #fff; font-size: 16px; padding: 12px 16px; }
  .site-nav ul li a:hover,
  .site-nav ul li .mega-trigger:hover { background: rgba(255,255,255,.1); }
  .has-mega .mega-menu {
    position: static; transform: none;
    box-shadow: none; background: rgba(255,255,255,.08);
    border-top: none; margin-top: 4px;
  }
  .mega-item strong, .mega-item { color: rgba(255,255,255,.85); }
  .header-btns { gap: 6px; }
  .header-btns .btn--orange { display: none; }
}
</style>
