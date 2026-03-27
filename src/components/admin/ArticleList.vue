<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-file-earmark-text me-2"></i>
          Gestion des Articles
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="showCreateForm = true">
            <i class="bi bi-plus"></i>
            Ajouter un article
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showCreateForm || editingArticle" class="card-body border-bottom">
        <h4 class="mb-3">{{ editingArticle ? 'Modifier' : 'Créer' }} un article</h4>

        <form @submit.prevent="saveArticle">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label required">Titre</label>
              <input type="text" class="form-control" v-model="form.title" required />
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Contenu</label>
              <WysiwygEditor v-model="form.content" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Catégories Média</label>
              <select class="form-select" v-model="form.media_category_ids" multiple size="5">
                <option v-for="category in mediaCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <small class="form-hint">Maintenez Ctrl/Cmd pour sélectionner plusieurs</small>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Image</label>
              <input type="file" class="form-control" accept="image/*" @change="onImageChange" />
              <img v-if="imagePreview" :src="imagePreview" class="mt-2 avatar avatar-xl" />
              <img v-else-if="editingArticle?.image_url" :src="editingArticle.image_url" class="mt-2 avatar avatar-xl" />
            </div>

            <div class="col-12 mb-3">
              <label class="form-check">
                <input type="checkbox" class="form-check-input" v-model="form.is_published" />
                <span class="form-check-label">Publié</span>
              </label>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" class="btn" @click="cancelForm">Annuler</button>
          </div>
        </form>
      </div>

      <!-- Liste -->
      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Titre</th>
              <th>Slug</th>
              <th>Statut</th>
              <th>Catégories</th>
              <th>Auteur</th>
              <th>Date</th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="articles.length === 0">
              <td colspan="9" class="text-center text-muted">Aucun article trouvé.</td>
            </tr>
            <tr v-else v-for="article in articles" :key="article.id">
              <td class="text-muted">{{ article.id }}</td>
              <td>
                <img v-if="article.image_url" :src="article.image_url" class="avatar" />
                <span v-else class="avatar">?</span>
              </td>
              <td>
                <div class="fw-bold">{{ article.title }}</div>
                <div class="text-muted small">{{ article.slug }}</div>
              </td>
              <td class="text-muted">{{ article.slug }}</td>
              <td>
                <span v-if="article.is_published" class="badge bg-success">Publié</span>
                <span v-else class="badge">Brouillon</span>
              </td>
              <td>
                <span v-if="article.media_categories?.length" class="badge">
                  {{ article.media_categories.map(cat => cat.name).join(', ') }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>{{ article.user?.name || '-' }}</td>
              <td class="text-muted">{{ formatDate(article.created_at) }}</td>
              <td>
                <div class="btn-list">
                  <button class="btn btn-sm btn-primary" @click="editArticle(article)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteArticle(article.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Messages -->
      <div v-if="error || success" class="card-footer">
        <div v-if="error" class="alert alert-danger mb-0">{{ error }}</div>
        <div v-if="success" class="alert alert-success mb-0">{{ success }}</div>
      </div>
    </div>
  </div>
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

    await loadArticles()
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'enregistrement'
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
    await loadArticles()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
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
