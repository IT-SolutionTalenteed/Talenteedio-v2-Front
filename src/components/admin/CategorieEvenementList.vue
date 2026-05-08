<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-tag-multiple</v-icon>
      <v-toolbar-title>{{ t('admin.eventCategories.title') }}</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminCategorieEvenementCreate' })">
          {{ t('admin.eventCategories.addCategory') }}
        </v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
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

      <template #item.galerie="{ item }">
        <v-chip size="small" color="blue">{{ item.galerie?.length || 0 }} {{ t('admin.eventCategories.files') }}</v-chip>
      </template>

      <template #item.temoignages="{ item }">
        <v-chip size="small" color="purple">{{ item.temoignages?.length || 0 }}</v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminCategorieEvenementEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import categorieEvenementService from '../../services/categorieEvenementService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: t('admin.eventCategories.image'), key: 'image', sortable: false, width: '60px' },
  { title: t('admin.eventCategories.titleField'), key: 'titre', sortable: true },
  { title: t('admin.eventCategories.gallery'), key: 'galerie', sortable: false },
  { title: t('admin.eventCategories.testimonials'), key: 'temoignages', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
])

const load = async () => {
  loading.value = true
  try {
    const res = await categorieEvenementService.getAll()
    items.value = res.data
  } catch {
    showSnack(t('admin.eventCategories.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value?.open({ 
    title: t('admin.eventCategories.confirmDelete'), 
    message: t('admin.referential.confirmDelete') 
  })
  if (!ok) return
  loading.value = true
  try {
    await categorieEvenementService.delete(id)
    showSnack(t('admin.eventCategories.categoryDeleted'))
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.eventCategories.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
