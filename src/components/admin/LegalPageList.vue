<template>
  <div class="container-xl">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-file-earmark-ruled me-2"></i>
          Gestion des CGU / Mentions légales
        </h3>
        <div class="card-actions">
          <button class="btn btn-primary" @click="showForm = true">
            <i class="bi bi-plus"></i>
            Ajouter une page légale
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="showForm || editingItem" class="card-body border-bottom">
        <h4 class="mb-3">{{ editingItem ? 'Modifier' : 'Créer' }} une page légale</h4>

        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label required">Titre</label>
            <input type="text" class="form-control" v-model="form.title" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Contenu</label>
            <WysiwygEditor v-model="form.description" />
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
              <th>Titre</th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="3" class="text-center text-muted">Aucune page légale trouvée.</td>
            </tr>
            <tr v-else v-for="item in items" :key="item.id">
              <td class="text-muted">{{ item.id }}</td>
              <td class="fw-bold">{{ item.title }}</td>
              <td>
                <div class="btn-list">
                  <button class="btn btn-sm btn-primary" @click="editItem(item)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">
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
import legalPageService from '../../services/legalPageService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const form = ref({ title: '', description: '' })

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await legalPageService.getAll()
    items.value = response.data
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    if (editingItem.value) {
      await legalPageService.update(editingItem.value.id, form.value)
      success.value = 'Page légale modifiée avec succès'
    } else {
      await legalPageService.create(form.value)
      success.value = 'Page légale créée avec succès'
    }
    await load()
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'enregistrement"
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  editingItem.value = item
  form.value = { title: item.title, description: item.description }
  showForm.value = false
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette page légale ?')) return
  loading.value = true
  error.value = ''
  try {
    await legalPageService.delete(id)
    success.value = 'Page légale supprimée avec succès'
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
  editingItem.value = null
  form.value = { title: '', description: '' }
}

onMounted(load)
</script>
