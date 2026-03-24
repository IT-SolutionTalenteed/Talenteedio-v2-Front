<template>
  <div>
    <h2>Gestion des CGU / Mentions légales</h2>

    <button @click="showForm = true">Ajouter une page légale</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} une page légale</h3>
      <form @submit.prevent="save">
        <div>
          <label for="title">Titre:</label>
          <input type="text" id="title" v-model="form.title" required />
        </div>
        <div>
          <label for="description">Contenu:</label>
          <textarea id="description" v-model="form.description" rows="10" required></textarea>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <button type="button" @click="cancelForm">Annuler</button>
      </form>
    </div>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>ID</th><th>Titre</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucune page légale trouvée.</p></div>

    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="success" style="color: green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import legalPageService from '../../services/legalPageService.js'

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
