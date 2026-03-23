<template>
  <div>
    <h2>Gestion des Catégories Média</h2>
    
    <button @click="showCreateForm = true">Ajouter une catégorie</button>
    
    <!-- Formulaire de création/édition -->
    <div v-if="showCreateForm || editingCategory">
      <h3>{{ editingCategory ? 'Modifier' : 'Créer' }} une catégorie</h3>
      
      <form @submit.prevent="saveCategory">
        <div>
          <label for="name">Nom:</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required 
          />
        </div>
        
        <div>
          <label for="description">Description:</label>
          <textarea 
            id="description" 
            v-model="form.description"
            rows="3"
          ></textarea>
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              v-model="form.is_active"
            />
            Active
          </label>
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        
        <button type="button" @click="cancelForm">Annuler</button>
      </form>
    </div>
    
    <!-- Liste des catégories -->
    <div v-if="categories.length > 0">
      <h3>Liste des catégories</h3>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Slug</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description || '-' }}</td>
            <td>{{ category.slug }}</td>
            <td>{{ category.is_active ? 'Active' : 'Inactive' }}</td>
            <td>
              <button @click="editCategory(category)">Modifier</button>
              <button @click="deleteCategory(category.id)" style="background-color: #dc3545;">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else-if="!loading">
      <p>Aucune catégorie trouvée.</p>
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
import mediaCategoryService from '../../services/mediaCategoryService.js'

const categories = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showCreateForm = ref(false)
const editingCategory = ref(null)

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
    error.value = 'Erreur lors du chargement des catégories'
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
      success.value = 'Catégorie modifiée avec succès'
    } else {
      await mediaCategoryService.create(form.value)
      success.value = 'Catégorie créée avec succès'
    }
    
    await loadCategories()
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'enregistrement'
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
}

const deleteCategory = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await mediaCategoryService.delete(id)
    success.value = 'Catégorie supprimée avec succès'
    await loadCategories()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
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
}

onMounted(() => {
  loadCategories()
})
</script>