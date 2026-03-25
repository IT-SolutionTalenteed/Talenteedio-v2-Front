<template>
  <div>
    <!-- ══ TOP BAR ══ -->
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <a href="tel:+3522060162"><i class="fa-solid fa-phone"></i> +3522060162</a>
          <a href="mailto:contact@africatalentsummit.com"><i class="fa-solid fa-envelope"></i> contact@africatalentsummit.com</a>
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

const apiBase     = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const categories  = ref([])
const isScrolled  = ref(false)
const menuOpen    = ref(false)

const isLoggedIn     = ref(!!localStorage.getItem('token'))
const userRole       = ref(localStorage.getItem('userRole') || '')

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

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  try {
    const res = await axios.get(`${apiBase}/public/categories-evenements`)
    categories.value = res.data
  } catch {}
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
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
.topbar-left { display: flex; gap: 20px; }
.topbar-left a { color: rgba(255,255,255,.75); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color .15s; }
.topbar-left a:hover { color: #fff; }
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
