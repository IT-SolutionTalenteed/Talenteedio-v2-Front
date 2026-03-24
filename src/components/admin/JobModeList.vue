<template>
  <div>
    <h2>Gestion des Modes de travail</h2>

    <button @click="showForm = true">Ajouter un mode</button>

    <!-- Formulaire création/édition -->
    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} un mode de travail</h3>

      <form @submit.prevent="save">
        <div>
          <label for="name">Nom:</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <button type="button" @click="cancelForm">Annuler</button>
      </form>
    </div>

    <!-- Liste -->
    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading">
      <p>Aucun mode de travail trouvé.</p>
    </div>

    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="success" style="color: green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import jobModeService from '../../services/jobModeService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)

const form = ref({ name: '' })

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await jobModeService.getAll()
    items.value = response.data
  } catch (err) {
    error.value = 'Erreur lors du chargement'
    console.error(err)
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
      await jobModeService.update(editingItem.value.id, form.value)
      success.value = 'Mode modifié avec succès'
    } else {
      await jobModeService.create(form.value)
      success.value = 'Mode créé avec succès'
    }
    await load()
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  editingItem.value = item
  form.value = { name: item.name }
  showForm.value = false
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer ce mode de travail ?')) return
  loading.value = true
  error.value = ''
  try {
    await jobModeService.delete(id)
    success.value = 'Mode supprimé avec succès'
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
  form.value = { name: '' }
}

onMounted(load)
</script>
