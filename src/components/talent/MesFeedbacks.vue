<template>
  <div>
    <h2>Mes feedbacks</h2>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr>
            <th>Entreprise</th>
            <th>Événement</th>
            <th>Date entretien</th>
            <th>Note</th>
            <th>Commentaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fb in items" :key="fb.id">
            <td>{{ fb.entretien?.entreprise?.nom }}</td>
            <td>{{ fb.entretien?.evenement?.titre }}</td>
            <td>{{ fb.entretien?.date }}</td>
            <td>
              <span v-if="editingId !== fb.id">{{ fb.note }} / 5</span>
              <input v-else type="number" v-model.number="editForm.note" min="1" max="5" style="width:50px;" />
            </td>
            <td>
              <span v-if="editingId !== fb.id">{{ fb.commentaire || '—' }}</span>
              <textarea v-else v-model="editForm.commentaire" rows="2" style="width:200px;"></textarea>
            </td>
            <td>
              <template v-if="editingId !== fb.id">
                <button @click="startEdit(fb)">Modifier</button>
                <button @click="supprimer(fb)" style="margin-left:4px;">Supprimer</button>
              </template>
              <template v-else>
                <button @click="sauvegarder(fb)" :disabled="saving">{{ saving ? '...' : 'Sauvegarder' }}</button>
                <button @click="editingId = null" style="margin-left:4px;">Annuler</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucun feedback soumis.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import feedbackService from '../../services/talent/feedbackService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const editingId = ref(null)
const editForm = ref({ note: 1, commentaire: '' })
const saving = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await feedbackService.mesFeedbacks()
    items.value = res.data
  } catch {
    error.value = 'Erreur lors du chargement des feedbacks'
  } finally {
    loading.value = false
  }
}

const startEdit = (fb) => {
  editingId.value = fb.id
  editForm.value = { note: fb.note, commentaire: fb.commentaire || '' }
  error.value = ''
  success.value = ''
}

const sauvegarder = async (fb) => {
  saving.value = true
  error.value = ''
  try {
    const res = await feedbackService.update(fb.id, editForm.value)
    const idx = items.value.findIndex(f => f.id === fb.id)
    if (idx !== -1) items.value[idx] = res.data
    editingId.value = null
    success.value = 'Feedback modifié.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la modification'
  } finally {
    saving.value = false
  }
}

const supprimer = async (fb) => {
  if (!confirm('Supprimer ce feedback ?')) return
  error.value = ''
  try {
    await feedbackService.destroy(fb.id)
    items.value = items.value.filter(f => f.id !== fb.id)
    success.value = 'Feedback supprimé.'
  } catch {
    error.value = 'Erreur lors de la suppression'
  }
}

onMounted(load)
</script>
