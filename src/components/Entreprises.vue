<template>
  <div class="entreprises-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="ent-hero">
      <div class="container">
        <span class="label-white">{{ t('entreprises.hero.label') }}</span>
        <h1>{{ t('entreprises.hero.title') }}</h1>
        <p>{{ t('entreprises.hero.description') }}</p>
      </div>
    </section>

    <!-- ══ BARRE DE RECHERCHE ══ -->
    <section class="ent-search-bar">
      <div class="container">
        <div class="ent-search-inner">
          <div class="ent-search-input">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input v-model="search" type="text" :placeholder="t('entreprises.search.placeholder')" @input="debouncedSearch" />
          </div>
          <span class="ent-count" v-if="!loading">
            <strong>{{ filtered.length }}</strong> {{ filtered.length !== 1 ? t('entreprises.results.companies') : t('entreprises.results.company') }}
          </span>
        </div>

        <!-- Filter tabs secteur -->
        <div class="ent-sector-tabs">
          <button
            class="sector-tab"
            :class="{ 'sector-tab--active': activeSector === null }"
            @click="activeSector = null"
          >{{ t('entreprises.filters.all') }}</button>
          <button
            v-for="s in sectors"
            :key="s"
            class="sector-tab"
            :class="{ 'sector-tab--active': activeSector === s }"
            @click="activeSector = s"
          >{{ s }}</button>
        </div>
      </div>
    </section>

    <!-- ══ LISTE ══ -->
    <section class="ent-body">
      <div class="container">

        <!-- Skeleton -->
        <div v-if="loading" class="ent-grid">
          <div v-for="n in 8" :key="n" class="ent-card ent-card--skeleton">
            <div class="sk-logo"></div>
            <div class="sk-lines">
              <div class="sk-line sk-line--lg"></div>
              <div class="sk-line sk-line--sm"></div>
              <div class="sk-line sk-line--md"></div>
            </div>
          </div>
        </div>

        <!-- Résultats -->
        <div v-else-if="filtered.length" class="ent-grid">
          <router-link v-for="e in filtered" :key="e.id" :to="`/entreprises/${e.id}`" class="ent-card ent-card--link">

            <!-- Fond + logo centré -->
            <div class="ent-card-header">
              <div class="ent-logo">
                <img v-if="e.logo_url" :src="e.logo_url" :alt="e.nom" />
                <span v-else class="ent-initials">{{ e.nom.charAt(0).toUpperCase() }}</span>
              </div>
            </div>

            <!-- Infos -->
            <div class="ent-info">
              <h3 class="ent-name">{{ e.nom }}</h3>
              <p v-if="e.activity_sector" class="ent-sector">
                <i class="fa-solid fa-industry"></i> {{ e.activity_sector.name }}
              </p>
              <p v-if="e.ville || e.pays" class="ent-location">
                <i class="fa-solid fa-location-dot"></i>
                {{ [e.ville, e.pays].filter(Boolean).join(', ') }}
              </p>
              <p v-if="e.description" class="ent-desc">{{ truncate(e.description, 90) }}</p>
            </div>

            <!-- Footer carte -->
            <div class="ent-footer">
              <span class="ent-jobs-count">
                <i class="fa-solid fa-briefcase"></i>
                {{ e.offres_count }} {{ e.offres_count !== 1 ? t('entreprises.card.offers') : t('entreprises.card.offer') }}
              </span>
              <router-link :to="`/entreprises/${e.id}`" class="btn btn--blue btn--sm">
                {{ t('entreprises.card.viewCompany') }}
              </router-link>
            </div>

          </router-link>
        </div>

        <!-- Vide -->
        <div v-else class="ent-empty">
          <i class="fa-solid fa-building-circle-xmark"></i>
          <p>{{ t('entreprises.empty') }}</p>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t } = useI18n()
const apiBase     = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const entreprises = ref([])
const loading     = ref(false)
const search      = ref('')
const activeSector = ref(null)

// Secteurs uniques extraits des données
const sectors = computed(() => {
  const set = new Set()
  entreprises.value.forEach(e => {
    if (e.activity_sector?.name) set.add(e.activity_sector.name)
  })
  return [...set].sort()
})

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
  if (activeSector.value) {
    list = list.filter(e => e.activity_sector?.name === activeSector.value)
  }
  return list
})

const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/entreprises`)
    entreprises.value = res.data
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
.entreprises-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* ── Hero ── */
.ent-hero {
  background: url('/images/Gemini_Generated_Image_qnpq2xqnpq2xqnpq.png') center/cover no-repeat;
  padding: 0; color: #fff; position: relative;
  height: 80vh; min-height: 500px; display: flex; align-items: center;
}
.ent-hero::before {
  content: ''; position: absolute; inset: 0;
  background: rgba(0,0,0,.3); z-index: 0;
}
.ent-hero .container { position: relative; z-index: 1; }
.ent-hero h1 { font-size: 56px; font-weight: 800; margin: 12px 0 20px; text-shadow: 0 2px 20px rgba(0,0,0,.3); line-height: 1.2; }
.ent-hero p  { font-size: 22px; opacity: .95; text-shadow: 0 1px 10px rgba(0,0,0,.2); max-width: 650px; line-height: 1.5; }
.label-white {
  display: inline-block; background: rgba(255,255,255,.25); color: #fff;
  font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
  padding: 6px 18px; border-radius: 50px; margin-bottom: 16px;
  backdrop-filter: blur(10px); box-shadow: 0 2px 10px rgba(0,0,0,.15);
}

/* ── Barre recherche + tabs ── */
.ent-search-bar { background: #fff; padding: 20px 0 0; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.ent-search-inner { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.ent-search-input { flex: 1; position: relative; min-width: 240px; }
.ent-search-input i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--body-text); }
.ent-search-input input {
  width: 100%; padding: 10px 14px 10px 40px;
  border: 1.5px solid var(--border, #e2e8f0); border-radius: 10px;
  font-size: 14px; color: var(--navy); box-sizing: border-box; transition: border-color .15s;
}
.ent-search-input input:focus { outline: none; border-color: var(--blue); }
.ent-count { font-size: 13px; color: var(--body-text); white-space: nowrap; }
.ent-count strong { color: var(--navy); font-weight: 700; }

/* Sector tabs */
.ent-sector-tabs {
  display: flex; gap: 6px; flex-wrap: nowrap; overflow-x: auto;
  padding: 14px 0 0; scrollbar-width: none;
}
.ent-sector-tabs::-webkit-scrollbar { display: none; }
.sector-tab {
  flex-shrink: 0; padding: 7px 18px; border-radius: 50px;
  border: 1.5px solid var(--border, #e2e8f0);
  background: transparent; font-size: 13px; font-weight: 600;
  color: var(--body-text); cursor: pointer;
  transition: all .15s; white-space: nowrap;
}
.sector-tab:hover { border-color: var(--blue); color: var(--blue); }
.sector-tab--active { background: var(--blue); border-color: var(--blue); color: #fff; }

/* ── Corps ── */
.ent-body { padding: 40px 0 80px; }

/* ── Grid ── */
.ent-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }

/* ── Card ── */
.ent-card {
  background: #fff; border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  display: flex; flex-direction: column;
  border: 1.5px solid transparent; overflow: hidden;
  transition: border-color .2s, box-shadow .2s, transform .2s;
  padding: 0;
}
.ent-card:hover { border-color: var(--blue); box-shadow: 0 8px 24px rgba(0,0,0,.12); transform: translateY(-4px); }
.ent-card--link { text-decoration: none; cursor: pointer; }

/* Header fond dégradé + logo centré */
.ent-card-header {
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  height: 130px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ent-logo {
  width: 88px; height: 88px; border-radius: 16px; overflow: hidden;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,.18);
}
.ent-logo img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.ent-initials { font-size: 32px; font-weight: 800; color: var(--blue); }

/* Infos */
.ent-info { padding: 18px 20px 0; display: flex; flex-direction: column; gap: 4px; flex: 1; }
.ent-name { font-size: 17px; font-weight: 700; color: var(--navy); margin: 0 0 6px; }
.ent-sector, .ent-location {
  font-size: 13px; color: var(--body-text); margin: 0;
  display: flex; align-items: center; gap: 6px;
}
.ent-sector i { color: var(--blue); font-size: 12px; }
.ent-location i { color: var(--orange); font-size: 12px; }
.ent-desc { font-size: 13px; color: var(--body-text); line-height: 1.5; margin: 4px 0 0; }

/* Footer */
.ent-footer {
  margin-top: auto; padding: 14px 20px 18px;
  border-top: 1px solid var(--border, #e2e8f0);
  display: flex; align-items: center; justify-content: space-between;
}
.ent-jobs-count { font-size: 13px; font-weight: 600; color: var(--navy); display: flex; align-items: center; gap: 6px; }
.ent-jobs-count i { color: var(--orange); }

/* Skeleton */
.ent-card--skeleton { pointer-events: none; }
.sk-logo { width: 100%; height: 130px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-lines { flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 18px 20px; }
.sk-line { height: 12px; border-radius: 6px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-line--lg { width: 55%; }
.sk-line--md { width: 70%; }
.sk-line--sm { width: 40%; }
@keyframes shimmer { 0%,100% { opacity:1 } 50% { opacity:.4 } }

/* Vide */
.ent-empty { text-align: center; padding: 80px 0; color: var(--body-text); }
.ent-empty i { font-size: 52px; opacity: .25; margin-bottom: 16px; display: block; }
.ent-empty p { font-size: 15px; }
</style>
