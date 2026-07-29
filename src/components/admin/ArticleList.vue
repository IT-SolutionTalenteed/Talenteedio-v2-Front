<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-file-document-outline</v-icon>
      <v-toolbar-title>{{ t('admin.articles.title') }}</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminArticleCreate' })">
          {{ t('admin.articles.addArticle') }}
        </v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="articles"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.image="{ item }">
        <v-avatar v-if="item.image_url" size="36" rounded="lg">
          <img :src="item.image_url" style="object-fit:cover;width:100%;height:100%" />
        </v-avatar>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template #item.title="{ item }">
        <div class="font-weight-bold">{{ item.title }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.slug }}</div>
      </template>

      <template #item.is_published="{ item }">
        <v-chip size="small" :color="item.is_published ? 'success' : 'default'">
          {{ item.is_published ? t('admin.articles.published') : t('admin.articles.draft') }}
        </v-chip>
      </template>

      <template #item.media_categories="{ item }">
        <template v-if="item.media_categories?.length">
          <v-chip v-for="cat in item.media_categories" :key="cat.id" size="x-small" class="mr-1">{{ cat.name }}</v-chip>
        </template>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template #item.user="{ item }">
        {{ item.user?.name || '—' }}
      </template>

      <template #item.created_at="{ item }">
        <span class="text-medium-emphasis">{{ formatDate(item.published_at || item.created_at) }}</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminArticleEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteArticle(item.id)" />
        </div>
      </template>
    </v-data-table>

    <v-pagination
      v-if="pagination.last_page > 1"
      v-model="pagination.current_page"
      :length="pagination.last_page"
      @update:model-value="loadPage"
      class="mt-2"
    />

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import articleService from '../../services/articleService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()
const articles = ref([])
const loading = ref(false)
const pagination = ref({ current_page: 1, last_page: 1 })
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: t('admin.articles.image'), key: 'image', sortable: false, width: '60px' },
  { title: t('admin.articles.titleField'), key: 'title', sortable: true },
  { title: t('admin.articles.status'), key: 'is_published', sortable: false },
  { title: t('admin.articles.categories'), key: 'media_categories', sortable: false },
  { title: t('admin.articles.author'), key: 'user', sortable: false },
  { title: t('admin.articles.date'), key: 'created_at', sortable: true },
  { title: '', key: 'actions', sortable: false, align: 'end' },
])

const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const res = await articleService.getAll(page)
    articles.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch {
    showSnack(t('admin.articles.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteArticle = async (id) => {
  const ok = await confirmRef.value.open({ message: t('admin.articles.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await articleService.delete(id)
    showSnack(t('admin.articles.articleDeleted'))
    await loadPage(pagination.value.current_page)
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.articles.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR')

onMounted(() => loadPage(1))
</script>
