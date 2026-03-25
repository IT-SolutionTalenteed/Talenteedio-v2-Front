<template>
  <div class="entreprises-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="ent-hero">
      <div class="container">
        <span class="label-white">Partenaires</span>
        <h1>Entreprises</h1>
        <p>Découvrez les entreprises qui recrutent sur la plateforme</p>
      </div>
    </section>

    <!-- ══ BARRE DE RECHERCHE ══ -->
    <section class="ent-search-bar">
      <div class="container">
        <div class="ent-search-inner">
          <div class="ent-search-input">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input v-model="search" type="text" placeholder="Rechercher une entreprise..." @input="debouncedSearch" />
          </div>
          <span class="ent-count" v-if="!loading">
            <strong>{{ filtered.length }}</strong> entreprise{{ filtered.length !== 1 ? 's' : '' }}
          </span>
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

            <!-- Badge participant -->
            <span v-if="e.participe_evenement" class="badge-participant">
              <i class="fa-solid fa-star"></i> Participant
            </span>

            <!-- Logo -->
            <div class="ent-logo">
              <img v-if="e.logo_url" :src="e.logo_url" :alt="e.nom" />
              <span v-else class="ent-initials">{{ e.nom.charAt(0).toUpperCase() }}</span>
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
                {{ e.offres_count }} offre{{ e.offres_count !== 1 ? 's' : '' }}
              </span>
              <router-link :to="`/annonces?entreprise_id=${e.id}`" class="btn btn--blue btn--sm">
                Voir les offres
              </router-link>
            </div>

          </router-link>
        </div>

        <!-- Vide -->
        <div v-else class="ent-empty">
          <i class="fa-solid fa-building-circle-xmark"></i>
          <p>Aucune entreprise trouvée.</p>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import PublicNav from './PublicNav.vue'

const apiBase     = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const entreprises = ref([])
const loading     = ref(false)
const search      = ref('')

// Filtre local sur le nom
const filtered = computed(() => {
  if (!search.value.trim()) return entreprises.value
  const q = search.value.toLowerCase()
  return entreprises.value.filter(e =>
    e.nom.toLowerCase().includes(q) ||
    e.activity_sector?.name?.toLowerCase().includes(q) ||
    e.ville?.toLowerCase().includes(q)
  )
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
  background: linear-gradient(135deg, #192bc2 0%, #2687e9 100%);
  padding: 60px 0 50px; color: #fff;
}
.ent-hero h1 { font-size: 36px; font-weight: 800; margin: 8px 0 10px; }
.ent-hero p  { font-size: 16px; opacity: .85; }
.label-white {
  display: inline-block; background: rgba(255,255,255,.18); color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  padding: 4px 14px; border-radius: 50px; margin-bottom: 12px;
}

/* ── Barre recherche ── */
.ent-search-bar { background: #fff; padding: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.ent-search-inner {
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.ent-search-input {
  flex: 1; position: relative; min-width: 240px;
}
.ent-search-input i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--body-text); }
.ent-search-input input {
  width: 100%; padding: 10px 14px 10px 40px;
  border: 1.5px solid var(--border, #e2e8f0); border-radius: 10px;
  font-size: 14px; color: var(--navy); box-sizing: border-box;
  transition: border-color .15s;
}
.ent-search-input input:focus { outline: none; border-color: var(--blue); }
.ent-count { font-size: 13px; color: var(--body-text); white-space: nowrap; }
.ent-count strong { color: var(--navy); font-weight: 700; }

/* ── Corps ── */
.ent-body { padding: 40px 0 80px; }

/* ── Grid ── */
.ent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* ── Card ── */
.ent-card {
  background: #fff; border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  padding: 24px; display: flex; flex-direction: column; gap: 14px;
  border: 1.5px solid transparent; position: relative;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.ent-card:hover { border-color: var(--blue); box-shadow: 0 8px 24px rgba(0,0,0,.12); transform: translateY(-4px); }
.ent-card--link { text-decoration: none; cursor: pointer; }

/* Badge participant */
.badge-participant {
  position: absolute; top: 14px; right: 14px;
  background: linear-gradient(135deg, #f49f0a, #ffb52e);
  color: #fff; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 50px;
  display: flex; align-items: center; gap: 4px;
}

/* Logo */
.ent-logo {
  width: 72px; height: 72px; border-radius: 12px; overflow: hidden;
  background: var(--light-bg, #f5f7fa);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08); flex-shrink: 0;
}
.ent-logo img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
.ent-initials { font-size: 28px; font-weight: 800; color: var(--blue); }

/* Infos */
.ent-name     { font-size: 17px; font-weight: 700; color: var(--navy); margin: 0 0 6px; }
.ent-sector, .ent-location {
  font-size: 13px; color: var(--body-text); margin: 0 0 4px;
  display: flex; align-items: center; gap: 6px;
}
.ent-sector i, .ent-location i { color: var(--blue); font-size: 12px; }
.ent-desc { font-size: 13px; color: var(--body-text); line-height: 1.5; margin: 4px 0 0; }

/* Footer */
.ent-footer {
  margin-top: auto; padding-top: 14px;
  border-top: 1px solid var(--border, #e2e8f0);
  display: flex; align-items: center; justify-content: space-between;
}
.ent-jobs-count { font-size: 13px; font-weight: 600; color: var(--navy); display: flex; align-items: center; gap: 6px; }
.ent-jobs-count i { color: var(--orange); }

/* Skeleton */
.ent-card--skeleton { pointer-events: none; gap: 16px; }
.sk-logo { width: 72px; height: 72px; border-radius: 12px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-lines { flex: 1; display: flex; flex-direction: column; gap: 10px; }
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
