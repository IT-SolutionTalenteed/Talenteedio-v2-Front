<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-folder" class="mr-2" />
      <v-toolbar-title>{{ t('admin.mediaCategories.title') }}</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminMediaCategoryCreate' })">
        {{ t('admin.mediaCategories.addCategory') }}
      </v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="categories"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.is_active="{ item }">
        <v-chip v-if="item.is_active" size="small" color="success">{{ t('admin.mediaCategories.active') }}</v-chip>
        <v-chip v-else size="small">{{ t('admin.mediaCategories.inactive') }}</v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="router.push({ name: 'AdminMediaCategoryEdit', params: { id: item.id } })" />
        <v-btn icon="mdi-trash-can" size="small" color="error" variant="text" @click="deleteCategory(item.id)" />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import mediaCategoryService from '../../services/mediaCategoryService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()
const categories = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: 'ID', key: 'id', width: '80px' },
  { title: t('admin.mediaCategories.name'), key: 'name' },
  { title: t('admin.mediaCategories.description'), key: 'description' },
  { title: t('admin.mediaCategories.slug'), key: 'slug' },
  { title: t('admin.mediaCategories.status'), key: 'is_active', width: '120px' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
])

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await mediaCategoryService.getAll()
    categories.value = response.data.data || response.data
  } catch {
    showSnack(t('admin.mediaCategories.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (id) => {
  const ok = await confirmRef.value.open({ message: t('admin.mediaCategories.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await mediaCategoryService.delete(id)
    showSnack(t('admin.mediaCategories.categoryDeleted'))
    await loadCategories()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.mediaCategories.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>
