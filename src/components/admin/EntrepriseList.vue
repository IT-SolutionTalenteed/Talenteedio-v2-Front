<template>
  <div>
    <h2>Gestion des Entreprises</h2>

    <button @click="openCreate">Ajouter une entreprise</button>

    <div v-if="showForm || editingItem">
      <h3>{{ editingItem ? 'Modifier' : 'Créer' }} une entreprise</h3>

      <form @submit.prevent="save">
        <div>
          <label>Nom *</label>
          <input type="text" v-model="form.nom" required />
        </div>

        <div>
          <label>Email *</label>
          <input type="email" v-model="form.email" required :disabled="!!editingItem" />
          <small v-if="!editingItem">Un email avec les identifiants sera envoyé à cette adresse.</small>
        </div>

        <div>
          <button type="submit" :disabled="loading">{{ loading ? 'Enregistrement...' : 'Enregistrer' }}</button>
          <button type="button" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Liste -->
    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nom</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nom }}</td>
            <td>{{ item.user?.email || '-' }}</td>
            <td>
              <button @click="editItem(item)">Modifier</button>
              <button @click="deleteItem(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucune entreprise trouvée.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import entrepriseService from '../../services/entrepriseService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)

const emptyForm = () => ({ nom: '', email: '' })
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await entrepriseService.getAll()
    items.value = res.data
  } catch (err) {
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  showForm.value = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    nom: item.nom,
    email: item.user?.email || '',
  }
  showForm.value = false
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    if (editingItem.value) {
      await entrepriseService.update(editingItem.value.id, form.value)
      success.value = 'Entreprise modifiée avec succès'
    } else {
      await entrepriseService.create(form.value)
      success.value = 'Entreprise créée — identifiants envoyés par email'
    }
    await load()
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette entreprise et son compte utilisateur ?')) return
  loading.value = true
  error.value = ''
  try {
    await entrepriseService.delete(id)
    success.value = 'Entreprise supprimée avec succès'
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
  form.value = emptyForm()
}

onMounted(load)
</script>
