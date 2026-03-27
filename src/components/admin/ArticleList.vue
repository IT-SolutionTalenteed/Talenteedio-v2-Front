<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-file-document-outline</v-icon>
      <v-toolbar-title>Gestion des Articles</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminArticleCreate' })">Ajouter un article</v-btn>
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
          {{ item.is_published ? 'Publié' : 'Brouillon' }}
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
        <span class="text-medium-emphasis">{{ formatDate(item.created_at) }}</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminArticleEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteArticle(item.id)" />
        </div>
      </template>
    </v-data-table>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import articleService from '../../services/articleService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const articles = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: 'Image', key: 'image', sortable: false, width: '60px' },
  { title: 'Titre', key: 'title', sortable: true },
  { title: 'Statut', key: 'is_published', sortable: false },
  { title: 'Catégories', key: 'media_categories', sortable: false },
  { title: 'Auteur', key: 'user', sortable: false },
  { title: 'Date', key: 'created_at', sortable: true },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const loadArticles = async () => {
  loading.value = true
  try {
    const response = await articleService.getAll()
    articles.value = response.data.data || response.data
  } catch {
    showSnack('Erreur lors du chargement des articles', 'error')
  } finally {
    loading.value = false
  }
}

const deleteArticle = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Êtes-vous sûr de vouloir supprimer cet article ?' })
  if (!ok) return
  loading.value = true
  try {
    await articleService.delete(id)
    showSnack('Article supprimé avec succès')
    await loadArticles()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR')

onMounted(loadArticles)
</script>
