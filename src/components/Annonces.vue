<template>
  <div class="page-wrapper">
    <div class="annonces-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="annonces-hero">
      <div class="hero-stripes"></div>
      <div class="container hero-inner">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          {{ t('annonces.hero.label') }}
        </div>
        <h1 class="hero-title">
          {{ t('annonces.hero.title').split(' ').slice(0, -2).join(' ') }}
          <em>{{ t('annonces.hero.title').split(' ').slice(-2).join(' ') }}</em>
        </h1>
        <p class="hero-sub">{{ t('annonces.hero.description') }}</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-num">{{ pagination.total || '—' }}</span>
            <span class="hero-stat-lbl">{{ t('annonces.results.countPlural') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ BARRE DE RECHERCHE STICKY ══ -->
    <div class="search-sticky-wrap">
      <div class="search-bar container">
        <!-- Mot-clé -->
        <div class="sb-group">
          <i class="fa-solid fa-magnifying-glass sb-icon"></i>
          <input
            class="sb-input"
            type="text"
            v-model="filters.search"
            placeholder="Titre du poste..."
            @input="debouncedSearch"
          />
        </div>
        <!-- Localisation -->
        <div class="sb-group">
          <i class="fa-solid fa-location-dot sb-icon"></i>
          <input
            class="sb-input"
            type="text"
            v-model="filters.localisation"
            placeholder="Ville, pays..."
            @input="debouncedSearch"
          />
        </div>
        <!-- Type de contrat -->
        <div class="sb-group sb-group--select">
          <i class="fa-solid fa-briefcase sb-icon"></i>
          <select class="sb-select" v-model="contractFilter" @change="applyFilters">
            <option value="">{{ t('annonces.filters.employmentType') }}</option>
            <option v-for="c in referentiels.job_contracts" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <!-- Date de publication -->
        <div class="sb-group sb-group--select">
          <i class="fa-solid fa-clock sb-icon"></i>
          <select class="sb-select" v-model="filters.date_range" @change="applyFilters">
            <option value="">{{ t('annonces.filters.all') }}</option>
            <option v-for="d in dateRanges.filter(d => d.value)" :key="d.value" :value="d.value">{{ d.label }}</option>
          </select>
        </div>
        <!-- Niveau d'études — multiselect custom -->
        <div class="sb-group sb-group--multi" ref="studyDropRef">
          <i class="fa-solid fa-graduation-cap sb-icon"></i>
          <button class="sb-multi-btn" @click.stop="studyDropOpen = !studyDropOpen" type="button">
            <span v-if="filters.study_level_ids.length === 0">{{ t('annonces.filters.studyLevel') }}</span>
            <span v-else>{{ filters.study_level_ids.length }} {{ t('annonces.studyLevelCount') }}</span>
            <i class="fa-solid fa-chevron-down sb-caret" :class="{ 'sb-caret--open': studyDropOpen }"></i>
          </button>
          <div class="sb-dropdown" v-show="studyDropOpen">
            <label
              v-for="s in referentiels.study_levels"
              :key="s.id"
              class="sb-dropdown-item"
            >
              <input type="checkbox" :value="s.id" v-model="filters.study_level_ids" @change="applyFilters" />
              <span class="sb-check-box"></span>
              {{ s.name }}
            </label>
            <div class="sb-dropdown-footer" v-if="filters.study_level_ids.length">
              <button @click="filters.study_level_ids = []; applyFilters()">{{ t('annonces.clear') }}</button>
            </div>
          </div>
        </div>
        <!-- Bouton recherche -->
        <button class="sb-btn" @click="applyFilters">
          <i class="fa-solid fa-magnifying-glass"></i>
          Rechercher
        </button>
      </div>
    </div>

    <!-- ══ FILTRES NIVEAU ÉTUDE + CONTENU ══ -->
    <section class="annonces-body">
      <div class="container">

        <!-- Barre de résultats + filtres chips -->
        <div class="results-header">
          <div class="results-left">
            <span class="results-count" v-if="!loading">
              <strong>{{ pagination.total }}</strong>
              {{ pagination.total !== 1 ? t('annonces.results.countPlural') : t('annonces.results.count') }}
              {{ pagination.total !== 1 ? t('annonces.results.foundPlural') : t('annonces.results.found') }}
            </span>
            <span class="results-count" v-else>{{ t('annonces.results.loading') }}</span>

            <!-- Chips actifs -->
            <div class="active-chips">
              <span v-if="filters.search" class="chip chip--active">
                <i class="fa-solid fa-magnifying-glass"></i> {{ filters.search }}
                <button @click="filters.search=''; applyFilters()"><i class="fa-solid fa-xmark"></i></button>
              </span>
              <span v-if="filters.localisation" class="chip chip--active">
                <i class="fa-solid fa-location-dot"></i> {{ filters.localisation }}
                <button @click="filters.localisation=''; applyFilters()"><i class="fa-solid fa-xmark"></i></button>
              </span>
              <span v-if="filters.job_contract_ids.length" class="chip chip--active">
                <i class="fa-solid fa-briefcase"></i> {{ filters.job_contract_ids.length }} contrat(s)
                <button @click="filters.job_contract_ids=[]; applyFilters()"><i class="fa-solid fa-xmark"></i></button>
              </span>
            </div>
          </div>

          <div class="results-right">
            <button class="btn-reset" v-if="hasActiveFilters" @click="resetFilters">
              <i class="fa-solid fa-rotate-left"></i> {{ t('annonces.filters.reset') }}
            </button>
          </div>
        </div>

        <!-- ── Skeleton ── -->
        <div v-if="loading" class="offres-grid">
          <div v-for="n in 8" :key="n" class="offre-card offre-card--skeleton">
            <div class="sk-logo"></div>
            <div class="sk-lines">
              <div class="sk-line sk-line--lg"></div>
              <div class="sk-line sk-line--sm"></div>
              <div class="sk-line sk-line--md"></div>
              <div class="sk-line sk-line--xs"></div>
            </div>
          </div>
        </div>

        <!-- ── Résultats ── -->
        <div v-else-if="offres.length" class="offres-grid">
          <router-link
            v-for="(offre, idx) in offres"
            :key="offre.id"
            :to="`/annonces/${offre.id}`"
            class="offre-card offre-card--link"
          >
            <!-- Image de l'offre -->
            <div v-if="offre.image_url" class="offre-card-visual">
              <div class="offre-card-bg" :style="`background-image:url('${offre.image_url}');background-size:cover;background-position:center`"></div>
            </div>

            <!-- Badge Nouveau (moins de 24h) -->
            <span v-if="isNew(offre.created_at)" class="badge-new">{{ t('annonces.new') }}</span>

            <!-- Header carte : logo + entreprise -->
            <div class="offre-head">
              <div class="offre-logo">
                <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                <span v-else class="offre-logo-initial">
                  {{ offre.entreprise ? offre.entreprise.nom.charAt(0) : '?' }}
                </span>
              </div>
              <div class="offre-company-info">
                <span class="offre-company">{{ offre.entreprise?.nom || t('annonces.card.companyNotSpecified') }}</span>
                <span v-if="offre.date_limite" class="offre-deadline">
                  <i class="fa-solid fa-calendar-xmark"></i> {{ formatDate(offre.date_limite) }}
                </span>
              </div>
              <button
                class="btn-favori"
                :class="{ 'btn-favori--active': isFavoriId(offre.id) }"
                :title="isFavoriId(offre.id) ? t('annonces.card.removeFromFavorites') : t('annonces.card.addToFavorites')"
                @click.stop.prevent="toggleFavori(offre.id)"
              >
                <i :class="isFavoriId(offre.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              </button>
            </div>

            <!-- Titre offre -->
            <h3 class="offre-title">{{ offre.titre }}</h3>

            <!-- Salaire -->
            <div v-if="offre.fourchette_salariale" class="offre-salary">
              <i class="fa-solid fa-euro-sign"></i>
              {{ offre.fourchette_salariale }}
            </div>

            <!-- Tags -->
            <div class="offre-tags">
              <span v-if="offre.localisation" class="tag tag--location">
                <i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}
              </span>
              <span v-for="c in offre.job_contracts" :key="c.id" class="tag tag--contract">{{ c.name }}</span>
              <span v-for="s in offre.study_levels" :key="s.id" class="tag tag--study">{{ s.name }}</span>
            </div>

            <!-- Description -->
            <p class="offre-desc">{{ truncate(stripHtml(offre.mission), 120) }}</p>

            <!-- Footer carte -->
            <div class="offre-footer">
              <span class="offre-date" v-if="offre.created_at">
                <i class="fa-regular fa-clock"></i> {{ timeAgo(offre.created_at) }}
              </span>
              <span class="btn btn--blue btn--sm">{{ t('annonces.card.viewOffer') }}</span>
            </div>
          </router-link>
        </div>

        <!-- ── Vide ── -->
        <div v-else class="annonces-empty">
          <div class="empty-icon">
            <i class="fa-solid fa-folder-open"></i>
          </div>
          <p class="empty-title">{{ t('annonces.empty.title') }}</p>
          <button class="btn btn--blue" @click="resetFilters">{{ t('annonces.empty.action') }}</button>
        </div>

        <!-- ── Pagination ── -->
        <div v-if="pagination.last_page > 1" class="annonces-pagination">
          <button
            v-for="page in paginationPages"
            :key="page"
            :class="['page-btn', { 'page-btn--active': page === pagination.current_page, 'page-btn--dots': page === '...' }]"
            :disabled="page === '...'"
            @click="page !== '...' && loadPage(page)"
          >{{ page }}</button>
        </div>

      </div>
    </section>

    </div>

    <!-- ══ FOOTER ══ -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import { useFavoris } from '../composables/useFavoris.js'

const { t, locale } = useI18n()
const apiBase    = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const offres       = ref([])
const referentiels = ref({ job_contracts: [], study_levels: [], activity_sectors: [] })
const loading      = ref(false)
const pagination   = ref({ current_page: 1, last_page: 1, total: 0 })

const { favoris, loadFavoris, toggleFavori: _toggleFavori, isFavoriId } = useFavoris()

// ── Multiselect niveau d'études ───────────────────────────
const studyDropOpen = ref(false)
const studyDropRef  = ref(null)
const onClickOutsideStudy = (e) => {
  if (studyDropRef.value && !studyDropRef.value.contains(e.target)) studyDropOpen.value = false
}

const dateRanges = computed(() => [
  { value: '',          label: t('annonces.dateRanges.all') },
  { value: 'last_hour', label: t('annonces.dateRanges.lastHour') },
  { value: 'last_24h',  label: t('annonces.dateRanges.last24h') },
  { value: 'last_7d',   label: t('annonces.dateRanges.last7d') },
  { value: 'last_14d',  label: t('annonces.dateRanges.last14d') },
  { value: 'last_30d',  label: t('annonces.dateRanges.last30d') },
])

const filters = reactive({
  search:           '',
  localisation:     '',
  job_contract_ids: [],
  study_level_ids:  [],
  date_range:       '',
})

// Single contract select helper (maps to job_contract_ids[])
const contractFilter = computed({
  get: () => filters.job_contract_ids[0] ?? '',
  set: (val) => { filters.job_contract_ids = val ? [val] : [] }
})

const hasActiveFilters = computed(() =>
  filters.search || filters.localisation || filters.job_contract_ids.length ||
  filters.study_level_ids.length || filters.date_range
)

// ── Chargement ─────────────────────────────────────────────
const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 9,
      ...(filters.search       && { search:       filters.search }),
      ...(filters.localisation && { localisation: filters.localisation }),
      ...(filters.date_range   && { date_range:   filters.date_range }),
    }
    filters.job_contract_ids.forEach(id => {
      if (!params['job_contract_ids[]']) params['job_contract_ids[]'] = []
      params['job_contract_ids[]'].push(id)
    })
    filters.study_level_ids.forEach(id => {
      if (!params['study_level_ids[]']) params['study_level_ids[]'] = []
      params['study_level_ids[]'].push(id)
    })

    const res = await axios.get(`${apiBase}/public/offres`, { params })
    offres.value     = res.data.data
    pagination.value = {
      current_page: res.data.current_page,
      last_page:    res.data.last_page,
      total:        res.data.total,
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await axios.get(`${apiBase}/public/referentiels`)
    referentiels.value = res.data
  } catch {}
}

// ── Filtres ────────────────────────────────────────────────
const applyFilters = () => loadPage(1)

let debounceTimer = null
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadPage(1), 400)
}

const resetFilters = () => {
  filters.search           = ''
  filters.localisation     = ''
  filters.job_contract_ids = []
  filters.study_level_ids  = []
  filters.date_range       = ''
  loadPage(1)
}

// ── Pagination pages ───────────────────────────────────────
const paginationPages = computed(() => {
  const total   = pagination.value.last_page
  const current = pagination.value.current_page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ── Utilitaires ────────────────────────────────────────────
const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str
const stripHtml = (html) => !html ? '' : html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const formatDate = (str) => {
  if (!str) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(str).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })
}

const isNew = (dateStr) => {
  if (!dateStr) return false
  return (Date.now() - new Date(dateStr).getTime()) < 86400000
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Il y a moins d\'1h'
  if (h < 24) return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `Il y a ${d}j`
  return formatDate(dateStr)
}

const toggleFavori = async (offreId) => {
  const offre = offres.value.find(o => o.id === offreId)
  if (offre) await _toggleFavori(offre)
}

onMounted(() => {
  loadPage()
  loadReferentiels()
  loadFavoris()
  document.addEventListener('click', onClickOutsideStudy)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutsideStudy)
})
</script>

<style scoped>
/* ── Import fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');

/* ── Variables ── */
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

.annonces-page {
  min-height: 100vh;
  background: var(--light-bg);
  font-family: 'Open Sans', sans-serif;
}

/* ════════════════════════════════
   HERO
════════════════════════════════ */
.annonces-hero {
  background: url('/images/Gemini_Generated_Image_xyh87qxyh87qxyh8.png') center/cover no-repeat;
  position: relative;
  overflow: hidden;
  padding: 0;
  color: #fff;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.hero-stripes {
  display: none;
}

/* Overlay sombre */
.annonces-hero::after {
  content: '';
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
  border: none;
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

.hero-badge-dot {
  display: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(.8); }
}

.hero-title {
  font-family: 'Sarun Pro', sans-serif;
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
  opacity: .95;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-stat-num {
  font-family: 'Sarun Pro', sans-serif;
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

.hero-stat-sep {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,.35);
}

/* ════════════════════════════════
   BARRE RECHERCHE STICKY
════════════════════════════════ */
.search-sticky-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navy, #00235a);
  border-bottom: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 4px 24px rgba(0,0,35,.4);
}

.search-bar {
  display: grid;
  grid-template-columns: 1.1fr 1fr 0.9fr 0.9fr 0.9fr auto;
  gap: 0;
  height: 60px;
  align-items: stretch;
}

.sb-group {
  position: relative;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(255,255,255,.1);
}

.sb-group:last-of-type {
  border-right: none;
}

.sb-icon {
  position: absolute;
  left: 14px;
  color: rgba(255,255,255,.4);
  font-size: 12px;
  pointer-events: none;
  z-index: 1;
}

.sb-input,
.sb-select {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 14px 0 38px;
  font-size: 13px;
  color: #fff;
  font-family: 'Open Sans', sans-serif;
}

.sb-input::placeholder {
  color: rgba(255,255,255,.35);
}

.sb-select {
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  color: rgba(255,255,255,.75);
}

.sb-select option {
  background: var(--navy, #00235a);
  color: #fff;
}

/* ── Multiselect niveau d'études ── */
.sb-group--multi {
  position: relative;
}

.sb-multi-btn {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 14px 0 38px;
  font-size: 13px;
  color: rgba(255,255,255,.75);
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  white-space: nowrap;
}

.sb-caret {
  margin-left: auto;
  font-size: 10px;
  opacity: .5;
  transition: transform .2s;
}

.sb-caret--open { transform: rotate(180deg); }

.sb-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
  border: 1px solid var(--border);
  overflow: hidden;
  z-index: 200;
}

.sb-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--navy);
  cursor: pointer;
  transition: background .1s;
}

.sb-dropdown-item:hover { background: var(--light-bg); }

.sb-dropdown-item input[type="checkbox"] {
  display: none;
}

.sb-check-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--border);
  background: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
}

.sb-dropdown-item input:checked ~ .sb-check-box {
  background: var(--blue);
  border-color: var(--blue);
}

.sb-dropdown-item input:checked ~ .sb-check-box::after {
  content: '';
  width: 8px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}

.sb-dropdown-footer {
  padding: 8px 14px;
  border-top: 1px solid var(--border);
  background: var(--light-bg);
}

.sb-dropdown-footer button {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #f43f5e;
  cursor: pointer;
  padding: 0;
}

/* ── Bouton rechercher ── */
.sb-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  background: var(--orange);
  border: none;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Sarun Pro', sans-serif;
  letter-spacing: .5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s;
  white-space: nowrap;
}

.sb-btn:hover {
  background: #d98c0f;
}

@media (max-width: 1100px) {
  .search-bar {
    grid-template-columns: 1fr 1fr 1fr;
    height: auto;
    flex-wrap: wrap;
  }
  .sb-group { height: 52px; }
  .sb-btn { grid-column: 1 / -1; height: 48px; justify-content: center; }
}

@media (max-width: 700px) {
  .search-bar { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .search-bar { grid-template-columns: 1fr; }
}

/* ════════════════════════════════
   CORPS ANNONCES
════════════════════════════════ */
.annonces-body { padding: 36px 0 80px; }

/* ── Barre résultats ── */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.results-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.results-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.results-count {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

.results-count strong {
  color: var(--navy);
  font-weight: 700;
}

/* ── Chips filtres actifs ── */
.active-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
  border: 1.5px solid var(--border);
  background: #fff;
  color: var(--navy);
  cursor: pointer;
  transition: all .15s;
  user-select: none;
}

.chip input { display: none; }

.chip:hover { border-color: var(--blue); color: var(--blue); }

.chip--active {
  background: #e8f3ff;
  border-color: var(--blue);
  color: var(--blue);
}

.chip--active button {
  background: none;
  border: none;
  color: var(--blue);
  cursor: pointer;
  padding: 0;
  margin-left: 2px;
  font-size: 11px;
  line-height: 1;
  display: flex;
  align-items: center;
}


.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}

.btn-reset:hover { border-color: #f43f5e; color: #f43f5e; background: #fff0f3; }

/* ════════════════════════════════
   GRILLE OFFRES
════════════════════════════════ */
.offres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.offre-card-visual {
  margin: -20px -20px 0;
  height: 100px;
  position: relative;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.offre-card-bg {
  position: absolute;
  inset: 0;
}

.offre-card {
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

.offre-card:hover {
  border-color: var(--blue);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

/* Badge nouveau */
.badge-new {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #10b981;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .8px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 50px;
}

/* Header carte */
.offre-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offre-logo {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: var(--light-bg);
  border: 1.5px solid var(--border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.offre-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.offre-logo-initial {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--blue);
}

.offre-company-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.offre-company {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offre-deadline {
  font-size: 11px;
  color: #9ca3af;
}

.offre-deadline i { color: var(--orange); margin-right: 3px; }

/* Favori */
.btn-favori {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #d1d5db;
  padding: 4px;
  transition: color .2s, transform .15s;
  line-height: 1;
  flex-shrink: 0;
}

.btn-favori:hover { color: #f43f5e; transform: scale(1.2); }
.btn-favori--active { color: #f43f5e; }

/* Titre */
.offre-title {
  font-family: 'Sarun Pro', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--navy-head);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -.3px;
}

/* Salaire */
.offre-salary {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--orange);
  font-family: 'Sarun Pro', sans-serif;
  letter-spacing: .2px;
}

.offre-salary i {
  font-size: 13px;
}

/* Tags */
.offre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 50px;
}

.tag--location { background: #dbeafe; color: #1d4ed8; }
.tag--contract { background: #fff7ed; color: #c2410c; }
.tag--study    { background: #dcfce7; color: #15803d; }

/* Description */
.offre-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

/* Footer carte */
.offre-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.offre-date {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Boutons globaux */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 13px;
  font-family: 'Sarun Pro', sans-serif;
  letter-spacing: .3px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all .2s;
}

.btn--blue { background: var(--blue); color: #fff; }
.btn--blue:hover { background: #2584e8; box-shadow: 0 4px 14px rgba(58,155,255,.4); }
.btn--sm { padding: 6px 16px; font-size: 12px; }

/* ════════════════════════════════
   SKELETON
════════════════════════════════ */
.offre-card--skeleton { pointer-events: none; gap: 16px; }

.sk-logo {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #e9ecef;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.sk-line {
  height: 12px;
  border-radius: 6px;
  background: #e9ecef;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-line--lg { width: 65%; height: 18px; }
.sk-line--md { width: 45%; }
.sk-line--sm { width: 80%; }
.sk-line--xs { width: 30%; }

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}

/* ════════════════════════════════
   ÉTAT VIDE
════════════════════════════════ */
.annonces-empty {
  text-align: center;
  padding: 80px 0;
  grid-column: 1 / -1;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--light-bg);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.empty-icon i { font-size: 32px; color: #d1d5db; }

.empty-title {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
}

/* ════════════════════════════════
   PAGINATION
════════════════════════════════ */
.annonces-pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Sarun Pro', sans-serif;
  color: var(--navy);
  cursor: pointer;
  transition: all .15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); }
.page-btn--active { background: var(--navy); border-color: var(--navy); color: #fff; }
.page-btn--dots { border: none; background: transparent; cursor: default; font-size: 16px; }

/* ════════════════════════════════
   RESPONSIVE
════════════════════════════════ */
@media (max-width: 768px) {
  .hero-title { font-size: 38px; }
  .offres-grid { grid-template-columns: 1fr; }
  .results-header { flex-direction: column; align-items: flex-start; }
  .results-right { width: 100%; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 30px; }
  .annonces-hero { padding: 36px 0 48px; }
}
</style>
