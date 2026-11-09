<template>
  <div class="page-wrapper">
    <div class="annonces-page">
      <PublicNav />

      <section class="annonces-hero">
        <div class="hero-photo" aria-hidden="true"></div>
        <div class="container hero-inner">
          <div class="hero-copy">
            <span class="hero-badge"><span></span>{{ t('annonces.hero.label') }}</span>
            <h1>{{ t('annonces.hero.title') }}</h1>
            <p>{{ t('annonces.hero.description') }}</p>
          </div>
          <div v-if="!loading && !loadError" class="hero-stat">
            <i class="fa-solid fa-briefcase" aria-hidden="true"></i>
            <div>
              <strong>{{ pagination.total }}</strong>
              <span>{{ t(pagination.total === 1 ? 'annonces.results.count' : 'annonces.results.countPlural') }}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="search-wrap">
        <div class="container">
          <form class="search-panel" @submit.prevent="applyFilters">
            <div class="search-primary">
              <label class="search-field">
                <span class="field-label">{{ t('annonces.filters.keywords') }}</span>
                <span class="field-control">
                  <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                  <input v-model="filters.search" type="search" :placeholder="t('annonces.filters.keywordsPlaceholder')" @input="debouncedSearch" />
                </span>
              </label>
              <label class="search-field">
                <span class="field-label">{{ t('annonces.filters.location') }}</span>
                <span class="field-control">
                  <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <input v-model="filters.localisation" type="search" :placeholder="t('annonces.filters.locationPlaceholder')" @input="debouncedSearch" />
                </span>
              </label>
              <button type="submit" class="search-submit"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>{{ t('annonces.filters.search') }}</button>
            </div>

            <button type="button" class="mobile-filter-toggle" :aria-expanded="advancedOpen" aria-controls="advanced-filters" @click="advancedOpen = !advancedOpen">
              <i class="fa-solid fa-sliders" aria-hidden="true"></i>{{ t('annonces.filters.title') }}
              <i class="fa-solid fa-chevron-down" :class="{ rotated: advancedOpen }" aria-hidden="true"></i>
            </button>

            <div id="advanced-filters" class="search-advanced" :class="{ 'is-open': advancedOpen }">
              <label class="search-field">
                <span class="field-label">{{ t('annonces.filters.employmentType') }}</span>
                <span class="field-control field-control--select">
                  <i class="fa-solid fa-briefcase" aria-hidden="true"></i>
                  <select v-model="contractFilter" @change="applyFilters">
                    <option value="">{{ t('annonces.filters.all') }}</option>
                    <option v-for="contract in referentiels.job_contracts" :key="contract.id" :value="contract.id">{{ contract.name }}</option>
                  </select>
                  <i class="fa-solid fa-chevron-down select-caret" aria-hidden="true"></i>
                </span>
              </label>
              <label class="search-field">
                <span class="field-label">{{ t('annonces.filters.publicationDate') }}</span>
                <span class="field-control field-control--select">
                  <i class="fa-regular fa-clock" aria-hidden="true"></i>
                  <select v-model="filters.date_range" @change="applyFilters">
                    <option v-for="range in dateRanges" :key="range.value" :value="range.value">{{ range.label }}</option>
                  </select>
                  <i class="fa-solid fa-chevron-down select-caret" aria-hidden="true"></i>
                </span>
              </label>
              <div class="search-field study-filter" ref="studyDropRef" @keydown.esc="studyDropOpen = false">
                <span id="study-label" class="field-label">{{ t('annonces.filters.studyLevel') }}</span>
                <button class="field-control study-toggle" type="button" aria-labelledby="study-label study-selection" :aria-expanded="studyDropOpen" aria-controls="study-options" @click="studyDropOpen = !studyDropOpen">
                  <i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
                  <span id="study-selection">{{ filters.study_level_ids.length ? `${filters.study_level_ids.length} ${t('annonces.filters.studyLevelCount')}` : t('annonces.filters.all') }}</span>
                  <i class="fa-solid fa-chevron-down select-caret" aria-hidden="true"></i>
                </button>
                <div v-show="studyDropOpen" id="study-options" class="study-dropdown">
                  <label v-for="level in referentiels.study_levels" :key="level.id" class="study-option">
                    <input type="checkbox" :value="level.id" v-model="filters.study_level_ids" @change="applyFilters" />
                    <span>{{ level.name }}</span>
                  </label>
                  <button v-if="filters.study_level_ids.length" type="button" class="study-clear" @click="clearFilter('study_level_ids')">{{ t('annonces.filters.clear') }}</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <section class="annonces-body" aria-labelledby="offers-heading" :aria-busy="loading">
        <div class="container">
          <div class="results-header">
            <div>
              <span class="section-eyebrow">Talenteed.io</span>
              <h2 id="offers-heading">{{ t('annonces.hero.title') }}</h2>
              <p class="results-count" role="status">
                <template v-if="loading">{{ t('annonces.results.loading') }}</template>
                <template v-else-if="!loadError">
                  <strong>{{ pagination.total }}</strong>
                  {{ t(pagination.total === 1 ? 'annonces.results.count' : 'annonces.results.countPlural') }}
                  {{ t(pagination.total === 1 ? 'annonces.results.found' : 'annonces.results.foundPlural') }}
                </template>
              </p>
            </div>
            <button v-if="hasActiveFilters" type="button" class="btn-reset" @click="resetFilters"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>{{ t('annonces.filters.reset') }}</button>
          </div>

          <div v-if="hasActiveFilters" class="active-chips">
            <button v-if="filters.search" type="button" class="filter-chip" :aria-label="`${t('annonces.filters.clear')} : ${filters.search}`" @click="clearFilter('search')">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>{{ filters.search }}<i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <button v-if="filters.localisation" type="button" class="filter-chip" :aria-label="`${t('annonces.filters.clear')} : ${filters.localisation}`" @click="clearFilter('localisation')">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ filters.localisation }}<i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <button v-if="filters.job_contract_ids.length" type="button" class="filter-chip" :aria-label="`${t('annonces.filters.clear')} : ${t('annonces.filters.employmentType')}`" @click="clearFilter('job_contract_ids')">
              {{ selectedContractLabel }}<i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <button v-if="filters.date_range" type="button" class="filter-chip" :aria-label="`${t('annonces.filters.clear')} : ${t('annonces.filters.publicationDate')}`" @click="clearFilter('date_range')">
              {{ dateRanges.find(range => range.value === filters.date_range)?.label }}<i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <button v-if="filters.study_level_ids.length" type="button" class="filter-chip" :aria-label="`${t('annonces.filters.clear')} : ${t('annonces.filters.studyLevel')}`" @click="clearFilter('study_level_ids')">
              {{ filters.study_level_ids.length }} {{ t('annonces.filters.studyLevelCount') }}<i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <div v-if="loading" class="offres-grid" aria-hidden="true">
            <div v-for="n in 9" :key="n" class="offre-card offre-card--skeleton">
              <div class="skeleton-head"><div class="sk-logo"></div><div class="sk-line sk-line--short"></div></div>
              <div class="sk-line sk-line--title"></div><div class="sk-line"></div><div class="sk-line"></div><div class="sk-line sk-line--short"></div>
            </div>
          </div>

          <div v-else-if="loadError" class="annonces-empty" role="alert">
            <span class="empty-icon"><i class="fa-solid fa-wifi" aria-hidden="true"></i></span>
            <h3>{{ t('annonces.error.title') }}</h3>
            <p>{{ t('annonces.error.description') }}</p>
            <button type="button" class="search-submit" @click="loadPage(pagination.current_page)">{{ t('annonces.error.retry') }}</button>
          </div>

          <div v-else-if="offres.length" class="offres-grid">
            <article v-for="offre in offres" :key="offre.id" class="offre-card">
              <div class="offre-head">
                <div class="offre-logo">
                  <LoadedImage v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" :img-style="{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }" />
                  <span v-else>{{ offre.entreprise?.nom?.charAt(0) || 'T' }}</span>
                </div>
                <div class="offre-company-info">
                  <span class="offre-company">{{ offre.entreprise?.nom || t('annonces.card.companyNotSpecified') }}</span>
                  <span v-if="offre.localisation" class="offre-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ offre.localisation }}</span>
                </div>
                <button type="button" class="btn-favori" :class="{ 'btn-favori--active': isFavoriId(offre.id) }" :aria-pressed="isFavoriId(offre.id)" :aria-label="t(isFavoriId(offre.id) ? 'annonces.card.removeFromFavorites' : 'annonces.card.addToFavorites')" @click="toggleFavori(offre.id)">
                  <i :class="isFavoriId(offre.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" aria-hidden="true"></i>
                </button>
              </div>
              <div class="offre-heading">
                <span v-if="isNew(offre.created_at)" class="badge-new"><span></span>{{ t('annonces.card.new') }}</span>
                <h3 class="offre-title"><router-link :to="`/annonces/${offre.id}`">{{ offre.titre }}</router-link></h3>
              </div>
              <div v-if="offre.job_contracts?.length || offre.study_levels?.length" class="offre-tags">
                <span v-for="contract in offre.job_contracts" :key="`contract-${contract.id}`" class="tag tag--contract">{{ contract.name }}</span>
                <span v-for="level in offre.study_levels" :key="`study-${level.id}`" class="tag">{{ level.name }}</span>
              </div>
              <p v-if="offre.mission" class="offre-desc">{{ truncate(stripHtml(offre.mission), 180) }}</p>
              <div v-if="offre.fourchette_salariale" class="offre-salary"><i class="fa-solid fa-coins" aria-hidden="true"></i>{{ offre.fourchette_salariale }}</div>
              <div v-if="offre.date_limite" class="offre-deadline"><i class="fa-regular fa-calendar" aria-hidden="true"></i>{{ t('annonces.detail.deadline') }} : {{ formatDate(offre.date_limite) }}</div>
              <div class="offre-footer">
                <span class="offre-date"><template v-if="offre.created_at"><i class="fa-regular fa-clock" aria-hidden="true"></i>{{ timeAgo(offre.created_at) }}</template></span>
                <span class="offre-action" aria-hidden="true">{{ t('annonces.card.viewOffer') }}<i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </article>
          </div>

          <div v-else class="annonces-empty">
            <span class="empty-icon"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></span>
            <h3>{{ t('annonces.empty.title') }}</h3>
            <button type="button" class="search-submit" @click="resetFilters">{{ t('annonces.empty.action') }}</button>
          </div>

          <nav v-if="!loading && !loadError && pagination.last_page > 1" class="annonces-pagination" :aria-label="t('common.pagination.page')">
            <button type="button" class="page-btn" :disabled="pagination.current_page === 1" :aria-label="t('common.actions.previous')" @click="goToPage(pagination.current_page - 1)"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
            <template v-for="(page, index) in paginationPages" :key="`${page}-${index}`">
              <span v-if="page === '...'" class="page-ellipsis">…</span>
              <button v-else type="button" class="page-btn" :class="{ 'page-btn--active': page === pagination.current_page }" :aria-current="page === pagination.current_page ? 'page' : undefined" :aria-label="`${t('common.pagination.page')} ${page}`" @click="goToPage(page)">{{ page }}</button>
            </template>
            <button type="button" class="page-btn" :disabled="pagination.current_page === pagination.last_page" :aria-label="t('common.actions.next')" @click="goToPage(pagination.current_page + 1)"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
          </nav>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import LoadedImage from './shared/LoadedImage.vue'
import { useFavoris } from '../composables/useFavoris.js'

const { t, locale } = useI18n()
const apiBase    = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const offres       = ref([])
const referentiels = ref({ job_contracts: [], study_levels: [], activity_sectors: [] })
const loading      = ref(true)
const loadError    = ref(false)
const advancedOpen = ref(false)
let requestController = null
const pagination   = ref({ current_page: 1, last_page: 1, total: 0 })

const { loadFavoris, toggleFavori: _toggleFavori, isFavoriId } = useFavoris()

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
  requestController?.abort()
  const controller = new AbortController()
  requestController = controller
  loading.value = true
  loadError.value = false
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

    const res = await axios.get(`${apiBase}/public/offres`, { params, signal: controller.signal })
    if (controller.signal.aborted) return
    offres.value     = res.data.data
    pagination.value = {
      current_page: res.data.current_page,
      last_page:    res.data.last_page,
      total:        res.data.total,
    }
  } catch (e) {
    if (!controller.signal.aborted) {
      loadError.value = true
      console.error(e)
    }
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await axios.get(`${apiBase}/public/referentiels`)
    referentiels.value = res.data
  } catch {}
}

// ── Filtres ────────────────────────────────────────────────
const applyFilters = () => {
  clearTimeout(debounceTimer)
  return loadPage(1)
}

const clearFilter = (key) => {
  filters[key] = Array.isArray(filters[key]) ? [] : ''
  applyFilters()
}

const selectedContractLabel = computed(() =>
  referentiels.value.job_contracts.find(contract => contract.id === contractFilter.value)?.name || t('annonces.filters.employmentType')
)

const goToPage = async (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  await loadPage(page)
  document.querySelector('.annonces-body')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}

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
  studyDropOpen.value = false
  applyFilters()
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
  const age = Date.now() - new Date(dateStr).getTime()
  return age >= 0 && age < 86400000
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const age = Math.max(0, Date.now() - new Date(dateStr).getTime())
  const formatter = new Intl.RelativeTimeFormat(locale.value === 'en' ? 'en' : 'fr', { numeric: 'auto' })
  if (age < 3600000) return formatter.format(-Math.floor(age / 60000), 'minute')
  if (age < 86400000) return formatter.format(-Math.floor(age / 3600000), 'hour')
  if (age < 604800000) return formatter.format(-Math.floor(age / 86400000), 'day')
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
  clearTimeout(debounceTimer)
  requestController?.abort()
  document.removeEventListener('click', onClickOutsideStudy)
})
</script>

<style scoped>
.annonces-page {
  --orange: #f07c00;
  --blue: #192bc2;
  --navy: #040a5d;
  --border: #e3e7f1;
  --muted: #626c83;
  min-height: 100vh;
  background: #f6f7fb;
  color: var(--navy);
  font-family: 'Open Sans', sans-serif;
}
.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
button, input, select { font: inherit; }
button { cursor: pointer; }
button:focus-visible, a:focus-visible { outline: 3px solid var(--orange); outline-offset: 4px; }

/* Un bandeau compact laisse la recherche et les offres au premier plan. */
.annonces-hero { position: relative; isolation: isolate; overflow: hidden; background: linear-gradient(115deg, #040a5d, #192bc2); color: #fff; }
.hero-photo { position: absolute; z-index: -1; inset: 0 0 0 42%; background: linear-gradient(90deg, #0b157e 0%, rgba(4,10,93,.2) 65%), url('/images/Gemini_Generated_Image_xyh87qxyh87qxyh8.png') center 42% / cover; opacity: .65; }
.hero-inner { display: flex; justify-content: space-between; align-items: center; gap: 40px; min-height: 350px; padding-top: 56px; padding-bottom: 86px; }
.hero-copy { max-width: 620px; }
.hero-badge { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #ffcb91; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.hero-badge > span { width: 22px; height: 2px; background: #ffb45e; }
.hero-copy h1 { margin: 0 0 16px; color: #fff; font-size: clamp(36px, 4.5vw, 60px); font-weight: 700; line-height: 1.12; letter-spacing: -1.5px; text-transform: none; }
.hero-copy p { max-width: 510px; margin: 0; color: #e2e8ff; font-size: 17px; line-height: 1.75; }
.hero-stat { display: flex; align-items: center; gap: 18px; padding: 24px 30px; border: 1px solid rgba(255,255,255,.3); border-radius: 20px; background: rgba(4,10,93,.65); }
.hero-stat > i { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,.1); color: #ffc078; font-size: 21px; }
.hero-stat strong { display: block; color: #fff; font-size: 36px; line-height: 1.1; }
.hero-stat span { color: #e2e8ff; font-size: 13px; }

/* Recherche sur fond clair, avec des libellés toujours visibles. */
.search-wrap { position: sticky; top: var(--site-bar-h, 72px); z-index: 20; margin-top: -38px; }
.search-panel { padding: 22px; border: 1px solid var(--border); border-radius: 20px; background: #fff; box-shadow: 0 12px 32px rgba(4,10,93,.08); }
.search-primary { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; align-items: end; gap: 18px; }
.search-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; margin: 0; }
.field-label { color: #39425f; font-size: 11px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
.field-control { position: relative; display: flex; align-items: center; gap: 12px; width: 100%; height: 48px; min-width: 0; padding: 0 14px; border: 1px solid #e0e5f0; border-radius: 10px; background: #f8f9fd; text-align: left; }
.field-control:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(25,43,194,.1); }
.field-control > i:first-child { flex-shrink: 0; color: #707b9a; font-size: 14px; }
.field-control input, .field-control select { width: 100%; min-width: 0; height: 100%; padding: 0; outline: none; border: none; background: transparent; color: var(--navy); font-size: 13px; }
.field-control input::placeholder { color: #737d94; }
.field-control select { appearance: none; cursor: pointer; padding-right: 18px; }
.field-control select option { background: #fff; color: var(--navy); }
.select-caret { position: absolute; right: 14px; color: #78819a; font-size: 10px; pointer-events: none; }
.field-control--select { padding-right: 12px; }
.search-submit { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 12px 26px; border: none; border-radius: 10px; background: var(--orange); color: #040a5d; font-size: 13px; font-weight: 700; transition: background .2s, transform .2s; }
.search-submit:hover { background: #ffad50; }
.search-advanced { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 18px; padding-top: 18px; border-top: 1px solid #edf0f6; }
.mobile-filter-toggle { display: none; }
.study-filter { position: relative; }
.study-toggle { padding-right: 30px; color: var(--navy); font-size: 13px; }
.study-toggle > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.study-dropdown { position: absolute; z-index: 5; top: calc(100% + 8px); right: 0; left: 0; max-height: 280px; overflow: auto; padding: 8px; background: #fff; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 14px 32px rgba(4,10,93,.12); }
.study-option { display: flex; align-items: center; gap: 10px; padding: 10px 8px; border-radius: 7px; color: #39425f; font-size: 13px; cursor: pointer; }
.study-option:hover { background: #f0f2fc; }
.study-option input { width: 16px; height: 16px; accent-color: var(--blue); }
.study-clear { width: 100%; padding: 10px; border: none; border-top: 1px solid var(--border); background: #fff; color: var(--blue); font-size: 12px; font-weight: 700; text-align: left; }

.annonces-body { padding: 48px 0 88px; scroll-margin-top: calc(var(--site-bar-h, 72px) + 250px); }
.results-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 28px; }
.section-eyebrow { color: #727b94; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
.results-header h2 { margin: 6px 0 8px; color: var(--navy); font-size: 28px; font-weight: 700; line-height: 1.3; text-transform: none; letter-spacing: -.6px; }
.results-count { min-height: 22px; margin: 0; color: var(--muted); font-size: 13px; }
.results-count strong { color: var(--blue); }
.btn-reset { display: inline-flex; align-items: center; gap: 8px; min-height: 42px; padding: 9px 14px; border: 1px solid var(--border); border-radius: 10px; background: #fff; color: #535e79; font-size: 12px; font-weight: 600; }
.btn-reset:hover { color: var(--blue); border-color: #c1c9ed; }
.active-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.filter-chip { display: inline-flex; align-items: center; gap: 10px; max-width: 100%; padding: 8px 12px; border: 1px solid #dce1fb; border-radius: 8px; background: #eef0ff; color: #192bc2; font-size: 12px; overflow-wrap: anywhere; text-align: left; }
.filter-chip > i { flex-shrink: 0; font-size: 11px; }

/* Une hiérarchie commune à toutes les offres, avec un accès favori indépendant. */
.offres-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.offre-card { position: relative; display: flex; flex-direction: column; gap: 18px; min-width: 0; padding: 26px; border: 1px solid var(--border); border-radius: 18px; background: #fff; box-shadow: 0 4px 14px rgba(4,10,93,.025); transition: border-color .2s, box-shadow .2s, transform .2s; }
.offre-card:hover { transform: translateY(-4px); border-color: #b6bfed; box-shadow: 0 14px 30px rgba(4,10,93,.08); }
.offre-card:focus-within { border-color: var(--blue); }
.offre-head { display: flex; align-items: center; gap: 12px; min-width: 0; }
.offre-logo { display: grid; place-items: center; flex: 0 0 48px; height: 48px; overflow: hidden; border: 1px solid #e9ecf5; border-radius: 13px; background: #f4f5fc; color: var(--blue); font-size: 21px; font-weight: 700; }
.offre-company-info { display: flex; flex: 1; flex-direction: column; gap: 5px; min-width: 0; }
.offre-company { overflow: hidden; color: #414b67; font-size: 12px; font-weight: 700; white-space: nowrap; text-overflow: ellipsis; }
.offre-location { display: flex; align-items: flex-start; gap: 5px; color: var(--muted); font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
.offre-location i { margin-top: 2px; }
.btn-favori { position: relative; z-index: 2; display: grid; place-items: center; flex: 0 0 38px; height: 38px; padding: 0; border: 1px solid #e8ebf4; border-radius: 50%; background: #fff; color: #727c94; font-size: 16px; transition: color .2s, background .2s; }
.btn-favori:hover, .btn-favori--active { border-color: #f5d1db; background: #fff2f5; color: #bd2853; }
.offre-heading { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.badge-new { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 6px; background: #e9f7ef; color: #217047; font-size: 10px; font-weight: 700; }
.badge-new > span { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.offre-title { margin: 0; color: var(--navy); font-size: 21px; font-weight: 700; line-height: 1.35; letter-spacing: -.35px; text-transform: none; overflow-wrap: anywhere; }
.offre-title a { color: inherit; text-decoration: none; }
.offre-title a::after { position: absolute; inset: 0; content: ''; border-radius: 18px; }
.offre-title a:focus-visible { outline: none; }
.offre-title a:focus-visible::after { outline: 3px solid var(--orange); outline-offset: 3px; }
.offre-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.tag { max-width: 100%; padding: 5px 9px; border-radius: 6px; background: #f4f5fa; color: #606b84; font-size: 10px; font-weight: 600; overflow-wrap: anywhere; }
.tag--contract { background: #eef0ff; color: #293bb2; }
.offre-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 0; color: var(--muted); font-size: 12px; line-height: 1.85; }
.offre-salary { display: flex; align-items: center; gap: 8px; color: var(--navy); font-size: 13px; font-weight: 700; overflow-wrap: anywhere; }
.offre-salary i { color: #b25a00; }
.offre-deadline { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 10px; }
.offre-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 18px; border-top: 1px solid #edf0f6; }
.offre-date { display: flex; align-items: center; gap: 5px; color: #747d94; font-size: 10px; }
.offre-action { display: flex; align-items: center; gap: 9px; color: var(--blue); font-size: 11px; font-weight: 700; white-space: nowrap; }
.offre-action i { display: grid; place-items: center; width: 27px; height: 27px; border-radius: 50%; background: #eef0ff; font-size: 11px; transition: background .2s, color .2s; }
.offre-card:hover .offre-action i { background: var(--blue); color: #fff; }

.offre-card--skeleton { min-height: 330px; pointer-events: none; }
.skeleton-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.sk-logo, .sk-line { background: #ecedf5; animation: shimmer 1.4s ease-in-out infinite; }
.sk-logo { flex: 0 0 48px; height: 48px; border-radius: 13px; }
.sk-line { width: 100%; height: 12px; border-radius: 4px; }
.sk-line--short { width: 55%; }
.sk-line--title { width: 85%; height: 22px; }
@keyframes shimmer { 50% { opacity: .45; } }
.annonces-empty { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 64px 24px; border: 1px dashed #d6dced; border-radius: 20px; background: #fff; text-align: center; }
.empty-icon { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 22px; background: #eef0ff; color: var(--blue); font-size: 25px; }
.annonces-empty h3 { margin: 0; color: var(--navy); font-size: 20px; line-height: 1.5; text-transform: none; }
.annonces-empty p { max-width: 450px; margin: 0; color: var(--muted); font-size: 14px; }
.annonces-pagination { display: flex; justify-content: center; gap: 7px; margin-top: 40px; flex-wrap: wrap; }
.page-btn, .page-ellipsis { display: grid; place-items: center; width: 40px; height: 40px; font-size: 13px; }
.page-btn { border: 1px solid var(--border); border-radius: 10px; background: #fff; color: var(--navy); font-weight: 600; }
.page-btn:hover:not(:disabled) { border-color: var(--blue); background: #eef0ff; }
.page-btn--active, .page-btn--active:hover:not(:disabled) { border-color: var(--blue); background: var(--blue); color: #fff; }
.page-btn:disabled { opacity: .4; cursor: default; }
.page-ellipsis { width: 20px; color: var(--muted); }

@media (max-width: 1050px) {
  .offres-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hero-copy { max-width: 540px; }
  .hero-stat { padding: 20px; gap: 12px; }
}
@media (max-width: 700px) {
  .container { padding-right: 20px; padding-left: 20px; }
  .hero-inner { gap: 24px; min-height: 300px; padding-top: 40px; padding-bottom: 70px; }
  .hero-copy h1 { font-size: 38px; }
  .hero-copy p { font-size: 15px; }
  .hero-photo { left: 0; opacity: .3; }
  .hero-stat { display: none; }
  .search-wrap { position: relative; top: auto; margin-top: -30px; z-index: 2; }
  .search-panel { padding: 18px; border-radius: 16px; }
  .search-primary { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .search-submit { width: 100%; }
  .mobile-filter-toggle { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; margin-top: 12px; padding: 10px 0 0; border: none; background: transparent; color: var(--blue); font-size: 12px; font-weight: 700; }
  .mobile-filter-toggle > i:last-child { margin-left: auto; font-size: 10px; transition: transform .2s; }
  .mobile-filter-toggle .rotated { transform: rotate(180deg); }
  .search-advanced { display: none; grid-template-columns: minmax(0, 1fr); margin-top: 12px; }
  .search-advanced.is-open { display: grid; }
  .annonces-body { scroll-margin-top: calc(var(--site-bar-h, 72px) + 16px); padding-top: 36px; padding-bottom: 56px; }
  .results-header { align-items: flex-start; }
  .results-header h2 { font-size: 24px; }
  .btn-reset { padding: 8px 10px; font-size: 10px; }
  .offres-grid { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .offre-card { padding: 24px; }
  .annonces-empty { padding: 40px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
  .offre-card:hover { transform: none; }
}
</style>
