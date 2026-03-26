<template>
  <div>
    <h2>Gestion des Articles</h2>

    <button @click="showCreateForm = true">Ajouter un article</button>

    <!-- Formulaire de création/édition -->
    <div v-if="showCreateForm || editingArticle">
      <h3>{{ editingArticle ? 'Modifier' : 'Créer' }} un article</h3>

      <form @submit.prevent="saveArticle" enctype="multipart/form-data">
        <div>
          <label for="title">Titre:</label>
          <input
            type="text"
            id="title"
            v-model="form.title"
            required
          />
        </div>

        <div>
          <label for="content">Contenu:</label>
          <WysiwygEditor v-model="form.content" />
        </div>

        <div>
          <label for="media_categories">Catégories Média:</label>
          <select
            id="media_categories"
            v-model="form.media_category_ids"
            multiple
          >
            <option
              v-for="category in mediaCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <small>Maintenez Ctrl/Cmd pour sélectionner plusieurs catégories</small>
        </div>

        <div>
          <label for="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
            @change="onImageChange"
          />
          <div v-if="imagePreview">
            <img :src="imagePreview" alt="Aperçu" style="max-width: 200px; max-height: 200px;" />
          </div>
          <div v-else-if="editingArticle && editingArticle.image_url">
            <p>Image actuelle :</p>
            <img :src="editingArticle.image_url" alt="Image actuelle" style="max-width: 200px; max-height: 200px;" />
          </div>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              v-model="form.is_published"
            />
            Publié
          </label>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>

        <button type="button" @click="cancelForm">Annuler</button>
      </form>
    </div>

    <!-- Liste des articles -->
    <div v-if="articles.length > 0">
      <h3>Liste des articles</h3>

      <table>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id">
            <td>{{ article.id }}</td>
            <td>
              <img
                v-if="article.image_url"
                :src="article.image_url"
                alt="Image"
                style="max-width: 60px; max-height: 60px;"
              />
              <span v-else>-</span>
            </td>
            <td>{{ article.title }}</td>
            <td>{{ article.slug }}</td>
            <td>{{ article.is_published ? 'Publié' : 'Brouillon' }}</td>
            <td>
              <span v-if="article.media_categories && article.media_categories.length > 0">
                {{ article.media_categories.map(cat => cat.name).join(', ') }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ article.user?.name || '-' }}</td>
            <td>{{ formatDate(article.created_at) }}</td>
            <td>
              <button @click="editArticle(article)">Modifier</button>
              <button @click="deleteArticle(article.id)" style="background-color: #dc3545;">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading">
      <p>Aucun article trouvé.</p>
    </div>

    <div v-if="error" style="color: red;">
      {{ error }}
    </div>

    <div v-if="success" style="color: green;">
      {{ success }}
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
