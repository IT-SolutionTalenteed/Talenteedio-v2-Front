<template>
  <div>
    <!-- ══ TOP BAR (countdown événement featured) ══ -->
    <div v-if="featuredEvent" class="topbar">
      <div class="container">
        <div class="topbar-left">
          <span class="topbar-dot"></span>
          <span class="topbar-label">{{ featuredEvent.titre }}</span>
          <div class="countdown-blocks">
            <div class="cd-block"><span class="cd-num">{{ countdown.days }}</span><span class="cd-unit">J</span></div>
            <span class="cd-sep">:</span>
            <div class="cd-block"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-unit">H</span></div>
            <span class="cd-sep">:</span>
            <div class="cd-block"><span class="cd-num">{{ countdown.minutes }}</span><span class="cd-unit">M</span></div>
            <span class="cd-sep">:</span>
            <div class="cd-block"><span class="cd-num">{{ countdown.seconds }}</span><span class="cd-unit">S</span></div>
          </div>
        </div>
        <div class="topbar-right">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://x.com/"            target="_blank" rel="noopener"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://wa.me/"            target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i></a>
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

            <!-- Bouton fermer mobile -->
            <button class="nav-close" @click="menuOpen = false"><i class="fa-solid fa-xmark"></i></button>

            <ul>
              <li>
                <router-link to="/" class="nav-link" exact-active-class="nav-link--active" @click="closeAll">
                  Accueil
                </router-link>
              </li>

              <!-- Dropdown Annonces -->
              <li class="has-drop" :class="{ 'drop-open': activeDrop === 'annonces' }">
                <button class="nav-link nav-link--drop" @click.stop="toggleDrop('annonces')">
                  Annonces <i class="fa-solid fa-chevron-down drop-chevron"></i>
                </button>
                <div class="drop-panel">
                  <router-link to="/annonces" class="drop-item" @click="closeAll">
                    <div class="drop-item-icon di--blue"><i class="fa-solid fa-briefcase"></i></div>
                    <div>
                      <strong>Offres d'emploi</strong>
                      <span>Trouvez votre prochain poste</span>
                    </div>
                  </router-link>
                  <router-link to="/entreprises" class="drop-item" @click="closeAll">
                    <div class="drop-item-icon di--violet"><i class="fa-solid fa-building"></i></div>
                    <div>
                      <strong>Entreprises</strong>
                      <span>Découvrez nos partenaires</span>
                    </div>
                  </router-link>
                </div>
              </li>

              <!-- Dropdown Événements -->
              <li class="has-drop" :class="{ 'drop-open': activeDrop === 'evenements' }">
                <button class="nav-link nav-link--drop" @click.stop="toggleDrop('evenements')">
                  Événements <i class="fa-solid fa-chevron-down drop-chevron"></i>
                </button>
                <div class="drop-panel">
                  <template v-if="categories.length">
                    <router-link
                      v-for="cat in categories" :key="cat.id"
                      :to="`/evenements/categorie/${cat.id}`"
                      class="drop-item"
                      @click="closeAll"
                    >
                      <div class="drop-item-icon di--orange"><i class="fa-solid fa-calendar-days"></i></div>
                      <div>
                        <strong>{{ cat.titre }}</strong>
                        <span>Voir les événements</span>
                      </div>
                    </router-link>
                  </template>
                  <div v-else class="drop-empty">
                    <i class="fa-solid fa-calendar-xmark"></i> Aucun événement
                  </div>
                </div>
              </li>

              <li>
                <router-link to="/blog" class="nav-link" active-class="nav-link--active" @click="closeAll">
                  Articles
                </router-link>
              </li>
            </ul>

            <!-- Mobile : actions auth dans le menu -->
            <div class="nav-mobile-actions">
              <button class="lang-pill lang-pill--mobile" @click="toggleLocale">
                <i class="fa-solid fa-globe"></i>
                {{ locale === 'fr' ? 'Français' : 'English' }}
                <i class="fa-solid fa-chevron-down" style="font-size:9px;"></i>
              </button>
              <template v-if="!isLoggedIn">
                <router-link to="/register" class="btn btn--outline-white" @click="closeAll">Souscription</router-link>
                <router-link to="/login"    class="btn btn--orange-solid"  @click="closeAll">Connexion</router-link>
              </template>
              <template v-else>
                <router-link :to="dashboardRoute" class="btn btn--outline-white" @click="closeAll">Dashboard</router-link>
              </template>
            </div>
          </nav>

          <!-- Actions droite (desktop) -->
          <div class="header-actions">

            <!-- Favoris (talent) -->
            <div v-if="isLoggedIn && userRole === 'talent'" class="favori-wrap" ref="favoriWrapRef">
              <button
                class="fav-btn"
                :class="{ 'fav-btn--active': favoris.length > 0 }"
                @click="favoriOpen = !favoriOpen"
                aria-label="Mes favoris"
              >
                <i :class="favoris.length > 0 ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                <span v-if="favoris.length" class="fav-badge">{{ favoris.length > 9 ? '9+' : favoris.length }}</span>
              </button>

              <Transition name="drop-anim">
                <div v-if="favoriOpen" class="favori-dropdown">
                  <div class="favori-head">
                    <span><i class="fa-solid fa-heart"></i> Mes favoris</span>
                    <span class="fav-count">{{ favoris.length }}</span>
                  </div>
                  <div v-if="!favoris.length" class="favori-empty">
                    <i class="fa-regular fa-heart"></i>
                    <p>Aucun favori pour l'instant</p>
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
                    Voir tous mes favoris <i class="fa-solid fa-arrow-right"></i>
                  </router-link>
                </div>
              </Transition>
            </div>

            <!-- Switcher langue -->
            <div class="lang-wrap" ref="langWrapRef">
              <button class="lang-pill" @click.stop="langOpen = !langOpen">
                <i class="fa-solid fa-globe"></i>
                {{ locale === 'fr' ? 'Français' : 'English' }}
                <i class="fa-solid fa-chevron-down lang-chevron" :class="{ open: langOpen }"></i>
              </button>
              <Transition name="drop-anim">
                <div v-if="langOpen" class="lang-dropdown">
                  <button class="lang-option" :class="{ active: locale === 'fr' }" @click="setLocale('fr')">
                    <span>🇫🇷</span> Français
                    <i v-if="locale === 'fr'" class="fa-solid fa-check"></i>
                  </button>
                  <button class="lang-option" :class="{ active: locale === 'en' }" @click="setLocale('en')">
                    <span>🇬🇧</span> English
                    <i v-if="locale === 'en'" class="fa-solid fa-check"></i>
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Non-connecté -->
            <template v-if="!isLoggedIn">
              <router-link to="/register" class="btn btn--outline">Souscription</router-link>
              <router-link to="/login"    class="btn btn--orange">Connexion</router-link>
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
                    <i class="fa-solid fa-gauge"></i> Dashboard
                  </router-link>
                  <div class="user-divider"></div>
                  <button class="user-item user-item--danger" @click="logout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Déconnexion
                  </button>
                </div>
              </Transition>
            </div>

          </div>

          <!-- Burger mobile -->
          <button class="burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>

        </div>
      </div>

      <!-- Overlay (ferme les dropdowns) -->
      <div v-if="activeDrop" class="nav-overlay" @click="closeAll"></div>
    </header>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useFavoris } from '../composables/useFavoris.js'

const apiBase    = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route      = useRoute()
const router     = useRouter()

const categories    = ref([])
const isScrolled    = ref(false)
const menuOpen      = ref(false)
const activeDrop    = ref(null)
const featuredEvent = ref(null)
const countdown     = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let   countdownTimer = null

const isLoggedIn = ref(!!localStorage.getItem('token'))
const userRole   = ref(localStorage.getItem('userRole') || '')
const userName   = computed(() => {
  const n = localStorage.getItem('userName') || localStorage.getItem('userEmail') || ''
  return n.split(' ')[0].toUpperCase() || 'MON COMPTE'
})

const dashboardRoute = computed(() =>
  ({ admin: '/admin', talent: '/talent', entreprise: '/entreprise' }[userRole.value] || '/login')
)

// ── Langue ──────────────────────────────────────────────
const locale   = ref(localStorage.getItem('locale') || 'fr')
const langOpen  = ref(false)
const langWrapRef = ref(null)

function setLocale(l) { locale.value = l; localStorage.setItem('locale', l); langOpen.value = false }
function toggleLocale() { setLocale(locale.value === 'fr' ? 'en' : 'fr') }

// ── Dropdowns ────────────────────────────────────────────
function toggleDrop(name) { activeDrop.value = activeDrop.value === name ? null : name }
function closeAll() { activeDrop.value = null; menuOpen.value = false; favoriOpen.value = false; langOpen.value = false; userOpen.value = false }

watch(() => route.fullPath, () => {
  isLoggedIn.value = !!localStorage.getItem('token')
  userRole.value   = localStorage.getItem('userRole') || ''
  if (isLoggedIn.value && userRole.value === 'talent') loadFavoris()
  closeAll()
})

// ── User dropdown ────────────────────────────────────────
const userOpen    = ref(false)
const userWrapRef = ref(null)

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  closeAll()
  router.push('/login')
}

// ── Favoris ──────────────────────────────────────────────
const { favoris, loadFavoris, removeFavori } = useFavoris()
const favoriOpen    = ref(false)
const favoriWrapRef = ref(null)

// ── Click outside ────────────────────────────────────────
function onClickOutside(e) {
  if (favoriWrapRef.value && !favoriWrapRef.value.contains(e.target)) favoriOpen.value = false
  if (langWrapRef.value   && !langWrapRef.value.contains(e.target))   langOpen.value   = false
  if (userWrapRef.value   && !userWrapRef.value.contains(e.target))   userOpen.value   = false
  if (!e.target.closest('.has-drop')) activeDrop.value = null
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
/* ── Topbar ─────────────────────────────────────────── */
.topbar {
  background: #040a5d; height: 34px;
  display: flex; align-items: center;
  font-size: 11px; color: rgba(255,255,255,.6);
}
.topbar .container { display: flex; justify-content: space-between; align-items: center; }
.topbar-left  { display: flex; align-items: center; gap: 8px; }
.topbar-right { display: flex; gap: 12px; }
.topbar-right a { color: rgba(255,255,255,.45); font-size: 11px; transition: color .15s; }
.topbar-right a:hover { color: #f07c00; }
.topbar-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #f07c00;
  box-shadow: 0 0 5px #f07c00; animation: blink 2s infinite; flex-shrink: 0;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
.topbar-label { color: rgba(255,255,255,.75); font-weight: 600; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.countdown-blocks { display: flex; align-items: center; gap: 2px; }
.cd-block  { display: flex; align-items: baseline; gap: 1px; }
.cd-num    { font-size: 12px; font-weight: 700; color: #fff; min-width: 16px; text-align: center; }
.cd-unit   { font-size: 8px; font-weight: 700; color: #f07c00; }
.cd-sep    { font-size: 11px; color: rgba(255,255,255,.3); margin: 0 1px; }

/* ── Header ─────────────────────────────────────────── */
.site-header {
  background: #fff;
  position: sticky; top: 0; z-index: 200;
  border-bottom: 1.5px solid #f0f2f8;
  transition: box-shadow .25s, border-color .25s;
}
.site-header.scrolled { box-shadow: 0 4px 24px rgba(4,10,93,.09); border-color: transparent; }

.header-inner {
  display: flex; align-items: center; height: 64px; gap: 0;
}

/* Logo */
.site-logo {
  display: flex; flex-direction: column; gap: 1px;
  text-decoration: none; flex-shrink: 0; margin-right: 36px;
}
.site-tagline { font-size: 10px; font-weight: 700; color: #f07c00; letter-spacing: .3px; position: relative; top: -5px; }

/* ── Nav ─────────────────────────────────────────────── */
.site-nav { display: flex; flex: 1; }
.site-nav ul { display: flex; list-style: none; margin: 0; padding: 0; align-items: center; gap: 2px; }

.nav-link {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 8px;
  font-size: 14px; font-weight: 500; color: #374151;
  text-decoration: none; background: none; border: none;
  cursor: pointer; white-space: nowrap;
  transition: color .15s, background .15s;
}
.nav-link:hover          { color: #192bc2; background: #f0f3ff; }
.nav-link--active        { color: #192bc2; background: #eef1fd; font-weight: 600; }
.nav-link--drop          { user-select: none; }
.drop-open .nav-link--drop { color: #192bc2; background: #eef1fd; }

.drop-chevron {
  font-size: 9px; color: #9ca3af;
  transition: transform .2s, color .2s;
}
.drop-open .drop-chevron { transform: rotate(180deg); color: #192bc2; }

/* ── Dropdown panel ──────────────────────────────────── */
.has-drop { position: relative; }

.drop-panel {
  position: absolute; top: calc(100% + 10px); left: 50%;
  transform: translateX(-50%);
  background: #fff; border-radius: 14px;
  box-shadow: 0 8px 40px rgba(4,10,93,.13), 0 1px 4px rgba(0,0,0,.05);
  border: 1px solid #eef0f8;
  padding: 8px; min-width: 280px; z-index: 300;
  /* hidden by default */
  opacity: 0; pointer-events: none;
  transform: translateX(-50%) translateY(-8px);
  transition: opacity .18s, transform .18s;
}
.drop-panel::before {
  content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
  border: 6px solid transparent; border-bottom-color: #fff;
  filter: drop-shadow(0 -1px 1px rgba(0,0,0,.05));
}
.drop-open .drop-panel {
  opacity: 1; pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.drop-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  text-decoration: none; color: #1e293b;
  transition: background .12s;
}
.drop-item:hover { background: #f8f9ff; }
.drop-item strong { display: block; font-size: 13.5px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
.drop-item span   { display: block; font-size: 12px; color: #94a3b8; }

.drop-item-icon {
  width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.di--blue   { background: #e8f0fe; color: #192bc2; }
.di--violet { background: #ede9fe; color: #7c3aed; }
.di--orange { background: #fff3e0; color: #f07c00; }

.drop-empty { display: flex; align-items: center; gap: 10px; padding: 14px 12px; font-size: 13px; color: #94a3b8; }

.nav-overlay { position: fixed; inset: 0; z-index: 150; }

/* ── Header actions ──────────────────────────────────── */
.header-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }

/* Boutons auth */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 20px; border-radius: 8px;
  font-size: 13.5px; font-weight: 600;
  text-decoration: none; border: none; cursor: pointer;
  white-space: nowrap; transition: all .15s;
}
.btn--outline {
  background: #fff; color: #1e293b;
  border: 1.5px solid #d1d5db;
}
.btn--outline:hover { border-color: #192bc2; color: #192bc2; background: #f0f3ff; }
.btn--orange {
  background: #f07c00; color: #fff;
  box-shadow: 0 2px 8px rgba(240,124,0,.25);
}
.btn--orange:hover { background: #d96e00; box-shadow: 0 4px 14px rgba(240,124,0,.35); transform: translateY(-1px); }

/* Langue */
.lang-wrap { position: relative; }
.lang-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 12px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: #374151;
  background: none; border: 1.5px solid #e5e7eb;
  cursor: pointer; transition: border-color .15s, color .15s, background .15s;
  white-space: nowrap;
}
.lang-pill i:first-child { font-size: 14px; color: #6b7280; }
.lang-pill:hover { border-color: #192bc2; color: #192bc2; background: #f0f3ff; }
.lang-chevron { font-size: 9px; color: #9ca3af; transition: transform .2s; }
.lang-chevron.open { transform: rotate(180deg); }

.lang-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 10px;
  box-shadow: 0 8px 32px rgba(4,10,93,.12), 0 1px 4px rgba(0,0,0,.05);
  border: 1px solid #eef0f8;
  padding: 6px; min-width: 150px; z-index: 400;
}
.lang-option {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 8px 12px; border-radius: 7px;
  font-size: 13.5px; font-weight: 500; color: #374151;
  background: none; border: none; cursor: pointer;
  transition: background .12s;
}
.lang-option:hover  { background: #f8f9ff; }
.lang-option.active { color: #192bc2; font-weight: 600; }
.lang-option i      { margin-left: auto; font-size: 11px; color: #192bc2; }

/* Favoris */
.favori-wrap { position: relative; }
.fav-btn {
  position: relative; background: none; border: none; cursor: pointer;
  width: 38px; height: 38px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; color: #9ca3af;
  transition: color .15s, background .15s;
}
.fav-btn:hover          { color: #f43f5e; background: #fff5f7; }
.fav-btn--active        { color: #f43f5e; }
.fav-badge {
  position: absolute; top: 1px; right: 1px;
  background: #f43f5e; color: #fff;
  font-size: 9px; font-weight: 800; min-width: 16px; height: 16px;
  border-radius: 50px; padding: 0 3px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff; line-height: 1;
}

.favori-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 300px; background: #fff; border-radius: 14px;
  box-shadow: 0 8px 40px rgba(4,10,93,.13); border: 1px solid #eef0f8;
  border-top: 3px solid #f43f5e; z-index: 400; overflow: hidden;
}
.favori-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 15px 11px;
  font-size: 13px; font-weight: 700; color: #1e293b;
  border-bottom: 1px solid #f4f5fb;
}
.favori-head i { color: #f43f5e; margin-right: 5px; }
.fav-count { background: #f43f5e; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 50px; }
.favori-empty { padding: 22px 15px; text-align: center; color: #94a3b8; }
.favori-empty i { font-size: 26px; opacity: .25; display: block; margin-bottom: 7px; }
.favori-empty p { font-size: 13px; margin: 0; }
.favori-list { list-style: none; margin: 0; padding: 7px; max-height: 280px; overflow-y: auto; }
.favori-item { display: flex; align-items: center; border-radius: 8px; transition: background .12s; }
.favori-item:hover { background: #f8f9ff; }
.favori-link { flex: 1; display: flex; align-items: center; gap: 9px; padding: 8px 7px; text-decoration: none; min-width: 0; }
.favori-logo { width: 34px; height: 34px; border-radius: 7px; flex-shrink: 0; background: #f4f5fb; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.favori-logo img  { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.favori-logo span { font-size: 13px; font-weight: 800; color: #192bc2; }
.favori-info { flex: 1; min-width: 0; }
.favori-titre { font-size: 12.5px; font-weight: 600; color: #1e293b; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-ent   { font-size: 11px; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favori-rm    { flex-shrink: 0; background: none; border: none; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #cbd5e1; transition: background .12s, color .12s; margin-right: 7px; }
.favori-rm:hover { background: #fee2e2; color: #f43f5e; }
.favori-footer { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 15px; font-size: 12px; font-weight: 700; color: #192bc2; text-decoration: none; border-top: 1px solid #f4f5fb; transition: background .12s; }
.favori-footer:hover { background: #f8f9ff; }

/* User pill */
.user-wrap { position: relative; }
.user-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 8px;
  background: none; border: 1.5px solid #e5e7eb;
  cursor: pointer; font-size: 13.5px; font-weight: 600; color: #374151;
  transition: border-color .15s, background .15s, color .15s;
}
.user-pill:hover { border-color: #192bc2; color: #192bc2; background: #f0f3ff; }
.user-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: #eef1fd; display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #192bc2; flex-shrink: 0;
}
.user-name   { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-chevron { font-size: 9px; color: #9ca3af; transition: transform .2s; }
.user-chevron.open { transform: rotate(180deg); }

.user-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(4,10,93,.12), 0 1px 4px rgba(0,0,0,.05);
  border: 1px solid #eef0f8;
  padding: 6px; min-width: 180px; z-index: 400;
}
.user-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 12px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: #374151;
  text-decoration: none; background: none; border: none; cursor: pointer;
  transition: background .12s, color .12s;
}
.user-item i          { font-size: 13px; color: #9ca3af; width: 16px; text-align: center; }
.user-item:hover      { background: #f8f9ff; color: #192bc2; }
.user-item:hover i    { color: #192bc2; }
.user-item--danger:hover { background: #fff5f5; color: #ef4444; }
.user-item--danger:hover i { color: #ef4444; }
.user-divider { height: 1px; background: #f0f2f8; margin: 4px 6px; }

/* Animations dropdowns */
.drop-anim-enter-active, .drop-anim-leave-active { transition: opacity .16s ease, transform .16s ease; }
.drop-anim-enter-from, .drop-anim-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Burger mobile ───────────────────────────────────── */
.burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  padding: 8px; background: none; border: none; cursor: pointer; margin-left: 12px;
}
.burger span { width: 22px; height: 2px; background: #374151; border-radius: 2px; display: block; transition: transform .25s, opacity .25s; }
.burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-close { display: none; position: absolute; top: 18px; right: 18px; background: rgba(255,255,255,.12); border: none; cursor: pointer; width: 38px; height: 38px; border-radius: 50%; font-size: 17px; color: #fff; align-items: center; justify-content: center; }
.nav-mobile-actions { display: none; }

/* ── Mobile ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .burger { display: flex; }

  .site-nav {
    display: none; position: fixed; inset: 0; z-index: 500;
    background: #040a5d;
    flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px;
  }
  .site-nav.open { display: flex; }
  .nav-close { display: flex; }

  .site-nav ul { flex-direction: column; gap: 2px; width: 100%; max-width: 280px; }
  .nav-link { color: rgba(255,255,255,.8); font-size: 16px; padding: 11px 16px; width: 100%; justify-content: space-between; border-radius: 10px; }
  .nav-link:hover, .nav-link--active { background: rgba(255,255,255,.1); color: #fff; }
  .drop-chevron { color: rgba(255,255,255,.4); }
  .drop-open .nav-link--drop { background: rgba(255,255,255,.1); color: #fff; }

  .drop-panel {
    position: static; transform: none; opacity: 1; pointer-events: auto;
    background: rgba(255,255,255,.07); box-shadow: none; border: none; border-radius: 8px; margin-top: 4px; padding: 4px;
  }
  .drop-panel::before { display: none; }
  .drop-item { padding: 9px 10px; border-radius: 7px; }
  .drop-item:hover { background: rgba(255,255,255,.08); }
  .drop-item strong { color: rgba(255,255,255,.85); }
  .drop-item span   { color: rgba(255,255,255,.45); }

  .nav-mobile-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.1); }
  .lang-pill--mobile { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); color: rgba(255,255,255,.8); width: 100%; justify-content: center; }
  .btn--outline-white { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.3); text-align: center; justify-content: center; }
  .btn--orange-solid  { background: #f07c00; color: #fff; text-align: center; justify-content: center; }

  .header-actions .btn--outline,
  .header-actions .lang-wrap,
  .header-actions .user-wrap { display: none; }

  .nav-overlay { display: none; }

  .topbar-label { max-width: 140px; }
}

@media (max-width: 480px) {
  .site-logo img { width: 120px; }
  .header-actions .btn--orange { padding: 7px 14px; font-size: 12.5px; }
}
</style>
