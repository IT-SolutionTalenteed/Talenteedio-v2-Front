<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-folder" class="mr-2" />
      <v-toolbar-title>Gestion des Catégories Média</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
        Ajouter une catégorie
      </v-btn>
    </v-toolbar>

    <!-- Dialog formulaire -->
    <v-dialog v-model="dialog" max-width="600" scrollable>
      <v-card rounded="xl">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-body-1 font-weight-medium">
            {{ editingCategory ? 'Modifier' : 'Créer' }} une catégorie
          </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" variant="text" color="white" @click="cancelForm" />
          </template>
        </v-toolbar>
        <v-card-text class="pa-4">
          <form @submit.prevent="saveCategory">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Nom *"
                  variant="outlined"
                  density="compact"
                  required
                />
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="form.is_active"
                  label="Active"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  variant="outlined"
                  density="compact"
                  rows="3"
                />
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="cancelForm">Annuler</v-btn>
          <v-btn color="primary" variant="flat" :loading="loading" @click="saveCategory">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Table -->
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
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="editCategory(item)" />
        <v-btn icon="mdi-trash-can" size="small" color="error" variant="text" @click="deleteCategory(item.id)" />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">
      {{ snackMsg }}
    </v-snackbar>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mediaCategoryService from '../../services/mediaCategoryService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const categories = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showCreateForm = ref(false)
const editingCategory = ref(null)
const dialog = ref(false)

const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nom', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Slug', key: 'slug' },
  { title: 'Statut', key: 'is_active', width: '120px' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
]

const form = ref({
  name: '',
  description: '',
  is_active: true
})

const loadCategories = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await mediaCategoryService.getAll()
    categories.value = response.data.data || response.data
  } catch (err) {
    showSnack('Erreur lors du chargement des catégories', 'error')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveCategory = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    if (editingCategory.value) {
      await mediaCategoryService.update(editingCategory.value.id, form.value)
      showSnack('Catégorie modifiée avec succès')
    } else {
      await mediaCategoryService.create(form.value)
      showSnack('Catégorie créée avec succès')
    }

    await loadCategories()
    cancelForm()
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    loading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    is_active: category.is_active
  }
  showCreateForm.value = false
  dialog.value = true
}

const deleteCategory = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?' })
  if (!ok) return

  loading.value = true
  error.value = ''

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

const cancelForm = () => {
  showCreateForm.value = false
  editingCategory.value = null
  form.value = {
    name: '',
    description: '',
    is_active: true
  }
  dialog.value = false
}

onMounted(() => {
  loadCategories()
})
</script>
