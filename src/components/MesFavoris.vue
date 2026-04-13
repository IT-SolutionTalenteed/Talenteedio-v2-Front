<template>
  <div class="page-wrapper">
    <div class="favoris-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="favoris-hero">
      <div class="container">
        <span class="label-white">{{ t('favorites.mySpace') }}</span>
        <h1><i class="fa-solid fa-heart"></i> {{ t('favorites.title') }}</h1>
        <p>{{ t('favorites.subtitle') }}</p>
      </div>
    </section>

    <!-- ══ CONTENU ══ -->
    <section class="favoris-body">
      <div class="container">

        <!-- Skeleton -->
        <div v-if="loading" class="favoris-grid">
          <div v-for="n in 6" :key="n" class="favori-card favori-card--skeleton">
            <div class="sk-logo"></div>
            <div class="sk-lines">
              <div class="sk-line sk-line--lg"></div>
              <div class="sk-line sk-line--sm"></div>
              <div class="sk-line sk-line--md"></div>
            </div>
          </div>
        </div>

        <!-- Vide -->
        <div v-else-if="!favoris.length" class="favoris-empty">
          <i class="fa-regular fa-heart"></i>
          <h2>{{ t('favorites.emptyTitle') }}</h2>
          <p>{{ t('favorites.emptyDesc') }}</p>
          <router-link to="/annonces" class="btn btn--blue">
            <i class="fa-solid fa-briefcase" style="margin-right:6px;"></i>{{ t('favorites.browseOffers') }}
          </router-link>
        </div>

        <!-- Liste -->
        <template v-else>
          <div class="favoris-bar">
            <span class="favoris-count">
              <strong>{{ favoris.length }}</strong>
              {{ favoris.length > 1 ? t('favorites.savedPlural') : t('favorites.saved') }}
            </span>
          </div>

          <div class="favoris-grid">
            <div v-for="offre in favoris" :key="offre.id" class="favori-card">
              <div class="favori-logo">
                <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                <span v-else class="favori-initial">{{ offre.entreprise?.nom?.charAt(0) || '?' }}</span>
              </div>
              <div class="favori-body">
                <div class="favori-tags">
                  <span v-for="c in offre.job_contracts" :key="c.id" class="tag tag--blue">{{ c.name }}</span>
                  <span v-for="m in offre.job_modes"     :key="m.id" class="tag tag--gray">{{ m.name }}</span>
                </div>
                <h3 class="favori-titre">{{ offre.titre }}</h3>
                <p class="favori-entreprise">{{ offre.entreprise?.nom || t('annonces.card.companyNotSpecified') }}</p>
                <p class="favori-desc">{{ truncate(stripHtml(offre.mission), 110) }}</p>
                <div class="favori-meta">
                  <span v-if="offre.localisation"><i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}</span>
                  <span v-if="offre.date_limite"><i class="fa-solid fa-calendar"></i> {{ formatDate(offre.date_limite) }}</span>
                </div>
              </div>
              <div class="favori-actions">
                <router-link :to="`/annonces/${offre.id}`" class="btn btn--blue btn--sm">
                  {{ t('favorites.viewOffer') }}
                </router-link>
                <button class="btn-remove" :title="t('favorites.remove')" :disabled="removing === offre.id" @click="handleRemove(offre.id)">
                  <i class="fa-solid fa-heart-crack"></i>
                </button>
              </div>
            </div>
          </div>
        </template>

      </div>
    </section>

    </div>

    <!-- ══ FOOTER ══ -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import { useFavoris } from '../composables/useFavoris.js'

const { t, locale } = useI18n()
const { favoris, loadFavoris, removeFavori } = useFavoris()
const loading = ref(false)
const removing = ref(null)

const handleRemove = async (offreId) => {
  removing.value = offreId
  await removeFavori(offreId)
  removing.value = null
}

const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str
const stripHtml = (html) => !html ? '' : html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const formatDate = (str) => {
  if (!str) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(str).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  if (!favoris.value.length) {
    loading.value = true
    await loadFavoris()
    loading.value = false
  }
})
</script>

<style scoped>
.favoris-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* ── Hero ── */
.favoris-hero {
  background: linear-gradient(135deg, #040a5d 0%, #f43f5e 100%);
  padding: 60px 0 50px;
  color: #fff;
}
.favoris-hero h1 { font-size: 34px; font-weight: 800; margin: 8px 0 10px; display: flex; align-items: center; gap: 12px; }
.favoris-hero h1 i { font-size: 28px; }
.favoris-hero p  { font-size: 16px; opacity: .85; }
.label-white {
  display: inline-block; background: rgba(255,255,255,.18); color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  padding: 4px 14px; border-radius: 50px; margin-bottom: 12px;
}

/* ── Body ── */
.favoris-body { padding: 48px 0 80px; }

.favoris-bar { margin-bottom: 20px; }
.favoris-count { font-size: 14px; color: var(--body-text); }
.favoris-count strong { color: var(--navy); font-weight: 700; }

/* ── Grille ── */
.favoris-grid { display: flex; flex-direction: column; gap: 16px; }

.favori-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  padding: 20px 24px;
  display: grid; grid-template-columns: 64px 1fr auto;
  gap: 16px; align-items: center;
  border: 1.5px solid transparent;
  transition: border-color .2s, box-shadow .2s;
}
.favori-card:hover { border-color: #f43f5e; box-shadow: 0 6px 20px rgba(0,0,0,.10); }

/* Logo */
.favori-logo {
  width: 56px; height: 56px; border-radius: 10px;
  background: var(--light-bg, #f5f7fa); overflow: hidden;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.favori-logo img    { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.favori-initial     { font-size: 22px; font-weight: 800; color: var(--blue); }

/* Contenu */
.favori-tags      { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.tag              { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 50px; }
.tag--blue        { background: #e8f0fe; color: var(--blue); }
.tag--gray        { background: #f1f5f9; color: #64748b; }
.favori-titre     { font-size: 16px; font-weight: 700; color: var(--navy); margin: 0 0 3px; }
.favori-entreprise{ font-size: 13px; color: var(--body-text); margin: 0 0 8px; }
.favori-desc      { font-size: 13px; color: var(--body-text); line-height: 1.5; margin: 0 0 10px; }
.favori-meta      { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--body-text); }
.favori-meta i    { color: var(--orange, #f07c00); margin-right: 4px; }

/* Actions */
.favori-actions   { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }

.btn-remove {
  background: none; border: 1.5px solid #fecdd3; border-radius: 8px;
  width: 34px; height: 34px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #f43f5e;
  transition: background .15s, border-color .15s;
}
.btn-remove:hover    { background: #fee2e2; border-color: #f43f5e; }
.btn-remove:disabled { opacity: .5; cursor: wait; }

/* ── Vide ── */
.favoris-empty {
  text-align: center; padding: 80px 0;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.favoris-empty i  { font-size: 64px; color: #f43f5e; opacity: .2; }
.favoris-empty h2 { font-size: 22px; font-weight: 700; color: var(--navy); margin: 0; }
.favoris-empty p  { font-size: 15px; color: var(--body-text); margin: 0; max-width: 340px; }

/* ── Skeleton ── */
.favori-card--skeleton { pointer-events: none; }
.sk-logo   { width: 56px; height: 56px; border-radius: 10px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-lines  { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.sk-line   { height: 12px; border-radius: 6px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-line--lg { width: 60%; } .sk-line--md { width: 40%; } .sk-line--sm { width: 80%; }
@keyframes shimmer { 0%,100% { opacity: 1 } 50% { opacity: .4 } }

@media (max-width: 640px) {
  .favori-card { grid-template-columns: 48px 1fr; }
  .favori-actions { grid-column: 1 / -1; flex-direction: row; justify-content: flex-start; }
}
</style>
