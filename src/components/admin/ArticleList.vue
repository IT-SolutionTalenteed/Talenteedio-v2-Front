<template>
  <div>
    <h2>Gestion des Articles</h2>
    
    <button @click="showCreateForm = true">Ajouter un article</button>
    
    <!-- Formulaire de création/édition -->
    <div v-if="showCreateForm || editingArticle">
      <h3>{{ editingArticle ? 'Modifier' : 'Créer' }} un article</h3>
      
      <form @submit.prevent="saveArticle">
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
          <textarea 
            id="content" 
            v-model="form.content"
            rows="10"
            required
          ></textarea>
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

const articles = ref([])
const mediaCategories = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showCreateForm = ref(false)
const editingArticle = ref(null)

const form = ref({
  title: '',
  content: '',
  is_published: false,
  media_category_ids: []
})

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
    if (editingArticle.value) {
      await articleService.update(editingArticle.value.id, form.value)
      success.value = 'Article modifié avec succès'
    } else {
      await articleService.create(form.value)
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