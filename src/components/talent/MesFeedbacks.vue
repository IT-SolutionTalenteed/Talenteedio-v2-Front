<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Mes feedbacks</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.note="{ item }">
        <v-rating
          v-if="editingId !== item.id"
          :model-value="item.note"
          readonly
          density="compact"
          size="small"
          color="warning"
        />
        <v-rating
          v-else
          v-model="editForm.note"
          :length="5"
          color="warning"
          hover
          density="compact"
        />
      </template>

      <template #item.commentaire="{ item }">
        <span v-if="editingId !== item.id">{{ item.commentaire || '—' }}</span>
        <v-textarea
          v-else
          v-model="editForm.commentaire"
          rows="2"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width:200px;"
        />
      </template>

      <template #item.entretien.date="{ item }">
        {{ item.entretien?.date }}
      </template>

      <template #item.actions="{ item }">
        <template v-if="editingId !== item.id">
          <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="startEdit(item)" />
          <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="supprimer(item)" />
        </template>
        <template v-else>
          <v-btn size="small" color="success" variant="tonal" :disabled="saving" :loading="saving" class="mr-1" @click="sauvegarder(item)">
            Sauvegarder
          </v-btn>
          <v-btn size="small" variant="text" @click="editingId = null">Annuler</v-btn>
        </template>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun feedback soumis.</div>
      </template>
    </v-data-table>
  </v-card>
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

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Entreprise', key: 'entretien.entreprise.nom' },
  { title: 'Événement', key: 'entretien.evenement.titre' },
  { title: 'Date entretien', key: 'entretien.date' },
  { title: 'Note', key: 'note', sortable: false },
  { title: 'Commentaire', key: 'commentaire', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await feedbackService.mesFeedbacks()
    items.value = res.data
  } catch {
    error.value = 'Erreur lors du chargement des feedbacks'
    showSnack('Erreur lors du chargement des feedbacks', 'error')
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
    showSnack('Feedback modifié.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la modification'
    showSnack(error.value, 'error')
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
    showSnack('Feedback supprimé.')
  } catch {
    error.value = 'Erreur lors de la suppression'
    showSnack('Erreur lors de la suppression', 'error')
  }
}

onMounted(load)
</script>
