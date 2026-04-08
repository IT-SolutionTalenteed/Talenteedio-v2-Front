<template>
  <div class="blog-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="blog-hero">
      <div class="blog-hero-overlay"></div>
      <div class="container hero-inner">
        <div class="hero-badge">{{ t('blog.hero.label') }}</div>
        <h1 class="hero-title">
          {{ t('blog.hero.title').split(' ').slice(0, -1).join(' ') }}
          <em>{{ t('blog.hero.title').split(' ').slice(-1).join(' ') }}</em>
        </h1>
        <p class="hero-sub">{{ t('blog.hero.description') }}</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-num">{{ totalArticles || '—' }}</span>
            <span class="hero-stat-lbl">articles</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CORPS ══ -->
    <section class="blog-body">
      <div class="container">

        <!-- Tabs catégories -->
        <div class="cat-tabs-wrap">
          <button class="cat-arrow cat-arrow--left" @click="scrollTabs(-200)" :class="{ 'cat-arrow--hidden': !canScrollLeft }">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="cat-tabs" ref="tabsRef" @scroll="updateArrows">
            <button
              class="cat-tab"
              :class="{ 'cat-tab--active': activeCategory === null }"
              @click="selectCategory(null)"
            >{{ t('blog.tabs.all') }}</button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="cat-tab"
              :class="{ 'cat-tab--active': activeCategory === cat.id }"
              @click="selectCategory(cat.id)"
            >{{ cat.name }}</button>
          </div>
          <button class="cat-arrow cat-arrow--right" @click="scrollTabs(200)" :class="{ 'cat-arrow--hidden': !canScrollRight }">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="blog-grid">
          <div v-for="n in 9" :key="n" class="blog-card blog-card--skeleton">
            <div class="sk-img"></div>
            <div class="sk-body">
              <div class="sk-line sk-line--sm"></div>
              <div class="sk-line sk-line--lg"></div>
              <div class="sk-line sk-line--md"></div>
            </div>
          </div>
        </div>

        <!-- Résultats -->
        <div v-else-if="articles.length" class="blog-grid">
          <router-link
            v-for="a in articles"
            :key="a.id"
            :to="`/blog/${a.id}`"
            class="blog-card"
          >
            <!-- Image -->
            <div class="blog-card-img">
              <img v-if="a.image_url" :src="a.image_url" :alt="a.title" />
              <div v-else class="blog-card-img-placeholder">
                <i class="fa-regular fa-image"></i>
              </div>
            </div>

            <!-- Contenu -->
            <div class="blog-card-body">
              <div class="blog-card-meta">
                <span v-if="a.media_categories?.length" class="blog-cat-badge">
                  {{ a.media_categories[0].name }}
                </span>
                <span class="blog-date">
                  <i class="fa-regular fa-clock"></i>
                  {{ formatDate(a.created_at) }}
                </span>
              </div>
              <h3 class="blog-card-title">{{ a.title }}</h3>
              <p class="blog-card-excerpt">{{ truncate(stripHtml(a.content), 130) }}</p>
              <span class="blog-read-more">
                {{ t('blog.card.readMore') }} <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </router-link>
        </div>

        <!-- Vide -->
        <div v-else class="blog-empty">
          <div class="empty-icon"><i class="fa-solid fa-newspaper"></i></div>
          <p class="empty-title">{{ t('blog.empty') }}</p>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="blog-pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <template v-for="p in paginationPages" :key="p">
            <span v-if="p === '...'" class="page-ellipsis">…</span>
            <button
              v-else
              class="page-btn"
              :class="{ 'page-btn--active': p === currentPage }"
              @click="goToPage(p)"
            >{{ p }}</button>
          </template>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
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

const { t, locale } = useI18n()
const apiBase        = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const articles       = ref([])
const categories     = ref([])
const loading        = ref(false)
const currentPage    = ref(1)
const totalPages     = ref(1)
const totalArticles  = ref(0)
const activeCategory = ref(null)
const perPage        = 9

const tabsRef        = ref(null)
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

const load = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, per_page: perPage }
    if (activeCategory.value) params.media_category_id = activeCategory.value
    const res = await axios.get(`${apiBase}/public/articles`, { params })
    articles.value     = res.data.data      || []
    totalPages.value   = res.data.last_page || 1
    totalArticles.value = res.data.total    || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const extractCategories = () => {
  const map = new Map()
  articles.value.forEach(a => {
    a.media_categories?.forEach(c => map.set(c.id, c))
  })
  categories.value = [...map.values()]
  nextTick(updateArrows)
}

const selectCategory = (id) => {
  activeCategory.value = id
  currentPage.value = 1
  load().then(extractCategories)
}

const goToPage = (p) => {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  load()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const paginationPages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

const stripHtml  = (html) => !html ? '' : html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const truncate   = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str

onMounted(async () => {
  await load()
  extractCategories()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap');

:root {
  --orange: #f29f1f;
  --blue:   #3a9bff;
  --navy:   #00235a;
  --light-bg: #f5f7fc;
  --border:   #e0e4ef;
  --shadow-lg: 0 8px 40px rgba(0,0,0,.18);
}

.blog-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Open Sans', sans-serif;
}

/* ════════════════════════════════
   HERO
════════════════════════════════ */
.blog-hero {
  background: url('/images/Gemini_Generated_Image_2i225i2i225i2i22.png') center/cover no-repeat;
  position: relative;
  overflow: hidden;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.blog-hero-overlay {
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
.hero-title em { color: var(--orange); font-style: normal; }

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
  font-size: 36px; font-weight: 800;
  color: #fff; line-height: 1;
  text-shadow: 0 2px 10px rgba(0,0,0,.2);
}
.hero-stat-lbl {
  font-size: 12px; color: rgba(255,255,255,.7);
  text-transform: uppercase; letter-spacing: .8px;
}

/* ════════════════════════════════
   CORPS
════════════════════════════════ */
.blog-body {
  background: var(--light-bg);
  padding: 32px 0 80px;
}

/* ── Tabs catégories ── */
.cat-tabs-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 28px;
}

.cat-arrow {
  flex-shrink: 0;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: #fff;
  color: var(--navy);
  font-size: 11px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.cat-arrow:hover { border-color: var(--blue); color: var(--blue); }
.cat-arrow--hidden { opacity: 0; pointer-events: none; }

.cat-tabs {
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.cat-tabs::-webkit-scrollbar { display: none; }

.cat-tab {
  flex-shrink: 0;
  padding: 6px 16px;
  border-radius: 50px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-size: 13px; font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
  font-family: 'Open Sans', sans-serif;
}
.cat-tab:hover { border-color: var(--blue); color: var(--blue); }
.cat-tab--active { background: var(--navy); border-color: var(--navy); color: #fff; }

/* ── Grid ── */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .blog-grid { grid-template-columns: 1fr; } }

/* ── Card ── */
.blog-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.blog-card:hover {
  border-color: var(--blue);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

/* Image */
.blog-card-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
}
.blog-card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .35s;
}
.blog-card:hover .blog-card-img img { transform: scale(1.04); }

.blog-card-img-placeholder {
  width: 100%; height: 100%;
  background: var(--light-bg);
  border-bottom: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.blog-card-img-placeholder i {
  font-size: 36px;
  color: #d1d5db;
}

/* Corps */
.blog-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

/* Meta */
.blog-card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.blog-cat-badge {
  background: rgba(58,155,255,.10);
  color: var(--blue);
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .5px;
  padding: 3px 10px; border-radius: 50px;
  border: 1px solid rgba(58,155,255,.2);
}

.blog-date {
  font-size: 12px; color: #9ca3af;
  display: flex; align-items: center; gap: 5px;
}
.blog-date i { font-size: 11px; }

/* Titre */
.blog-card-title {
  font-size: 15px; font-weight: 700;
  color: var(--navy); margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Extrait */
.blog-card-excerpt {
  font-size: 13px; color: #6b7280;
  line-height: 1.6; margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Lire la suite */
.blog-read-more {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; color: var(--blue);
  margin-top: auto;
  transition: gap .2s;
}
.blog-card:hover .blog-read-more { gap: 10px; }
.blog-read-more i { font-size: 11px; }

/* ── Pagination ── */
.blog-pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; margin-top: 48px; flex-wrap: wrap;
}
.page-btn {
  min-width: 38px; height: 38px; padding: 0 10px;
  border: 1.5px solid var(--border); border-radius: 8px;
  background: #fff; color: var(--navy);
  font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Open Sans', sans-serif;
}
.page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); }
.page-btn--active { background: var(--blue); border-color: var(--blue); color: #fff; }
.page-btn:disabled { opacity: .35; cursor: not-allowed; }
.page-ellipsis { font-size: 14px; color: #9ca3af; padding: 0 4px; line-height: 38px; }

/* ── Skeleton ── */
.blog-card--skeleton { pointer-events: none; }
.sk-img {
  width: 100%; height: 200px;
  background: linear-gradient(90deg, #e9ecef 25%, #f0f0f0 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.sk-line {
  height: 12px; border-radius: 6px;
  background: linear-gradient(90deg, #e9ecef 25%, #f0f0f0 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-line--sm { width: 35%; }
.sk-line--md { width: 65%; }
.sk-line--lg { width: 90%; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Vide ── */
.blog-empty { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 52px; color: #d1d5db; margin-bottom: 16px; }
.empty-title { font-size: 16px; color: #6b7280; }

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
