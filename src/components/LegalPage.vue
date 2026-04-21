<template>
  <div class="page-wrapper">
    <div class="legal-page">
    <PublicNav />

    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ t('auth.legal.loading') }}</p>
    </div>

    <div v-else-if="error" class="error-container">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>{{ error }}</p>
      <router-link to="/" class="btn btn--blue">{{ t('auth.legal.backHome') }}</router-link>
    </div>

    <div v-else-if="page" class="legal-content">
      <div class="container">
        <h1 v-text="page.title"></h1>
        <div class="content" v-html="page.description"></div>
      </div>
    </div>

    </div>

    <!-- ══ FOOTER ══ -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../services/api.js'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'

const { t } = useI18n()
const route = useRoute()

const page = ref(null)
const loading = ref(true)
const error = ref('')

const load = async () => {
  loading.value = true
  error.value = ''
  page.value = null

  try {
    if (route.params.slug) {
      const response = await api.get(`/legal-pages/${route.params.slug}`)
      page.value = response.data
    } else {
      error.value = t('auth.legal.notFound')
    }
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = t('auth.legal.notFoundDetail')
    } else {
      error.value = t('auth.legal.loadError')
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.fullPath, load)
</script>


<style scoped>
.legal-page {
  min-height: 100vh;
  background: var(--light-bg, #f5f7fa);
}

.loading, .error-container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--body-text);
}

.loading i, .error-container i {
  font-size: 42px;
  opacity: 0.4;
}

.legal-content {
  padding: 60px 0 80px;
}

.legal-content h1 {
  font-size: 36px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 32px;
  text-align: center;
}

.content {
  background: #fff;
  border-radius: 14px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.8;
  color: var(--navy);
}

.content :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 16px;
  color: var(--navy);
}

.content :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: var(--navy);
}

.content :deep(p) {
  margin-bottom: 16px;
}

.content :deep(ul), .content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.content :deep(li) {
  margin-bottom: 8px;
}

.content :deep(a) {
  color: var(--blue);
  text-decoration: underline;
}

.content :deep(a:hover) {
  color: var(--orange);
}

.content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}

.content :deep(th), .content :deep(td) {
  border: 1px solid var(--border, #e2e8f0);
  padding: 12px;
  text-align: left;
}

.content :deep(th) {
  background: var(--light-bg, #f5f7fa);
  font-weight: 600;
}

.content :deep(blockquote) {
  border-left: 4px solid var(--blue);
  padding-left: 20px;
  margin: 24px 0;
  font-style: italic;
  color: var(--body-text);
}
</style>
