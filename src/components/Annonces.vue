<template>
  <div class="annonces-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="annonces-hero">
      <div class="container">
        <span class="label-white">{{ t('annonces.hero.label') }}</span>
        <h1>{{ t('annonces.hero.title') }}</h1>
        <p>{{ t('annonces.hero.description') }}</p>
      </div>
    </section>

    <!-- ══ CONTENU ══ -->
    <section class="annonces-body">
      <div class="container">
        <div class="annonces-layout">

          <!-- ── Sidebar filtres ── -->
          <aside class="annonces-sidebar">
            <div class="filter-card">
              <h3 class="filter-title"><i class="fa-solid fa-sliders"></i> {{ t('annonces.filters.title') }}</h3>

              <!-- Keywords -->
              <div class="filter-group">
                <label class="filter-label">{{ t('annonces.filters.keywords') }}</label>
                <div class="filter-input-wrap">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input v-model="filters.search" type="text" :placeholder="t('annonces.filters.keywordsPlaceholder')" @input="debouncedSearch" />
                </div>
              </div>

              <!-- Localisation -->
              <div class="filter-group">
                <label class="filter-label">{{ t('annonces.filters.location') }}</label>
                <div class="filter-input-wrap">
                  <i class="fa-solid fa-location-dot"></i>
                  <input v-model="filters.localisation" type="text" :placeholder="t('annonces.filters.locationPlaceholder')" @input="debouncedSearch" />
                </div>
              </div>

              <!-- Type de contrat -->
              <div class="filter-group">
                <label class="filter-label">{{ t('annonces.filters.jobType') }}</label>
                <div class="filter-checkboxes">
                  <label v-for="c in referentiels.job_contracts" :key="c.id" class="filter-check">
                    <input type="checkbox" :value="c.id" v-model="filters.job_contract_ids" @change="applyFilters" />
                    <span>{{ c.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Date de publication -->
              <div class="filter-group">
                <label class="filter-label">{{ t('annonces.filters.publicationDate') }}</label>
                <div class="filter-radios">
                  <label v-for="d in dateRanges" :key="d.value" class="filter-radio">
                    <input type="radio" :value="d.value" v-model="filters.date_range" @change="applyFilters" />
                    <span>{{ d.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Niveau d'expérience -->
              <div class="filter-group">
                <label class="filter-label">{{ t('annonces.filters.studyLevel') }}</label>
                <div class="filter-checkboxes">
                  <label v-for="s in referentiels.study_levels" :key="s.id" class="filter-check">
                    <input type="checkbox" :value="s.id" v-model="filters.study_level_ids" @change="applyFilters" />
                    <span>{{ s.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Reset -->
              <button class="btn-reset" @click="resetFilters">
                <i class="fa-solid fa-rotate-left"></i> {{ t('annonces.filters.reset') }}
              </button>
            </div>
          </aside>

          <!-- ── Liste offres ── -->
          <div class="annonces-list">

            <!-- Barre résultats -->
            <div class="annonces-bar">
              <span class="annonces-count" v-if="!loading">
                <strong>{{ pagination.total }}</strong> {{ pagination.total !== 1 ? t('annonces.results.countPlural') : t('annonces.results.count') }} {{ pagination.total !== 1 ? t('annonces.results.foundPlural') : t('annonces.results.found') }}
              </span>
              <span class="annonces-count" v-else>{{ t('annonces.results.loading') }}</span>
            </div>

            <!-- Skeleton loader -->
            <div v-if="loading" class="offres-grid">
              <div v-for="n in 8" :key="n" class="offre-card offre-card--skeleton">
                <div class="sk-visual"></div>
                <div class="sk-lines">
                  <div class="sk-line sk-line--lg"></div>
                  <div class="sk-line sk-line--sm"></div>
                  <div class="sk-line sk-line--md"></div>
                </div>
              </div>
            </div>

            <!-- Résultats -->
            <div v-else-if="offres.length" class="offres-grid">
              <router-link v-for="offre in offres" :key="offre.id" :to="`/annonces/${offre.id}`" class="offre-card offre-card--link">
                <!-- Visuel gauche : image de fond + logo -->
                <div class="offre-visual">
                  <div
                    class="offre-bg"
                    :style="offre.image_url ? `background-image: url('${offre.image_url}')` : ''"
                    :class="{ 'offre-bg--default': !offre.image_url }"
                  ></div>
                  <div class="offre-logo">
                    <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                    <span v-else class="offre-logo-initial">
                      {{ offre.entreprise ? offre.entreprise.nom.charAt(0) : '?' }}
                    </span>
                  </div>
                </div>
                <!-- Contenu -->
                <div class="offre-body">
                  <div class="offre-tags">
                    <span v-for="c in offre.job_contracts" :key="c.id" class="tag tag--blue">{{ c.name }}</span>
                  </div>
                  <h3 class="offre-title">{{ offre.titre }}</h3>
                  <p class="offre-entreprise">{{ offre.entreprise?.nom || t('annonces.card.companyNotSpecified') }}</p>
                  <p class="offre-desc">{{ truncate(stripHtml(offre.mission), 110) }}</p>
                  <div class="offre-meta">
                    <span v-if="offre.localisation">
                      <i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}
                    </span>
                    <span v-if="offre.date_limite">
                      <i class="fa-solid fa-calendar"></i> {{ formatDate(offre.date_limite) }}
                    </span>
                  </div>
                </div>
                <!-- Action -->
                <div class="offre-action">
                  <button
                    class="btn-favori"
                    :class="{ 'btn-favori--active': isFavoriId(offre.id) }"
                    :title="isFavoriId(offre.id) ? t('annonces.card.removeFromFavorites') : t('annonces.card.addToFavorites')"
                    @click.stop.prevent="toggleFavori(offre.id)"
                  >
                    <i :class="isFavoriId(offre.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                  </button>
                  <span class="btn btn--blue btn--sm">{{ t('annonces.card.viewOffer') }}</span>
                </div>
              </router-link>
            </div>

            <!-- Vide -->
            <div v-else class="annonces-empty">
              <i class="fa-solid fa-folder-open"></i>
              <p>{{ t('annonces.empty.title') }}</p>
              <button class="btn-reset" @click="resetFilters">{{ t('annonces.empty.action') }}</button>
            </div>

            <!-- Pagination -->
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
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import { useFavoris } from '../composables/useFavoris.js'

const { t, locale } = useI18n()
const apiBase    = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const offres       = ref([])
const referentiels = ref({ job_contracts: [], study_levels: [], activity_sectors: [] })
const loading      = ref(false)
const pagination   = ref({ current_page: 1, last_page: 1, total: 0 })

const { favoris, loadFavoris, toggleFavori: _toggleFavori, isFavoriId } = useFavoris()

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

// ── Chargement ─────────────────────────────────────────────
const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 8,
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
const paginationPages = () => {
  const total   = pagination.value.last_page
  const current = pagination.value.current_page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

// ── Utilitaires ────────────────────────────────────────────
const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str
const stripHtml = (html) => !html ? '' : html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const formatDate = (str) => {
  if (!str) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(str).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })
}

const toggleFavori = async (offreId) => {
  const offre = offres.value.find(o => o.id === offreId)
  if (offre) await _toggleFavori(offre)
}

onMounted(() => {
  loadPage()
  loadReferentiels()
  loadFavoris()
})
</script>

<style scoped>
.annonces-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* ── Hero ── */
.annonces-hero {
  background: url('/images/Gemini_Generated_Image_xyh87qxyh87qxyh8.png') center/cover no-repeat;
  padding: 0;
  color: #fff;
  position: relative;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
}
.annonces-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}
.annonces-hero .container {
  position: relative;
  z-index: 1;
}
.annonces-hero h1 { 
  font-size: 56px; 
  font-weight: 800; 
  margin: 12px 0 20px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}
.annonces-hero p  { 
  font-size: 22px; 
  opacity: .95;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  max-width: 650px;
  line-height: 1.5;
}
.label-white {
  display: inline-block;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* ── Layout ── */
.annonces-body   { padding: 48px 0 80px; }
.annonces-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
@media (max-width: 900px) { .annonces-layout { grid-template-columns: 1fr; } }

/* ── Sidebar ── */
.annonces-sidebar { position: sticky; top: 90px; }
.filter-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
}
.filter-title {
  font-size: 15px; font-weight: 700; color: var(--navy);
  margin: 0 0 20px; display: flex; align-items: center; gap: 8px;
}
.filter-group  { margin-bottom: 20px; }
.filter-label  { display: block; font-size: 12px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
.filter-input-wrap {
  position: relative;
}
.filter-input-wrap i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--body-text); font-size: 13px; }
.filter-input-wrap input {
  width: 100%; padding: 9px 12px 9px 34px;
  border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 13px; color: var(--navy);
  box-sizing: border-box;
  transition: border-color .15s;
}
.filter-input-wrap input:focus { outline: none; border-color: var(--blue); }
.filter-checkboxes, .filter-radios { display: flex; flex-direction: column; gap: 8px; }
.filter-check, .filter-radio {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--navy); cursor: pointer;
}
.filter-check input, .filter-radio input { accent-color: var(--blue); width: 15px; height: 15px; }
.btn-reset {
  width: 100%; padding: 9px; background: var(--light-bg, #f5f7fa);
  border: 1.5px solid var(--border, #e2e8f0); border-radius: 8px;
  font-size: 13px; font-weight: 600; color: var(--navy); cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background .15s;
  margin-top: 4px;
}
.btn-reset:hover { background: #e2e8f0; }

/* ── Barre résultats ── */
.annonces-bar   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.annonces-count { font-size: 14px; color: var(--body-text); }
.annonces-count strong { color: var(--navy); font-weight: 700; }

/* ── Grille offres ── */
.offres-grid { display: flex; flex-direction: column; gap: 16px; }

.offre-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  padding: 0;
  display: grid; grid-template-columns: 160px 1fr auto;
  gap: 0; align-items: center;
  border: 1.5px solid transparent;
  overflow: hidden;
  transition: border-color .2s, box-shadow .2s, transform .15s;
}
.offre-card:hover { border-color: var(--blue); box-shadow: 0 6px 20px rgba(0,0,0,.10); transform: translateY(-2px); }
.offre-card--link { text-decoration: none; }

/* Visuel gauche */
.offre-visual {
  position: relative;
  width: 160px;
  height: 100%;
  min-height: 110px;
  flex-shrink: 0;
  align-self: stretch;
}
.offre-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  border-radius: 0;
}
.offre-bg--default {
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
}
.offre-logo {
  position: absolute;
  bottom: 10px; left: 10px;
  width: 52px; height: 52px; border-radius: 10px;
  background: #fff; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
  flex-shrink: 0;
}
.offre-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.offre-logo-initial { font-size: 20px; font-weight: 800; color: var(--blue); }

.offre-body { padding: 16px 20px; }
.offre-action { padding: 16px 16px 16px 0; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

.offre-tags   { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.tag { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 50px; }
.tag--blue { background: #e8f0fe; color: var(--blue); }

.offre-title      { font-size: 16px; font-weight: 700; color: var(--navy); margin: 0 0 3px; }
.offre-entreprise { font-size: 13px; color: var(--body-text); margin: 0 0 8px; }
.offre-desc       { font-size: 13px; color: var(--body-text); line-height: 1.5; margin: 0 0 10px; }
.offre-meta       { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--body-text); }
.offre-meta i     { color: var(--orange); margin-right: 4px; }

.offre-action { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

.btn-favori {
  background: none; border: none; cursor: pointer;
  font-size: 18px; color: #cbd5e1; padding: 4px;
  transition: color .2s, transform .15s;
  line-height: 1;
}
.btn-favori:hover        { color: #f43f5e; transform: scale(1.15); }
.btn-favori--active      { color: #f43f5e; }

/* ── Skeleton ── */
.offre-card--skeleton { pointer-events: none; }
.sk-visual { width: 160px; align-self: stretch; min-height: 110px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 16px 20px; }
.sk-line { height: 12px; border-radius: 6px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-line--lg { width: 60%; }
.sk-line--md { width: 40%; }
.sk-line--sm { width: 80%; }
@keyframes shimmer { 0%,100% { opacity: 1 } 50% { opacity: .4 } }

/* ── Vide ── */
.annonces-empty { text-align: center; padding: 60px 0; color: var(--body-text); }
.annonces-empty i { font-size: 48px; opacity: .3; margin-bottom: 16px; display: block; }
.annonces-empty p { font-size: 15px; margin-bottom: 16px; }

/* ── Pagination ── */
.annonces-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 32px; flex-wrap: wrap; }
.page-btn {
  width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid var(--border, #e2e8f0);
  background: #fff; font-size: 13px; font-weight: 600; color: var(--navy);
  cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center;
}
.page-btn:hover:not(:disabled)    { border-color: var(--blue); color: var(--blue); }
.page-btn--active                  { background: var(--blue); border-color: var(--blue); color: #fff; }
.page-btn--dots                    { border: none; background: transparent; cursor: default; }

@media (max-width: 640px) {
  .offre-card { grid-template-columns: 100px 1fr; }
  .offre-visual { min-height: 90px; }
  .offre-action { grid-column: 1 / -1; padding: 0 16px 16px; flex-direction: row; justify-content: flex-end; }
}
</style>
