<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2" color="primary">mdi-sitemap-outline</v-icon>
      <v-toolbar-title class="text-body-1 font-weight-semibold">Gestion des Secteurs d'activité</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="dialog = true">Ajouter</v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="editItem(item)" />
        <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="deleteItem(item.id)" />
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialog" max-width="480">
    <v-card rounded="xl">
      <v-card-title class="pa-4 pb-2">{{ editingItem ? 'Modifier' : 'Créer' }} un secteur</v-card-title>
      <v-card-text class="pa-4">
        <v-text-field v-model="form.name" label="Nom" required variant="outlined" density="compact" autofocus />
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="cancelForm">Annuler</v-btn>
        <v-btn color="primary" variant="flat" :loading="loading" @click="save">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import activitySectorService from '../../services/activitySectorService.js'

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nom', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '120px' },
]

const items = ref([])
const loading = ref(false)
const dialog = ref(false)
const editingItem = ref(null)
const form = ref({ name: '' })
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const load = async () => {
  loading.value = true
  try {
    const res = await activitySectorService.getAll()
    items.value = res.data
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const save = async () => {
  loading.value = true
  try {
    if (editingItem.value) {
      await activitySectorService.update(editingItem.value.id, form.value)
      showSnack('un secteur modifié(e) avec succès')
    } else {
      await activitySectorService.create(form.value)
      showSnack('un secteur créé(e) avec succès')
    }
    await load()
    cancelForm()
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  editingItem.value = item
  form.value = { name: item.name }
  dialog.value = true
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer ce secteur d\'activité ?')) return
  loading.value = true
  try {
    await activitySectorService.delete(id)
    showSnack('Supprimé avec succès')
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  dialog.value = false
  editingItem.value = null
  form.value = { name: '' }
}

onMounted(load)
</script>
