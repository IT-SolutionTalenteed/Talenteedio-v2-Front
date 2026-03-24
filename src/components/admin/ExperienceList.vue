<template>
  <div>
    <h2>Gestion des Expériences professionnelles</h2>

    <button @click="showForm = true">Ajouter</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} un(e) expérience</h3>
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

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>ID</th><th>Nom</th><th>Actions</th></tr>
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
    <div v-else-if="!loading"><p>Aucun(e) expérience trouvé(e).</p></div>

    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="success" style="color: green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import experienceService from '../../services/experienceService.js'

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
    const response = await experienceService.getAll()
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
      await experienceService.update(editingItem.value.id, form.value)
      success.value = 'Modifié avec succès'
    } else {
      await experienceService.create(form.value)
      success.value = 'Créé avec succès'
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
  form.value = { name: item.name }
  showForm.value = false
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cet élément ?')) return
  loading.value = true
  error.value = ''
  try {
    await experienceService.delete(id)
    success.value = 'Supprimé avec succès'
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