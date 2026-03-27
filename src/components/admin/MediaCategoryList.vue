<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-folder" class="mr-2" />
      <v-toolbar-title>Gestion des Catégories Média</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminMediaCategoryCreate' })">
        Ajouter une catégorie
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
        <v-chip v-if="item.is_active" size="small" color="success">Active</v-chip>
        <v-chip v-else size="small">Inactive</v-chip>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mediaCategoryService from '../../services/mediaCategoryService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const categories = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nom', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Slug', key: 'slug' },
  { title: 'Statut', key: 'is_active', width: '120px' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
]

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await mediaCategoryService.getAll()
    categories.value = response.data.data || response.data
  } catch {
    showSnack('Erreur lors du chargement des catégories', 'error')
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?' })
  if (!ok) return
  loading.value = true
  try {
    await mediaCategoryService.delete(id)
    showSnack('Catégorie supprimée avec succès')
    await loadCategories()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>
