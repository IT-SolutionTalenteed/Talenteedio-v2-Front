<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-card-title class="text-h5 pa-0">Mes Articles</v-card-title>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="router.push('/entreprise/articles/create')">
        Rédiger un article
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
          {{ item.is_published ? 'Publié' : 'Brouillon' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="router.push('/entreprise/articles/' + item.id + '/edit')" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="deleteItem(item.id)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun article.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import articleService from '../../services/entreprise/articleService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Image', key: 'image_url', sortable: false },
  { title: 'Titre', key: 'title' },
  { title: 'Publié', key: 'is_published' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await articleService.getAll()
    items.value = res.data
  } catch {
    showSnack('Erreur chargement', 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cet article ?' })
  if (!ok) return
  loading.value = true
  try {
    await articleService.delete(id)
    showSnack('Article supprimé')
    await load()
  } catch {
    showSnack('Erreur suppression', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
