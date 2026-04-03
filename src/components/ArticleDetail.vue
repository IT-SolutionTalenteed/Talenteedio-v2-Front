<template>
  <div class="article-detail-page">
    <PublicNav />

    <!-- Loading -->
    <div v-if="loading" class="artd-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ t('blog.detail.loading') }}</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="!article" class="artd-loading">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>{{ t('blog.detail.notFound') }}</p>
      <router-link to="/blog" class="btn btn--blue" style="margin-top:16px;">{{ t('blog.detail.backToBlog') }}</router-link>
    </div>

    <template v-else>

      <!-- ══ HERO ══ -->
      <section class="artd-hero" :style="article.image_url ? { backgroundImage: `url('${article.image_url}')` } : {}">
        <div class="artd-hero-overlay"></div>
        <div class="container">
          <div class="artd-hero-content">
            <!-- Catégories -->
            <div class="artd-cats" v-if="article.media_categories?.length">
              <span v-for="cat in article.media_categories" :key="cat.id" class="artd-cat-badge">{{ cat.name }}</span>
            </div>
            <h1 class="artd-title">{{ article.title }}</h1>
            <div class="artd-hero-meta">
              <span><i class="fa-regular fa-calendar"></i> {{ formatDate(article.created_at) }}</span>
              <span v-if="article.entreprise">
                <i class="fa-solid fa-building"></i> {{ article.entreprise.nom }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CORPS ══ -->
      <section class="artd-body">
        <div class="container">
          <div class="artd-layout">

            <!-- Contenu -->
            <article class="artd-content">
              <div class="artd-rich" v-html="article.content"></div>

              <!-- Retour -->
              <div class="artd-footer">
                <router-link to="/blog" class="artd-back">
                  <i class="fa-solid fa-arrow-left"></i> {{ t('blog.detail.backToBlog') }}
                </router-link>
              </div>
            </article>

            <!-- Sidebar -->
            <aside class="artd-sidebar">

              <!-- Auteur -->
              <div v-if="article.entreprise" class="artd-side-card">
                <h3 class="artd-side-title">{{ t('blog.detail.publishedBy') }}</h3>
                <div class="artd-author">
                  <div class="artd-author-logo">
                    <img v-if="article.entreprise.logo_url" :src="article.entreprise.logo_url" :alt="article.entreprise.nom" />
                    <span v-else>{{ article.entreprise.nom.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="artd-author-name">{{ article.entreprise.nom }}</p>
                    <router-link :to="`/entreprises/${article.entreprise.id}`" class="artd-author-link">
                      {{ t('blog.detail.viewProfile') }} <i class="fa-solid fa-arrow-right" style="font-size:10px;"></i>
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Catégories -->
              <div v-if="article.media_categories?.length" class="artd-side-card">
                <h3 class="artd-side-title">{{ t('blog.detail.categories') }}</h3>
                <div class="artd-side-cats">
                  <router-link
                    v-for="cat in article.media_categories"
                    :key="cat.id"
                    :to="`/blog?category=${cat.id}`"
                    class="artd-side-cat"
                  >{{ cat.name }}</router-link>
                </div>
              </div>

              <!-- CTA -->
              <div class="artd-side-card artd-side-cta">
                <p>{{ t('blog.detail.ctaText') }}</p>
                <router-link to="/register" class="btn btn--blue" style="display:block;text-align:center;">
                  {{ t('blog.detail.ctaAction') }}
                </router-link>
              </div>

              <!-- Partage -->
              <ShareCard :text="article.title" />

            </aside>
          </div>
        </div>
      </section>

    </template>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import ShareCard from './ShareCard.vue'

const { t, locale } = useI18n()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route   = useRoute()
const article = ref(null)
const loading = ref(true)

const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/articles/${route.params.id}`)
    article.value = res.data
  } catch {
    article.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (iso) => {
  if (!iso) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(iso).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(load)
</script>

<style scoped>
.article-detail-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

.artd-loading {
  min-height: 50vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  color: var(--body-text); font-size: 15px;
}
.artd-loading i { font-size: 42px; opacity: .4; }

/* ── Hero ── */
.artd-hero {
  position: relative;
  padding: 80px 0 60px;
  background: linear-gradient(135deg, #192bc2 0%, #2687e9 100%);
  background-size: cover; background-position: center;
  min-height: 320px; display: flex; align-items: flex-end;
}
.artd-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(4,10,93,.5) 0%, rgba(4,10,93,.85) 100%);
}
.artd-hero-content { position: relative; z-index: 1; max-width: 800px; }

.artd-cats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.artd-cat-badge {
  background: rgba(255,255,255,.2); color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  padding: 3px 12px; border-radius: 50px;
}

.artd-title {
  font-size: 34px; font-weight: 800; color: #fff;
  margin: 0 0 16px; line-height: 1.2;
}
@media (max-width: 600px) { .artd-title { font-size: 24px; } }

.artd-hero-meta { display: flex; gap: 16px; flex-wrap: wrap; }
.artd-hero-meta span { font-size: 14px; color: rgba(255,255,255,.85); display: flex; align-items: center; gap: 6px; }
.artd-hero-meta i    { color: rgba(255,255,255,.6); }

/* ── Corps ── */
.artd-body { padding: 48px 0 80px; }
.artd-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px; align-items: start;
}
@media (max-width: 900px) {
  .artd-layout { grid-template-columns: 1fr; }
  .artd-sidebar { order: -1; }
}

/* Contenu article */
.artd-content {
  background: #fff; border-radius: 14px;
  padding: 36px; box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.artd-rich {
  font-size: 15px; color: var(--navy); line-height: 1.9;
}
.artd-rich :deep(h1), .artd-rich :deep(h2), .artd-rich :deep(h3) {
  font-weight: 700; color: var(--navy); margin: 1.5em 0 .75em;
}
.artd-rich :deep(h2) { font-size: 20px; }
.artd-rich :deep(h3) { font-size: 17px; }
.artd-rich :deep(p)  { margin: 0 0 1em; }
.artd-rich :deep(ul), .artd-rich :deep(ol) { padding-left: 24px; margin: .75em 0; }
.artd-rich :deep(li) { margin-bottom: 6px; }
.artd-rich :deep(strong) { font-weight: 700; }
.artd-rich :deep(em)     { font-style: italic; }
.artd-rich :deep(a) { color: var(--blue); }
.artd-rich :deep(img) { max-width: 100%; border-radius: 8px; margin: 16px 0; }
.artd-rich :deep(blockquote) {
  border-left: 4px solid var(--blue); padding-left: 16px;
  color: var(--body-text); font-style: italic; margin: 1em 0;
}

.artd-footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border, #e2e8f0); }
.artd-back {
  font-size: 14px; font-weight: 600; color: var(--blue);
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  transition: gap .2s;
}
.artd-back:hover { gap: 12px; }

/* Sidebar */
.artd-sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 90px; }
.artd-side-card {
  background: #fff; border-radius: 14px;
  padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.artd-side-title { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 16px; }

.artd-author { display: flex; gap: 12px; align-items: center; }
.artd-author-logo {
  width: 48px; height: 48px; border-radius: 10px; background: var(--light-bg, #f5f7fa);
  display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
}
.artd-author-logo img  { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.artd-author-logo span { font-size: 20px; font-weight: 800; color: var(--blue); }
.artd-author-name { font-size: 14px; font-weight: 700; color: var(--navy); margin: 0 0 4px; }
.artd-author-link {
  font-size: 12px; color: var(--blue); text-decoration: none;
  display: inline-flex; align-items: center; gap: 5px;
}
.artd-author-link:hover { text-decoration: underline; }

.artd-side-cats { display: flex; flex-wrap: wrap; gap: 8px; }
.artd-side-cat {
  background: rgba(38,135,233,.1); color: var(--blue);
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  padding: 4px 12px; border-radius: 50px; text-decoration: none;
  transition: background .15s;
}
.artd-side-cat:hover { background: var(--blue); color: #fff; }

.artd-side-cta { background: linear-gradient(135deg, #040a5d, #192bc2); }
.artd-side-cta p { font-size: 14px; color: rgba(255,255,255,.85); margin: 0 0 16px; text-align: center; }
</style>
