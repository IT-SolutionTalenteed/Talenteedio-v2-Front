<template>
  <v-card rounded="xl" border elevation="0">
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Header -->
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-file-document-outline</v-icon>
      <v-toolbar-title>Gestion des Articles</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateForm = true">Ajouter un article</v-btn>
      </template>
    </v-toolbar>

    <!-- Formulaire -->
    <v-expand-transition>
      <div v-if="showCreateForm || editingArticle">
        <v-card variant="outlined" class="ma-4 mb-0">
          <v-card-title class="text-subtitle-1 pa-4 pb-2">
            {{ editingArticle ? 'Modifier' : 'Créer' }} un article
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="saveArticle">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="form.title" label="Titre *" variant="outlined" density="compact" required />
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis mb-1">Contenu</div>
                  <WysiwygEditor v-model="form.content" />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Catégories Média</div>
                  <select v-model="form.media_category_ids" multiple size="5" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                    <option v-for="category in mediaCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                  </select>
                  <div class="text-caption text-medium-emphasis mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs</div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Image</div>
                  <input type="file" accept="image/*" @change="onImageChange" style="display:block;width:100%;" />
                  <v-avatar v-if="imagePreview" size="80" rounded="lg" class="mt-2">
                    <img :src="imagePreview" style="object-fit:cover;width:100%;height:100%" />
                  </v-avatar>
                  <v-avatar v-else-if="editingArticle?.image_url" size="80" rounded="lg" class="mt-2">
                    <img :src="editingArticle.image_url" style="object-fit:cover;width:100%;height:100%" />
                  </v-avatar>
                </v-col>

                <v-col cols="12">
                  <v-checkbox v-model="form.is_published" label="Publié" density="compact" hide-details />
                </v-col>
              </v-row>

              <div class="d-flex gap-2 mt-2">
                <v-btn type="submit" color="primary" :loading="loading">Enregistrer</v-btn>
                <v-btn variant="tonal" @click="cancelForm">Annuler</v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>

    <!-- Tableau -->
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
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="editArticle(item)" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteArticle(item.id)" />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import articleService from '../../services/articleService.js'
import mediaCategoryService from '../../services/mediaCategoryService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const articles = ref([])
const mediaCategories = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showCreateForm = ref(false)
const editingArticle = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)

const snackbar  = ref(false)
const snackMsg  = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value   = msg
  snackColor.value = color
  snackbar.value   = true
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

const form = ref({
  title: '',
  content: '',
  is_published: false,
  media_category_ids: []
})

const onImageChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const buildFormData = () => {
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('content', form.value.content)
  formData.append('is_published', form.value.is_published ? '1' : '0')
  form.value.media_category_ids.forEach(id => {
    formData.append('media_category_ids[]', id)
  })
  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }
  return formData
}

const loadArticles = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await articleService.getAll()
    articles.value = response.data.data || response.data
  } catch (err) {
    error.value = 'Erreur lors du chargement des articles'
    showSnack('Erreur lors du chargement des articles', 'error')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadMediaCategories = async () => {
  try {
    const response = await mediaCategoryService.getAll()
    mediaCategories.value = response.data.data || response.data
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err)
  }
}

const saveArticle = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const formData = buildFormData()

    if (editingArticle.value) {
      await articleService.update(editingArticle.value.id, formData)
      success.value = 'Article modifié avec succès'
    } else {
      await articleService.create(formData)
      success.value = 'Article créé avec succès'
    }
    showSnack(success.value)

    await loadArticles()
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'enregistrement'
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const editArticle = (article) => {
  editingArticle.value = article
  form.value = {
    title: article.title,
    content: article.content,
    is_published: article.is_published,
    media_category_ids: article.media_categories ? article.media_categories.map(cat => cat.id) : []
  }
  imageFile.value = null
  imagePreview.value = null
  showCreateForm.value = false
}

const deleteArticle = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    await articleService.delete(id)
    success.value = 'Article supprimé avec succès'
    showSnack(success.value)
    await loadArticles()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showCreateForm.value = false
  editingArticle.value = null
  imageFile.value = null
  imagePreview.value = null
  form.value = {
    title: '',
    content: '',
    is_published: false,
    media_category_ids: []
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

onMounted(() => {
  loadArticles()
  loadMediaCategories()
})
</script>
