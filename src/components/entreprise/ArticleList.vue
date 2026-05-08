<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-card-title class="text-h5 pa-0">{{ t('companyDashboard.articles.title') }}</v-card-title>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="router.push('/entreprise/articles/create')">
        {{ t('companyDashboard.articles.writeArticle') }}
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.image_url="{ item }">
        <img v-if="item.image_url" :src="item.image_url" style="max-width:60px; border-radius:6px; display:block;" />
        <span v-else>-</span>
      </template>

      <template #item.is_published="{ item }">
        <v-chip size="small" :color="item.is_published ? 'success' : 'default'">
          {{ item.is_published ? t('companyDashboard.articles.published') : t('companyDashboard.articles.draft') }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="router.push('/entreprise/articles/' + item.id + '/edit')" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="deleteItem(item.id)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('companyDashboard.articles.noArticles') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import articleService from '../../services/entreprise/articleService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: t('companyDashboard.articles.image'), key: 'image_url', sortable: false },
  { title: t('companyDashboard.articles.titleField'), key: 'title' },
  { title: t('companyDashboard.articles.published'), key: 'is_published' },
  { title: t('companyDashboard.articles.actions'), key: 'actions', sortable: false, align: 'end' },
])

const load = async () => {
  loading.value = true
  try {
    const res = await articleService.getAll()
    items.value = res.data
  } catch {
    showSnack(t('companyDashboard.articles.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: t('companyDashboard.articles.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await articleService.delete(id)
    showSnack(t('companyDashboard.articles.articleDeleted'))
    await load()
  } catch {
    showSnack(t('companyDashboard.articles.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
