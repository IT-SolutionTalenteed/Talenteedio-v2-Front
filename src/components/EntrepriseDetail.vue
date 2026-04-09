<template>
  <div class="entreprise-detail-page">
    <PublicNav />

    <!-- Loading -->
    <div v-if="loading" class="ed-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ t('entreprises.detail.loading') }}</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="!data" class="ed-loading">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>{{ t('entreprises.detail.notFound') }}</p>
      <router-link to="/entreprises" class="btn btn--blue" style="margin-top:16px;">{{ t('entreprises.detail.backToList') }}</router-link>
    </div>

    <template v-else>
      <!-- ══ HERO ══ -->
      <section class="ed-hero">
        <div class="container">
          <div class="ed-hero-inner">
            <div class="ed-hero-logo">
              <img v-if="entreprise.logo_url" :src="entreprise.logo_url" :alt="entreprise.nom" />
              <span v-else class="ed-hero-initial">{{ entreprise.nom.charAt(0) }}</span>
            </div>
            <div class="ed-hero-info">
              <div class="ed-badges">
                <span v-if="data.participe_evenement" class="badge-participant">
                  <i class="fa-solid fa-star"></i> {{ t('entreprises.detail.participant') }}
                </span>
              </div>
              <h1 class="ed-hero-title">{{ entreprise.nom }}</h1>
              <div class="ed-hero-meta">
                <span v-if="entreprise.activity_sector">
                  <i class="fa-solid fa-industry"></i> {{ entreprise.activity_sector.name }}
                </span>
                <span v-if="entreprise.ville || entreprise.pays">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ [entreprise.ville, entreprise.pays].filter(Boolean).join(', ') }}
                </span>
                <a v-if="entreprise.site_web" :href="entreprise.site_web" target="_blank" rel="noopener" class="ed-hero-link">
                  <i class="fa-solid fa-globe"></i> {{ t('entreprises.detail.website') }}
                </a>
              </div>
            </div>
            <div class="ed-hero-stats">
              <div class="ed-stat">
                <span class="ed-stat-num">{{ offres.length }}</span>
                <span class="ed-stat-label">{{ offres.length !== 1 ? t('entreprises.detail.offers') : t('entreprises.detail.offer') }}</span>
              </div>
              <div class="ed-stat">
                <span class="ed-stat-num">{{ articles.length }}</span>
                <span class="ed-stat-label">{{ articles.length !== 1 ? t('entreprises.detail.articles') : t('entreprises.detail.article') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CORPS ══ -->
      <section class="ed-body">
        <div class="container">
          <div class="ed-layout">

            <!-- ── Colonne principale ── -->
            <div class="ed-main">

              <!-- À propos -->
              <div v-if="entreprise.description" class="ed-block">
                <h2 class="ed-block-title"><i class="fa-solid fa-circle-info"></i> {{ t('entreprises.detail.about') }} {{ entreprise.nom }}</h2>
                <p class="ed-description">{{ entreprise.description }}</p>
              </div>

              <!-- Informations de recrutement -->
              <div v-if="offres.length || allSkills.length || allExperiences.length || allJobModes.length || firstProfilRecherche" class="ed-block">
                <h2 class="ed-block-title"><i class="fa-solid fa-user-tie"></i> {{ t('entreprises.detail.recruitmentInfo') }}</h2>

                <!-- Postes à pourvoir -->
                <div v-if="offres.length" class="ed-recruit-row">
                  <div class="ed-recruit-label-col"><i class="fa-solid fa-briefcase"></i> {{ t('entreprises.detail.openPositions') }}</div>
                  <div class="ed-recruit-value-col">
                    <span v-for="o in offres" :key="o.id" class="tag tag--blue">{{ o.titre }}</span>
                  </div>
                </div>

                <!-- Compétences requises -->
                <div v-if="allSkills.length" class="ed-recruit-row">
                  <div class="ed-recruit-label-col"><i class="fa-solid fa-code"></i> {{ t('entreprises.detail.requiredSkills') }}</div>
                  <div class="ed-recruit-value-col">
                    <span v-for="s in allSkills" :key="s" class="tag tag--gray">{{ s }}</span>
                  </div>
                </div>

                <!-- Expérience requise -->
                <div v-if="allExperiences.length" class="ed-recruit-row">
                  <div class="ed-recruit-label-col"><i class="fa-solid fa-chart-line"></i> {{ t('entreprises.detail.requiredExperience') }}</div>
                  <div class="ed-recruit-value-col">
                    <span v-for="e in allExperiences" :key="e" class="tag tag--orange">{{ e }}</span>
                  </div>
                </div>

                <!-- Heures de travail -->
                <div v-if="allJobModes.length" class="ed-recruit-row">
                  <div class="ed-recruit-label-col"><i class="fa-solid fa-clock"></i> {{ t('entreprises.detail.workModes') }}</div>
                  <div class="ed-recruit-value-col">
                    <span v-for="m in allJobModes" :key="m" class="tag tag--blue">{{ m }}</span>
                  </div>
                </div>

                <!-- Profil recherché -->
                <div v-if="firstProfilRecherche" class="ed-recruit-row ed-recruit-row--full">
                  <div class="ed-recruit-label-col"><i class="fa-solid fa-user-check"></i> {{ t('entreprises.detail.profileSought') }}</div>
                  <div class="ed-recruit-value-col ed-rich" v-html="firstProfilRecherche"></div>
                </div>
              </div>

              <!-- Offres d'emploi -->
              <div v-if="offres.length" class="ed-block">
                <h2 class="ed-block-title">
                  <i class="fa-solid fa-briefcase"></i> {{ t('entreprises.detail.jobOffers') }}
                  <span class="ed-count">{{ offres.length }}</span>
                </h2>
                <div v-if="offres.length" class="ed-offres-list">
                  <router-link v-for="o in offres" :key="o.id" :to="`/annonces/${o.id}`" class="ed-offre-card">
                    <div class="ed-offre-body">
                      <div class="ed-offre-tags">
                        <span v-for="c in o.job_contracts" :key="c.id" class="tag tag--blue">{{ c.name }}</span>
                      </div>
                      <h3 class="ed-offre-title">{{ o.titre }}</h3>
                      <div class="ed-offre-meta">
                        <span v-if="o.localisation"><i class="fa-solid fa-location-dot"></i> {{ o.localisation }}</span>
                        <span v-if="o.date_limite"><i class="fa-solid fa-calendar"></i> {{ t('entreprises.detail.deadline') }} : {{ formatDate(o.date_limite) }}</span>
                      </div>
                    </div>
                    <div class="ed-offre-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                  </router-link>
                </div>
                <p v-else class="ed-empty">{{ t('entreprises.detail.noOffers') }}</p>
              </div>

              <!-- Événements à venir -->
              <div v-if="evenements.length" class="ed-block">
                <h2 class="ed-block-title">
                  <i class="fa-solid fa-calendar-days"></i> {{ t('entreprises.detail.upcomingEventsTitle') }}
                  <span class="ed-count">{{ evenements.length }}</span>
                </h2>
                <div class="ed-events-list">
                  <div v-for="ev in evenements" :key="ev.id" class="ed-event-card">
                    <div class="ed-event-date">
                      <span class="ed-event-day">{{ new Date(ev.date_debut).getDate() }}</span>
                      <span class="ed-event-month">{{ new Date(ev.date_debut).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { month: 'short' }) }}</span>
                    </div>
                    <div class="ed-event-body">
                      <h3 class="ed-event-title">{{ ev.titre }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Articles & Actualités -->
              <div v-if="articles.length" class="ed-block">
                <h2 class="ed-block-title">
                  <i class="fa-solid fa-newspaper"></i> {{ t('entreprises.detail.publishedArticles') }}
                  <span class="ed-count">{{ articles.length }}</span>
                </h2>
                <div class="ed-articles-grid">
                  <router-link v-for="a in articles" :key="a.id" :to="`/blog/${a.id}`" class="ed-article-card">
                    <div class="ed-article-img">
                      <img v-if="a.image_url" :src="a.image_url" :alt="a.title" />
                      <div v-else class="ed-article-placeholder"><i class="fa-solid fa-newspaper"></i></div>
                    </div>
                    <div class="ed-article-body">
                      <span v-if="a.media_categories?.length" class="blog-cat-badge">{{ a.media_categories[0].name }}</span>
                      <h3 class="ed-article-title">{{ a.title }}</h3>
                      <p class="ed-article-date"><i class="fa-regular fa-calendar"></i> {{ formatDate(a.created_at) }}</p>
                    </div>
                  </router-link>
                </div>
              </div>

            </div>

            <!-- ── Sidebar ── -->
            <aside class="ed-sidebar">
              <div v-if="entreprise.activity_sector || entreprise.ville || entreprise.pays || entreprise.site_web" class="ed-side-card">
                <h3 class="ed-side-title">{{ t('entreprises.detail.information') }}</h3>
                <ul class="ed-info-list">
                  <li v-if="entreprise.activity_sector">
                    <i class="fa-solid fa-industry"></i>
                    <div><span class="ed-info-label">{{ t('entreprises.detail.sector') }}</span><span>{{ entreprise.activity_sector.name }}</span></div>
                  </li>
                  <li v-if="entreprise.ville || entreprise.pays">
                    <i class="fa-solid fa-location-dot"></i>
                    <div><span class="ed-info-label">{{ t('entreprises.detail.location') }}</span><span>{{ [entreprise.ville, entreprise.pays].filter(Boolean).join(', ') }}</span></div>
                  </li>
                  <li v-if="entreprise.site_web">
                    <i class="fa-solid fa-globe"></i>
                    <div><span class="ed-info-label">{{ t('entreprises.detail.website') }}</span><a :href="entreprise.site_web" target="_blank" rel="noopener">{{ entreprise.site_web }}</a></div>
                  </li>
                </ul>
              </div>

              <div v-if="entreprise.adresse || entreprise.telephone" class="ed-side-card">
                <h3 class="ed-side-title">{{ t('entreprises.detail.contact') }}</h3>
                <ul class="ed-info-list">
                  <li v-if="entreprise.adresse">
                    <i class="fa-solid fa-map-marker-alt"></i>
                    <div><span class="ed-info-label">{{ t('entreprises.detail.address') }}</span><span>{{ entreprise.adresse }}</span></div>
                  </li>
                  <li v-if="entreprise.telephone">
                    <i class="fa-solid fa-phone"></i>
                    <div><span class="ed-info-label">{{ t('entreprises.detail.phone') }}</span><span>{{ entreprise.telephone }}</span></div>
                  </li>
                </ul>
              </div>

              <div class="ed-side-card ed-side-cta">
                <p>{{ t('entreprises.detail.interestedInCompany') }}</p>
                <router-link to="/register" class="btn btn--blue" style="display:block;text-align:center;">
                  {{ t('entreprises.detail.createAccount') }}
                </router-link>
                <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn btn--outline" style="display:block;text-align:center;margin-top:8px;">
                  {{ t('entreprises.detail.login') }}
                </router-link>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </template>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t, locale } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route   = useRoute()
const data    = ref(null)
const loading = ref(true)

const entreprise = computed(() => data.value?.entreprise)
const offres     = computed(() => data.value?.offres || [])
const articles   = computed(() => data.value?.articles || [])
const evenements = computed(() => data.value?.evenements || [])

const allSkills = computed(() => {
  const set = new Set()
  offres.value.forEach(o => o.skills?.forEach(s => set.add(s.name)))
  return [...set]
})
const allExperiences = computed(() => {
  const set = new Set()
  offres.value.forEach(o => o.experiences?.forEach(e => set.add(e.name)))
  return [...set]
})
const allJobModes = computed(() => {
  const set = new Set()
  offres.value.forEach(o => o.job_modes?.forEach(m => set.add(m.name)))
  return [...set]
})
const firstProfilRecherche = computed(() =>
  offres.value.find(o => o.profil_recherche)?.profil_recherche || null
)

const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/entreprises/${route.params.id}`)
    data.value = res.data
  } catch {
    data.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (str) => {
  if (!str) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(str).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(load)
</script>

<style scoped>
.entreprise-detail-page { min-height: 100vh; }

.ed-loading {
  min-height: 50vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  color: var(--body-text); font-size: 15px;
}
.ed-loading i { font-size: 42px; opacity: .4; }

/* ── Hero ── */
.ed-hero {
  background: linear-gradient(135deg, #192bc2 0%, #2687e9 100%);
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}
.ed-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.ed-hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(242,159,31,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.ed-hero-inner {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 28px; 
  align-items: start;
  position: relative;
  z-index: 1;
}
@media (max-width: 768px) {
  .ed-hero-inner { grid-template-columns: 80px 1fr; }
  .ed-hero-stats { grid-column: 1 / -1; flex-direction: row; }
  .ed-hero { padding: 40px 0; }
}

.ed-hero-logo {
  width: 100px; 
  height: 100px; 
  border-radius: 16px;
  background: #fff; 
  overflow: hidden;
  display: flex; 
  align-items: center; 
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,.25); 
  flex-shrink: 0;
  border: 3px solid rgba(255,255,255,.2);
}
.ed-hero-logo img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.ed-hero-initial  { font-size: 36px; font-weight: 800; color: var(--blue); }

.ed-badges { display: flex; gap: 8px; margin-bottom: 12px; }
.badge-participant {
  background: linear-gradient(135deg, #f49f0a, #ffb52e);
  color: #fff; 
  font-size: 11px; 
  font-weight: 700;
  padding: 5px 14px; 
  border-radius: 50px;
  display: inline-flex; 
  align-items: center; 
  gap: 5px;
  box-shadow: 0 4px 12px rgba(244,159,10,.3);
  border: 1px solid rgba(255,255,255,.3);
}

.ed-hero-title { 
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 38px; 
  font-weight: 900; 
  color: #fff; 
  margin: 0 0 16px;
  text-shadow: 0 2px 12px rgba(0,0,0,.2);
}
.ed-hero-meta  { display: flex; flex-wrap: wrap; gap: 20px; }
.ed-hero-meta span { 
  font-size: 14px; 
  color: rgba(255,255,255,.9); 
  display: flex; 
  align-items: center; 
  gap: 7px;
  font-weight: 500;
}
.ed-hero-meta i { color: rgba(255,255,255,.7); font-size: 15px; }
.ed-hero-link { 
  font-size: 14px; 
  color: rgba(255,255,255,.9); 
  text-decoration: none; 
  display: flex; 
  align-items: center; 
  gap: 7px;
  font-weight: 500;
  transition: color .2s;
}
.ed-hero-link:hover { color: #fff; text-decoration: underline; }

.ed-hero-stats { 
  display: flex; 
  flex-direction: column; 
  gap: 14px; 
  align-items: flex-end; 
}
.ed-stat { 
  text-align: center; 
  background: rgba(255,255,255,.2); 
  border-radius: 12px; 
  padding: 14px 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.25);
  min-width: 120px;
}
.ed-stat-num { 
  display: block; 
  font-size: 28px; 
  font-weight: 800; 
  color: #fff; 
  line-height: 1; 
}
.ed-stat-label { 
  display: block; 
  font-size: 11px; 
  color: rgba(255,255,255,.8); 
  margin-top: 6px;
  font-weight: 600;
}

/* ── Corps ── */
.ed-body { padding: 48px 0 80px; }
.ed-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px; align-items: start;
}
@media (max-width: 900px) {
  .ed-layout { grid-template-columns: 1fr; }
  .ed-sidebar { order: 1; }
}

.ed-block {
  background: #fff; border-radius: 14px;
  padding: 28px; margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.ed-block-title {
  font-size: 17px; font-weight: 700; color: var(--navy);
  margin: 0 0 18px; display: flex; align-items: center; gap: 10px;
}
.ed-block-title i { color: var(--blue); }
.ed-count {
  font-size: 12px; font-weight: 700; color: #fff;
  background: var(--blue); padding: 2px 8px; border-radius: 50px;
  margin-left: auto;
}
.ed-description { font-size: 14px; color: var(--navy); line-height: 1.7; margin: 0; }
.ed-empty { font-size: 14px; color: var(--body-text); font-style: italic; }

/* Recrutement */
.ed-recruit-row {
  display: flex; gap: 16px; padding: 12px 0;
  border-bottom: 1px solid var(--border, #e2e8f0);
  align-items: flex-start;
}
.ed-recruit-row:last-child { border-bottom: none; }
.ed-recruit-row--full { flex-direction: column; gap: 8px; }
.ed-recruit-label-col {
  min-width: 180px; font-size: 13px; font-weight: 700; color: var(--navy);
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.ed-recruit-label-col i { color: var(--blue); width: 14px; }
.ed-recruit-value-col { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
.ed-recruit-empty { font-size: 13px; color: var(--body-text); }
.tag--gray   { background: #f1f5f9; color: var(--navy); }
.tag--orange { background: #fff3e0; color: #e65100; }
.ed-rich { font-size: 13px; color: var(--navy); line-height: 1.7; }
.ed-rich :deep(p) { margin: 0 0 8px; }
.ed-rich :deep(ul) { padding-left: 18px; margin: 4px 0; }

/* Événements */
.ed-events-list { display: flex; flex-direction: column; gap: 12px; }
.ed-event-card {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 18px; border-radius: 10px;
  border: 1.5px solid var(--border, #e2e8f0); background: #fff;
}
.ed-event-date {
  width: 52px; height: 52px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #040a5d, #192bc2);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.ed-event-day   { font-size: 18px; font-weight: 800; color: #fff; line-height: 1; }
.ed-event-month { font-size: 10px; font-weight: 600; color: rgba(255,255,255,.75); text-transform: uppercase; }
.ed-event-body  { flex: 1; }
.ed-event-title { font-size: 14px; font-weight: 700; color: var(--navy); margin: 0 0 4px; }
.ed-event-lieu  { font-size: 12px; color: var(--body-text); margin: 0; display: flex; align-items: center; gap: 5px; }
.ed-event-lieu i { color: var(--orange); }

/* Offres */
.ed-offres-list { display: flex; flex-direction: column; gap: 12px; }
.ed-offre-card {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 20px; border-radius: 10px;
  border: 1.5px solid var(--border, #e2e8f0);
  text-decoration: none; background: #fff;
  transition: border-color .15s, box-shadow .15s;
}
.ed-offre-card:hover { border-color: var(--blue); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.ed-offre-body { flex: 1; }
.ed-offre-tags   { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
.tag { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 50px; }
.tag--blue { background: #e8f0fe; color: var(--blue); }
.ed-offre-title  { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 6px; }
.ed-offre-meta   { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--body-text); }
.ed-offre-meta i { color: var(--orange); margin-right: 3px; }
.ed-offre-arrow  { color: var(--blue); font-size: 13px; flex-shrink: 0; }

/* Articles */
.ed-articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.ed-article-card {
  border-radius: 10px; overflow: hidden;
  border: 1.5px solid var(--border, #e2e8f0);
  text-decoration: none; background: #fff;
  transition: border-color .15s, box-shadow .15s;
  display: flex; flex-direction: column;
}
.ed-article-card:hover { border-color: var(--blue); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.ed-article-img { height: 130px; overflow: hidden; flex-shrink: 0; }
.ed-article-img img { width: 100%; height: 100%; object-fit: cover; }
.ed-article-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #192bc2, #2687e9);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: rgba(255,255,255,.4);
}
.ed-article-body  { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.blog-cat-badge {
  background: rgba(38,135,233,.1); color: var(--blue);
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  padding: 2px 8px; border-radius: 50px; display: inline-block;
}
.ed-article-title { font-size: 14px; font-weight: 700; color: var(--navy); margin: 0; line-height: 1.4; }
.ed-article-date  { font-size: 11px; color: var(--body-text); display: flex; align-items: center; gap: 5px; margin: 0; }
.ed-article-date i { color: var(--blue); }

/* Sidebar */
.ed-sidebar { display: flex; flex-direction: column; gap: 20px; }
.ed-side-card {
  background: #fff; border-radius: 14px;
  padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.ed-side-title { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 16px; }
.ed-info-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.ed-info-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--navy); }
.ed-info-list i  { color: var(--blue); font-size: 13px; margin-top: 2px; flex-shrink: 0; width: 14px; }
.ed-info-list div { display: flex; flex-direction: column; gap: 2px; }
.ed-info-label { font-size: 11px; font-weight: 700; color: var(--body-text); text-transform: uppercase; letter-spacing: .4px; }
.ed-info-list a  { color: var(--blue); text-decoration: none; word-break: break-all; }
.ed-info-list a:hover { text-decoration: underline; }

.ed-side-cta { background: linear-gradient(135deg, #040a5d, #192bc2); }
.ed-side-cta p { font-size: 14px; color: rgba(255,255,255,.85); margin: 0 0 16px; text-align: center; }

.btn--outline {
  border: 1.5px solid rgba(255,255,255,.4);
  background: transparent; color: rgba(255,255,255,.85);
  padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600;
  text-decoration: none; cursor: pointer; transition: background .15s;
}
.btn--outline:hover { background: rgba(255,255,255,.1); }
</style>
