<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-file-document-outline" class="mr-2" />
      <v-toolbar-title>Gestion des CGU / Mentions légales</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminLegalPageCreate' })">
        Ajouter une page légale
      </v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.slug="{ item }">
        <a :href="`/legal/${item.slug}`" target="_blank" class="text-caption text-primary">/legal/{{ item.slug }}</a>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="router.push({ name: 'AdminLegalPageEdit', params: { id: item.id } })" />
        <v-btn icon="mdi-trash-can" size="small" color="error" variant="text" @click="deleteItem(item.id)" />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import legalPageService from '../../services/legalPageService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const items = ref([])
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
  { title: 'Titre', key: 'title' },
  { title: 'URL publique', key: 'slug', sortable: false },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const response = await legalPageService.getAll()
    items.value = response.data
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cette page légale ?' })
  if (!ok) return
  loading.value = true
  try {
    await legalPageService.delete(id)
    showSnack('Page légale supprimée avec succès')
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
