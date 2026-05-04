<template>
  <div class="page-wrapper">
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
            <span class="hero-stat-lbl">{{ t('blog.articles') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CORPS ══ -->
    <section class="blog-body">
      <div class="container">

        <!-- Featured article (premier de la liste) -->
        <router-link
          v-if="!loading && featuredArticle"
          :to="`/blog/${featuredArticle.id}`"
          class="featured-post"
        >
          <div class="featured-image">
            <img v-if="featuredArticle.image_url" :src="featuredArticle.image_url" :alt="featuredArticle.title" />
            <div v-else class="featured-image-placeholder"><i class="fa-solid fa-newspaper"></i></div>
            <span class="featured-tag">{{ t('blog.featured') }}</span>
          </div>
          <div class="featured-content">
            <div class="featured-meta">
              <span v-if="featuredArticle.media_categories?.length">
                <i class="fa-solid fa-folder" style="color:var(--orange)"></i>
                {{ featuredArticle.media_categories[0].name }}
              </span>
              <span><i class="fa-regular fa-calendar" style="color:var(--orange)"></i> {{ formatDate(featuredArticle.created_at) }}</span>
            </div>
            <div v-if="featuredArticle.entreprise || featuredArticle.admin" class="featured-author">
              <i class="fa-solid fa-user-circle"></i>
              <span v-if="featuredArticle.entreprise">{{ featuredArticle.entreprise.nom }}</span>
              <span v-else-if="featuredArticle.admin">{{ featuredArticle.admin.name || 'Admin' }}</span>
            </div>
            <h2 class="featured-title">{{ featuredArticle.title }}</h2>
            <p class="featured-excerpt">{{ truncate(stripHtml(featuredArticle.content), 180) }}</p>
            <span class="featured-link">
              {{ t('blog.card.readMore') }} <i class="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </router-link>

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

        <!-- Layout 2 colonnes -->
        <div class="blog-layout">

          <!-- Zone articles -->
          <div class="blog-posts-area">

            <!-- Skeleton -->
            <div v-if="loading" class="blog-grid">
              <div v-for="n in 6" :key="n" class="blog-card blog-card--skeleton">
                <div class="sk-img"></div>
                <div class="sk-body">
                  <div class="sk-line sk-line--sm"></div>
                  <div class="sk-line sk-line--lg"></div>
                  <div class="sk-line sk-line--md"></div>
                </div>
              </div>
            </div>

            <!-- Résultats -->
            <div v-else-if="restArticles.length" class="blog-grid">
              <router-link
                v-for="a in restArticles"
                :key="a.id"
                :to="`/blog/${a.id}`"
                class="blog-card"
              >
                <div class="blog-card-img">
                  <img v-if="a.image_url" :src="a.image_url" :alt="a.title" />
                  <div v-else class="blog-card-img-placeholder">
                    <i class="fa-regular fa-image"></i>
                  </div>
                </div>
                <div class="blog-card-body">
                  <div class="blog-card-meta">
                    <span v-if="a.media_categories?.length" class="blog-cat-badge">
                      {{ a.media_categories[0].name }}
                    </span>
                    <span class="blog-date">
                      <i class="fa-regular fa-clock"></i> {{ formatDate(a.created_at) }}
                    </span>
                  </div>
                  <div v-if="a.entreprise || a.admin" class="blog-author">
                    <i class="fa-solid fa-user-circle"></i>
                    <span v-if="a.entreprise">{{ a.entreprise.nom }}</span>
                    <span v-else-if="a.admin">{{ a.admin.name || 'Admin' }}</span>
                  </div>
                  <h3 class="blog-card-title">{{ a.title }}</h3>
                  <p class="blog-card-excerpt">{{ truncate(stripHtml(a.content), 120) }}</p>
                  <span class="blog-read-more">
                    {{ t('blog.card.readMore') }} <i class="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
              </router-link>
            </div>

            <!-- Vide -->
            <div v-else-if="!loading" class="blog-empty">
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
                <button v-else class="page-btn" :class="{ 'page-btn--active': p === currentPage }" @click="goToPage(p)">{{ p }}</button>
              </template>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

          </div>

          <!-- Sidebar -->
          <aside class="blog-sidebar">

            <!-- Catégories widget -->
            <div class="sidebar-widget" v-if="categories.length">
              <h3 class="widget-title">
                <i class="fa-solid fa-folder"></i>
                {{ t('blog.sidebar.categories') }}
              </h3>
              <ul class="sidebar-cat-list">
                <li v-for="cat in categories" :key="cat.id" @click="selectCategory(cat.id)" :class="{ 'sidebar-cat--active': activeCategory === cat.id }">
                  <a><i class="fa-solid fa-chevron-right"></i> {{ cat.name }}</a>
                  <span class="cat-count">{{ catCount(cat.id) }}</span>
                </li>
              </ul>
            </div>

            <!-- Articles récents widget -->
            <div class="sidebar-widget" v-if="restArticles.length">
              <h3 class="widget-title">
                <i class="fa-solid fa-fire"></i>
                {{ t('blog.sidebar.recent') }}
              </h3>
              <div class="popular-posts">
                <router-link
                  v-for="a in restArticles.slice(0, 4)"
                  :key="a.id"
                  :to="`/blog/${a.id}`"
                  class="popular-post"
                >
                  <div class="popular-thumb">
                    <img v-if="a.image_url" :src="a.image_url" :alt="a.title" />
                    <i v-else class="fa-solid fa-newspaper"></i>
                  </div>
                  <div class="popular-info">
                    <h4>{{ truncate(a.title, 60) }}</h4>
                    <span class="popular-date">
                      <i class="fa-regular fa-calendar"></i> {{ formatDate(a.created_at) }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </section>

    </div>

    <!-- ══ FOOTER ══ -->
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
const allArticles    = ref([])
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

const loadAllArticlesForCategories = async () => {
  try {
    const res = await axios.get(`${apiBase}/public/articles`, { params: { per_page: 1000 } })
    allArticles.value = res.data.data || []
    extractCategories()
  } catch (e) {
    console.error('Erreur lors du chargement des articles pour catégories:', e)
  }
}

const extractCategories = () => {
  const map = new Map()
  allArticles.value.forEach(a => {
    a.media_categories?.forEach(c => map.set(c.id, c))
  })
  categories.value = [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  nextTick(updateArrows)
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

const selectCategory = (id) => {
  activeCategory.value = id
  currentPage.value = 1
  load()
}

const goToPage = (p) => {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  load()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const featuredArticle = computed(() => articles.value[0] || null)
const restArticles    = computed(() => articles.value.slice(1))

const catCount = (catId) => {
  return allArticles.value.filter(a => 
    a.media_categories?.some(c => c.id === catId)
  ).length
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
  await Promise.all([
    loadAllArticlesForCategories(),
    load()
  ])
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');

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
  font-family: 'Sarun Pro', sans-serif;
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
  font-family: 'Sarun Pro', sans-serif;
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
  background: #fff;
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

/* ════════════════════════════════
   FEATURED POST
════════════════════════════════ */
.featured-post {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,35,90,.10);
  border: 1.5px solid var(--border);
  margin-bottom: 32px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow .2s, transform .2s;
}
.featured-post:hover {
  box-shadow: 0 16px 48px rgba(0,35,90,.16);
  transform: translateY(-3px);
}

.featured-image {
  position: relative;
  min-height: 280px;
  max-height: 280px;
  background: linear-gradient(135deg, #00235a, #1a3a8a);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.featured-image img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .4s;
}
.featured-post:hover .featured-image img { transform: scale(1.04); }
.featured-image-placeholder { font-size: 64px; color: rgba(255,255,255,.3); }

.featured-tag {
  position: absolute; top: 18px; left: 18px;
  background: var(--orange); color: #fff;
  font-size: 11px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  padding: 5px 14px; border-radius: 50px;
}

.featured-content {
  padding: 36px 40px;
  display: flex; flex-direction: column; justify-content: center; gap: 14px;
}

.featured-meta {
  display: flex; align-items: center; gap: 16px;
  font-size: 13px; color: #6b7280;
}
.featured-meta i { margin-right: 4px; }

.featured-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--blue);
  padding: 6px 12px;
  background: rgba(58,155,255,0.08);
  border-radius: 50px;
  width: fit-content;
}
.featured-author i {
  font-size: 14px;
}

.featured-title {
  font-family: 'Sarun Pro', sans-serif;
  font-size: clamp(20px, 2.2vw, 28px);
  font-weight: 800;
  color: var(--navy);
  margin: 0;
  line-height: 1.25;
}

.featured-excerpt {
  font-size: 14px; color: #6b7280;
  line-height: 1.7; margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-link {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700;
  color: var(--orange);
  transition: gap .2s;
}
.featured-post:hover .featured-link { gap: 12px; }

/* ════════════════════════════════
   LAYOUT 2 COLONNES
════════════════════════════════ */
.blog-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;
}

/* ── Grid articles ── */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 600px) { .blog-grid { grid-template-columns: 1fr; } }

/* ════════════════════════════════
   SIDEBAR
════════════════════════════════ */
.blog-sidebar {
  display: flex; 
  flex-direction: column; 
  gap: 24px;
  position: sticky;
  top: 90px;
  align-self: flex-start;
}

.sidebar-widget {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid var(--border);
  padding: 22px;
}

.widget-title {
  font-size: 15px; font-weight: 800;
  color: var(--navy);
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border);
  display: flex; align-items: center; gap: 8px;
}
.widget-title i { color: var(--orange); }

/* Catégories */
.sidebar-cat-list {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 6px;
}
.sidebar-cat-list li {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 12px; border-radius: 10px;
  background: var(--light-bg); cursor: pointer;
  transition: background .15s;
}
.sidebar-cat-list li:hover,
.sidebar-cat--active { background: rgba(0,35,90,.08) !important; }
.sidebar-cat-list a {
  font-size: 13.5px; font-weight: 600; color: var(--navy);
  display: flex; align-items: center; gap: 8px;
  text-decoration: none;
}
.sidebar-cat-list a i { color: var(--orange); font-size: 11px; }
.cat-count {
  font-size: 11px; font-weight: 700; color: #6b7280;
  background: #fff; padding: 2px 9px; border-radius: 50px;
  border: 1px solid var(--border);
}

/* Articles récents */
.popular-posts { display: flex; flex-direction: column; gap: 14px; }
.popular-post {
  display: flex; gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  text-decoration: none; color: inherit;
  transition: opacity .15s;
}
.popular-post:last-child { padding-bottom: 0; border-bottom: none; }
.popular-post:hover { opacity: .8; }

.popular-thumb {
  width: 62px; height: 62px; border-radius: 10px;
  background: linear-gradient(135deg, #00235a, #1a3a8a);
  flex-shrink: 0; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.popular-thumb img { width: 100%; height: 100%; object-fit: cover; }
.popular-thumb i { font-size: 22px; color: rgba(255,255,255,.35); }

.popular-info { flex: 1; min-width: 0; }
.popular-info h4 {
  font-size: 13px; font-weight: 700; color: var(--navy);
  margin: 0 0 5px; line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.popular-date {
  font-size: 11px; color: #9ca3af;
  display: flex; align-items: center; gap: 4px;
}
.popular-date i { color: var(--orange); }

/* Responsive layout */
@media (max-width: 1024px) {
  .blog-layout { grid-template-columns: 1fr; }
  .blog-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
  .sidebar-widget { flex: 1; min-width: 260px; }
  .blog-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .featured-post { grid-template-columns: 1fr; }
  .featured-image { min-height: 180px; max-height: 180px; }
  .featured-content { padding: 24px; }
  .sidebar-widget { min-width: 100%; }
}

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

.blog-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  padding: 4px 10px;
  background: rgba(58,155,255,0.08);
  border-radius: 50px;
  width: fit-content;
}
.blog-author i {
  font-size: 13px;
}

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
