<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-folder me-2"></i>
          Gestion des Catégories Média
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="showCreateForm = true">
            <i class="bi bi-plus"></i>
            Ajouter une catégorie
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showCreateForm || editingCategory" class="card-body border-bottom">
        <h4 class="mb-3">{{ editingCategory ? 'Modifier' : 'Créer' }} une catégorie</h4>

        <form @submit.prevent="saveCategory">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label required">Nom</label>
              <input type="text" class="form-control" v-model="form.name" required />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-check">
                <input type="checkbox" class="form-check-input" v-model="form.is_active" />
                <span class="form-check-label">Active</span>
              </label>
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="form.description" rows="3"></textarea>
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
              <th>Nom</th>
              <th>Description</th>
              <th>Slug</th>
              <th>Statut</th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="categories.length === 0">
              <td colspan="6" class="text-center text-muted">Aucune catégorie trouvée.</td>
            </tr>
            <tr v-else v-for="category in categories" :key="category.id">
              <td class="text-muted">{{ category.id }}</td>
              <td class="fw-bold">{{ category.name }}</td>
              <td class="text-muted">{{ category.description || '-' }}</td>
              <td class="text-muted">{{ category.slug }}</td>
              <td>
                <span v-if="category.is_active" class="badge bg-success">Active</span>
                <span v-else class="badge">Inactive</span>
              </td>
              <td>
                <div class="btn-list">
                  <button class="btn btn-sm btn-primary" @click="editCategory(category)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)">
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
