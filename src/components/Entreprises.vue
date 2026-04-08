<template>
  <div class="entreprises-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="ent-hero">
      <div class="ent-hero-overlay"></div>
      <div class="container hero-inner">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          {{ t('entreprises.hero.label') }}
        </div>
        <h1 class="hero-title">
          {{ t('entreprises.hero.title').split(' ').slice(0, -2).join(' ') }}
          <em>{{ t('entreprises.hero.title').split(' ').slice(-2).join(' ') }}</em>
        </h1>
        <p class="hero-sub">{{ t('entreprises.hero.description') }}</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-num">{{ entreprises.length || '—' }}</span>
            <span class="hero-stat-lbl">{{ t('entreprises.results.companies') }}</span>
          </div>
        </div>

        <!-- Barre de recherche dans le hero -->
        <div class="hero-search">
          <i class="fa-solid fa-magnifying-glass hero-search-icon"></i>
          <input
            class="hero-search-input"
            type="text"
            v-model="search"
            :placeholder="t('entreprises.search.placeholder')"
            @input="debouncedSearch"
          />
          <button class="hero-search-btn" @click="() => {}">
            Rechercher
          </button>
        </div>
      </div>
    </section>

    <!-- ══ CORPS ══ -->
    <section class="ent-body">
      <div class="container">

        <!-- Tabs secteurs -->
        <div class="sector-tabs-wrap">
          <button class="sector-arrow sector-arrow--left" @click="scrollTabs(-200)" :class="{ 'sector-arrow--hidden': !canScrollLeft }">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="sector-tabs" ref="tabsRef" @scroll="updateArrows">
            <button
              class="sector-tab"
              :class="{ 'sector-tab--active': activeSector === null }"
              @click="activeSector = null"
            >{{ t('entreprises.filters.all') }}</button>
            <button
              v-for="s in sectors"
              :key="s.id"
              class="sector-tab"
              :class="{ 'sector-tab--active': activeSector === s.id }"
              @click="activeSector = s.id"
            >{{ s.name }}</button>
          </div>
          <button class="sector-arrow sector-arrow--right" @click="scrollTabs(200)" :class="{ 'sector-arrow--hidden': !canScrollRight }">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!-- Résultats header -->
        <div class="results-header">
          <div class="results-left">
            <div class="results-count" v-if="!loading">
              <span class="results-num">{{ filtered.length }}</span>
              <span class="results-label">{{ filtered.length !== 1 ? t('entreprises.results.companies') : t('entreprises.results.company') }}</span>
            </div>
            <span class="results-count results-loading" v-else>
              <i class="fa-solid fa-circle-notch fa-spin"></i> Chargement...
            </span>

            <div v-if="search.trim() || activeSector !== null" class="active-filters">
              <span class="filters-label">Filtrés par</span>
              <span v-if="search.trim()" class="filter-tag">
                <i class="fa-solid fa-magnifying-glass"></i>
                {{ search }}
                <button @click="search = ''" aria-label="Retirer ce filtre"><i class="fa-solid fa-xmark"></i></button>
              </span>
              <span v-if="activeSector !== null" class="filter-tag filter-tag--sector">
                <i class="fa-solid fa-industry"></i>
                {{ sectors.find(s => s.id === activeSector)?.name }}
                <button @click="activeSector = null" aria-label="Retirer ce filtre"><i class="fa-solid fa-xmark"></i></button>
              </span>
            </div>
          </div>

          <button class="btn-reset" v-if="search.trim() || activeSector !== null" @click="search = ''; activeSector = null">
            <i class="fa-solid fa-rotate-left"></i> Réinitialiser
          </button>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="ent-grid">
          <div v-for="n in 8" :key="n" class="ent-card ent-card--skeleton">
            <div class="sk-logo-wrap"><div class="sk-logo"></div></div>
            <div class="sk-lines" style="align-items:center">
              <div class="sk-line sk-line--lg"></div>
              <div class="sk-line sk-line--sm"></div>
            </div>
            <div class="sk-lines" style="align-items:center;margin-top:4px">
              <div class="sk-line sk-line--md"></div>
              <div class="sk-line sk-line--md"></div>
            </div>
            <div class="sk-footer"></div>
          </div>
        </div>

        <!-- Résultats -->
        <div v-else-if="filtered.length" class="ent-grid">
          <router-link
            v-for="e in filtered"
            :key="e.id"
            :to="`/entreprises/${e.id}`"
            class="ent-card ent-card--link"
          >
            <!-- Logo centré -->
            <div class="ent-logo-wrap">
              <div class="ent-logo">
                <img v-if="e.logo_url" :src="e.logo_url" :alt="e.nom" />
                <span v-else class="ent-initials">{{ e.nom.charAt(0).toUpperCase() }}</span>
              </div>
            </div>

            <!-- Nom + adresse -->
            <div class="ent-identity">
              <h3 class="ent-name">{{ e.nom }}</h3>
              <span v-if="e.ville || e.pays" class="ent-location-badge">
                <i class="fa-solid fa-location-dot"></i>
                {{ [e.ville, e.pays].filter(Boolean).join(', ') }}
              </span>
            </div>

            <!-- Slogan / description -->
            <p v-if="e.description" class="ent-desc">{{ truncate(e.description, 90) }}</p>

            <!-- Badges compteurs -->
            <div class="ent-badges">
              <div class="ent-badge-item">
                <span class="ent-badge-num">{{ e.evenements_count }}</span>
                <span class="ent-badge-lbl">événement{{ e.evenements_count !== 1 ? 's' : '' }}</span>
              </div>
              <span class="ent-badge-sep">|</span>
              <div class="ent-badge-item">
                <span class="ent-badge-num">{{ e.offres_count }}</span>
                <span class="ent-badge-lbl">{{ e.offres_count !== 1 ? t('entreprises.card.offers') : t('entreprises.card.offer') }}</span>
              </div>
              <span class="ent-badge-sep">|</span>
              <div class="ent-badge-item">
                <span class="ent-badge-num">{{ e.articles_count }}</span>
                <span class="ent-badge-lbl">article{{ e.articles_count !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Vide -->
        <div v-else class="ent-empty">
          <div class="empty-icon"><i class="fa-solid fa-building-circle-xmark"></i></div>
          <p class="empty-title">{{ t('entreprises.empty') }}</p>
          <button class="btn btn--blue" @click="search = ''; activeSector = null">Réinitialiser</button>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t } = useI18n()
const apiBase       = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const entreprises   = ref([])
const sectors       = ref([])
const loading       = ref(false)
const search        = ref('')
const activeSector  = ref(null)
const tabsRef       = ref(null)
const canScrollLeft  = ref(false)
const canScrollRight = ref(false)

const updateArrows = () => {
  const el = tabsRef.value
  if (!el) return
  canScrollLeft.value  = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

const scrollTabs = (px) => {
  tabsRef.value?.scrollBy({ left: px, behavior: 'smooth' })
}

const filtered = computed(() => {
  let list = entreprises.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(e =>
      e.nom.toLowerCase().includes(q) ||
      e.activity_sector?.name?.toLowerCase().includes(q) ||
      e.ville?.toLowerCase().includes(q)
    )
  }
  if (activeSector.value !== null) {
    list = list.filter(e => e.activity_sector?.id === activeSector.value)
  }
  return list
})

const load = async () => {
  loading.value = true
  try {
    const [entRes, refRes] = await Promise.all([
      axios.get(`${apiBase}/public/entreprises`),
      axios.get(`${apiBase}/public/referentiels`),
    ])
    entreprises.value = entRes.data
    sectors.value     = refRes.data.activity_sectors || []
    await nextTick()
    updateArrows()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

let debounceTimer = null
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {}, 300)
}

const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str

onMounted(load)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap');

:root {
  --orange: #f29f1f;
  --blue: #3a9bff;
  --navy: #00235a;
  --navy-head: #1c244b;
  --navy-deep: #000c52;
  --light-bg: #f5f7fc;
  --border: #e0e4ef;
  --radius-lg: 14px;
  --shadow: 0 4px 20px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.18);
}

.entreprises-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Open Sans', sans-serif;
}

/* ════════════════════════════════
   HERO
════════════════════════════════ */
.ent-hero {
  background: url('/images/Gemini_Generated_Image_qnpq2xqnpq2xqnpq.png') center/cover no-repeat;
  position: relative;
  overflow: hidden;
  padding: 0;
  color: #fff;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  /* Le hero se termine proprement — pas de débordement */
  flex-shrink: 0;
}

.ent-hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.35);
  z-index: 0;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  justify-content: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.25);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 6px 18px;
  border-radius: 50px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0,0,0,.15);
}

.hero-badge-dot { display: none; }

.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
  margin: 0 0 20px;
  color: #fff;
  text-shadow: 0 2px 20px rgba(0,0,0,.3);
}

.hero-title em {
  color: var(--orange);
  font-style: normal;
}

.hero-sub {
  font-size: 22px;
  color: rgba(255,255,255,.95);
  line-height: 1.5;
  max-width: 650px;
  margin: 0 0 24px;
  text-shadow: 0 1px 10px rgba(0,0,0,.2);
}

.hero-stats { display: flex; align-items: center; gap: 24px; }
.hero-stat  { display: flex; flex-direction: column; gap: 2px; }
.hero-stat-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(0,0,0,.2);
}
.hero-stat-lbl {
  font-size: 12px;
  color: rgba(255,255,255,.7);
  text-transform: uppercase;
  letter-spacing: .8px;
}

/* ════════════════════════════════
   HERO SEARCH
════════════════════════════════ */
.hero-search {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 32px;
  width: 100%;
  max-width: 560px;
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 50px;
  overflow: hidden;
}

.hero-search-icon {
  position: absolute;
  left: 20px;
  color: rgba(255,255,255,.6);
  font-size: 14px;
  pointer-events: none;
}

.hero-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 14px 16px 14px 46px;
  font-size: 15px;
  color: #fff;
  font-family: 'Open Sans', sans-serif;
}
.hero-search-input::placeholder { color: rgba(255,255,255,.5); }

.hero-search-btn {
  flex-shrink: 0;
  margin: 5px;
  padding: 9px 22px;
  background: var(--orange);
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  transition: background .15s;
}
.hero-search-btn:hover { background: #e08e0a; }

/* ════════════════════════════════
   CORPS
════════════════════════════════ */
.ent-body {
  background: var(--light-bg);
  padding: 32px 0 80px;
}

/* Sector tabs */
.sector-tabs-wrap {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sector-arrow {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: #fff;
  color: var(--navy);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
}
.sector-arrow:hover { border-color: var(--blue); color: var(--blue); }
.sector-arrow--hidden { opacity: 0; pointer-events: none; }

.sector-tabs {
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.sector-tabs::-webkit-scrollbar { display: none; }

.sector-tab {
  flex-shrink: 0;
  padding: 6px 16px;
  border-radius: 50px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.sector-tab:hover { border-color: var(--blue); color: var(--blue); }
.sector-tab--active {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}

/* Résultats header */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding: 14px 18px;
  background: #fff;
  border-radius: 12px;
  border: 1.5px solid var(--border);
}

.results-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.results-count {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.results-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1;
}

.results-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.results-loading {
  font-size: 13px;
  color: #9ca3af;
  gap: 6px;
}

/* Séparateur vertical entre count et filtres */
.active-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-left: 14px;
  border-left: 2px solid var(--border);
}

.filters-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #9ca3af;
  white-space: nowrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(58,155,255,.10);
  color: var(--blue);
  border: 1px solid rgba(58,155,255,.25);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px 4px 10px;
  border-radius: 50px;
  transition: background .15s;
}
.filter-tag:hover { background: rgba(58,155,255,.18); }
.filter-tag i:first-child { font-size: 10px; opacity: .7; }

.filter-tag--sector {
  background: rgba(242,159,31,.10);
  color: var(--orange);
  border-color: rgba(242,159,31,.25);
}
.filter-tag--sector:hover { background: rgba(242,159,31,.18); }

.filter-tag button {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0;
  margin-left: 2px;
  font-size: 10px;
  line-height: 1;
  display: flex;
  align-items: center;
  opacity: .6;
  transition: opacity .15s;
}
.filter-tag button:hover { opacity: 1; }

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: .6px;
  transition: color .15s;
  white-space: nowrap;
}
.btn-reset i { font-size: 11px; }
.btn-reset:hover { color: #f43f5e; }

/* ════════════════════════════════
   GRILLE
════════════════════════════════ */
.ent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ════════════════════════════════
   CARD
════════════════════════════════ */
.ent-card {
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
}
.ent-card:hover {
  border-color: var(--blue);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

/* Logo centré */
.ent-logo-wrap {
  display: flex;
  justify-content: center;
  padding-bottom: 4px;
}

.ent-logo {
  width: 68px;
  height: 68px;
  border-radius: 14px;
  background: var(--light-bg);
  border: 1.5px solid var(--border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ent-logo img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.ent-initials {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: var(--blue);
}

/* Nom + adresse centrés */
.ent-identity {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.ent-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin: 0;
}

.ent-location-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(58,155,255,.12);
  color: var(--blue);
  border: 1px solid rgba(58,155,255,.25);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
}
.ent-location-badge i { font-size: 10px; }

/* Slogan / description */
.ent-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.55;
  margin: 0;
  text-align: center;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Badges compteurs */
.ent-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: auto;
  white-space: nowrap;
}

.ent-badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.ent-badge-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1;
}

.ent-badge-lbl {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: .5px;
  white-space: nowrap;
}

.ent-badge-sep {
  color: #d1d5db;
  font-size: 20px;
  line-height: 1;
  align-self: center;
  user-select: none;
}

/* Bouton réinitialiser vide */
.btn--blue { background: var(--blue); color: #fff; border-radius: 8px; padding: 8px 18px; font-weight: 600; border: none; cursor: pointer; font-family: 'Open Sans', sans-serif; }
.btn--blue:hover { background: #2286e8; }

/* Skeleton */
.ent-card--skeleton { pointer-events: none; gap: 14px; }
.sk-logo-wrap { display: flex; justify-content: center; }
.sk-logo {
  width: 68px;
  height: 68px;
  border-radius: 14px;
  background: linear-gradient(90deg, #e9ecef 25%, #f0f0f0 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.sk-footer {
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e9ecef 25%, #f0f0f0 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  margin-top: auto;
}
.sk-line {
  height: 11px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e9ecef 25%, #f0f0f0 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-line--lg { width: 60%; }
.sk-line--md { width: 75%; }
.sk-line--sm { width: 40%; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Vide */
.ent-empty { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 52px; color: #d1d5db; margin-bottom: 16px; }
.empty-title { font-size: 16px; color: #6b7280; margin-bottom: 20px; }

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
