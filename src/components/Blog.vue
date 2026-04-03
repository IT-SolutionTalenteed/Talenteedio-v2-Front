<template>
  <div class="blog-page">
    <PublicNav />

    <!-- ══ HERO ══ -->
    <section class="blog-hero">
      <div class="container">
        <span class="label-white">{{ t('blog.hero.label') }}</span>
        <h1>{{ t('blog.hero.title') }}</h1>
        <p>{{ t('blog.hero.description') }}</p>
      </div>
    </section>

    <!-- ══ TABS CATÉGORIES ══ -->
    <section class="blog-tabs-bar">
      <div class="container">
        <div class="blog-tabs">
          <button
            class="blog-tab"
            :class="{ active: activeCategory === null }"
            @click="selectCategory(null)"
          >{{ t('blog.tabs.all') }}</button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="blog-tab"
            :class="{ active: activeCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >{{ cat.name }}</button>
        </div>
      </div>
    </section>

    <!-- ══ CORPS ══ -->
    <section class="blog-body">
      <div class="container">

        <!-- Skeleton -->
        <div v-if="loading" class="blog-grid">
          <div v-for="n in 9" :key="n" class="blog-card blog-card--skeleton">
            <div class="sk-img"></div>
            <div class="sk-body">
              <div class="sk-line sk-line--sm"></div>
              <div class="sk-line sk-line--lg"></div>
              <div class="sk-line sk-line--md"></div>
              <div class="sk-line sk-line--md"></div>
            </div>
          </div>
        </div>

        <!-- Résultats -->
        <div v-else-if="articles.length" class="blog-grid">
          <article v-for="a in articles" :key="a.id" class="blog-card">

            <!-- Image -->
            <div class="blog-card-img">
              <img v-if="a.image_url" :src="a.image_url" :alt="a.title" />
              <div v-else class="blog-card-img-placeholder">
                <i class="fa-solid fa-newspaper"></i>
              </div>
            </div>

            <!-- Contenu -->
            <div class="blog-card-body">
              <div class="blog-card-meta">
                <span v-if="a.media_categories && a.media_categories.length" class="blog-cat-badge">{{ a.media_categories[0].name }}</span>
                <span class="blog-date">
                  <i class="fa-regular fa-calendar"></i>
                  {{ formatDate(a.created_at) }}
                </span>
              </div>
              <h3 class="blog-card-title">{{ a.title }}</h3>
              <p class="blog-card-excerpt">{{ truncate(stripHtml(a.content), 150) }}</p>
              <router-link :to="`/blog/${a.id}`" class="blog-read-more">
                {{ t('blog.card.readMore') }} <i class="fa-solid fa-arrow-right"></i>
              </router-link>
            </div>

          </article>
        </div>

        <!-- Vide -->
        <div v-else class="blog-empty">
          <i class="fa-solid fa-newspaper"></i>
          <p>{{ t('blog.empty') }}</p>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="blog-pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          ><i class="fa-solid fa-chevron-left"></i></button>

          <template v-for="p in paginationPages" :key="p">
            <span v-if="p === '...'" class="page-ellipsis">…</span>
            <button
              v-else
              class="page-btn"
              :class="{ active: p === currentPage }"
              @click="goToPage(p)"
            >{{ p }}</button>
          </template>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          ><i class="fa-solid fa-chevron-right"></i></button>
        </div>

      </div>
    </section>

  </div>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t, locale } = useI18n()
const apiBase      = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const articles     = ref([])
const categories   = ref([])
const loading      = ref(false)
const currentPage  = ref(1)
const totalPages   = ref(1)
const activeCategory = ref(null)
const perPage      = 9

const load = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, per_page: perPage }
    if (activeCategory.value) params.media_category_id = activeCategory.value

    const res = await axios.get(`${apiBase}/public/articles`, { params })
    articles.value  = res.data.data   || []
    totalPages.value = res.data.last_page || 1
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const extractCategories = () => {
  const map = new Map()
  articles.value.forEach(a => {
    if (a.media_categories) {
      a.media_categories.forEach(c => map.set(c.id, c))
    }
  })
  categories.value = [...map.values()]
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
  const pages = []
  pages.push(1)
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const formatDate = (iso) => {
  if (!iso) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(iso).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str

onMounted(async () => {
  await load()
  extractCategories()
})
</script>

<style scoped>
.blog-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* ── Hero ── */
.blog-hero {
  background: url('/images/Gemini_Generated_Image_2i225i2i225i2i22.png') center/cover no-repeat;
  padding: 0; 
  color: #fff;
  position: relative;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
}
.blog-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}
.blog-hero .container {
  position: relative;
  z-index: 1;
}
.blog-hero h1 { 
  font-size: 56px; 
  font-weight: 800; 
  margin: 12px 0 20px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}
.blog-hero p  { 
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

/* ── Tabs ── */
.blog-tabs-bar { background: #fff; padding: 0; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.blog-tabs {
  display: flex; gap: 0; overflow-x: auto;
  scrollbar-width: none;
}
.blog-tabs::-webkit-scrollbar { display: none; }
.blog-tab {
  flex-shrink: 0; padding: 16px 22px;
  background: none; border: none; border-bottom: 3px solid transparent;
  font-size: 14px; font-weight: 600; color: var(--body-text);
  cursor: pointer; transition: color .15s, border-color .15s;
  white-space: nowrap;
}
.blog-tab:hover { color: var(--blue); }
.blog-tab.active { color: var(--blue); border-bottom-color: var(--blue); }

/* ── Corps ── */
.blog-body { padding: 40px 0 80px; }

/* ── Grid ── */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
@media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) { .blog-grid { grid-template-columns: 1fr; } }

/* ── Card ── */
.blog-card {
  background: #fff; border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  overflow: hidden; display: flex; flex-direction: column;
  border: 1.5px solid transparent;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.blog-card:hover { border-color: var(--blue); box-shadow: 0 8px 24px rgba(0,0,0,.12); transform: translateY(-4px); }

/* Image */
.blog-card-img { width: 100%; height: 200px; overflow: hidden; flex-shrink: 0; }
.blog-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.blog-card:hover .blog-card-img img { transform: scale(1.04); }
.blog-card-img-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #192bc2 0%, #2687e9 100%);
  display: flex; align-items: center; justify-content: center;
}
.blog-card-img-placeholder i { font-size: 40px; color: rgba(255,255,255,.4); }

/* Body */
.blog-card-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }

/* Meta */
.blog-card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.blog-cat-badge {
  background: rgba(38, 135, 233, .1); color: var(--blue);
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  padding: 3px 10px; border-radius: 50px;
}
.blog-date { font-size: 12px; color: var(--body-text); display: flex; align-items: center; gap: 5px; }
.blog-date i { color: var(--blue); font-size: 11px; }

/* Titre */
.blog-card-title {
  font-size: 16px; font-weight: 700; color: var(--navy); margin: 0;
  line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Extrait */
.blog-card-excerpt { font-size: 13px; color: var(--body-text); line-height: 1.6; margin: 0; flex: 1; }

/* Lire la suite */
.blog-read-more {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; color: var(--blue);
  text-decoration: none; margin-top: auto;
  transition: gap .2s;
}
.blog-read-more:hover { gap: 10px; }
.blog-read-more i { font-size: 11px; }

/* ── Pagination ── */
.blog-pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; margin-top: 48px; flex-wrap: wrap;
}
.page-btn {
  min-width: 38px; height: 38px; padding: 0 10px;
  border: 1.5px solid var(--border, #e2e8f0); border-radius: 8px;
  background: #fff; color: var(--navy); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center;
}
.page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); }
.page-btn.active { background: var(--blue); border-color: var(--blue); color: #fff; }
.page-btn:disabled { opacity: .35; cursor: not-allowed; }
.page-ellipsis { font-size: 14px; color: var(--body-text); padding: 0 4px; line-height: 38px; }

/* ── Skeleton ── */
.blog-card--skeleton { pointer-events: none; }
.sk-img { width: 100%; height: 200px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.sk-line { height: 12px; border-radius: 6px; background: #e9ecef; animation: shimmer 1.2s infinite; }
.sk-line--sm  { width: 40%; }
.sk-line--md  { width: 70%; }
.sk-line--lg  { width: 90%; }
@keyframes shimmer { 0%,100% { opacity:1 } 50% { opacity:.4 } }

/* ── Vide ── */
.blog-empty { text-align: center; padding: 80px 0; color: var(--body-text); }
.blog-empty i { font-size: 52px; opacity: .25; margin-bottom: 16px; display: block; }
.blog-empty p { font-size: 15px; }
</style>
