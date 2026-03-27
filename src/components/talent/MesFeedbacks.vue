<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Mes feedbacks</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Dialog édition feedback -->
    <v-dialog v-model="dialog" max-width="500" scrollable>
      <v-card rounded="xl">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-body-1">Modifier le feedback</v-toolbar-title>
          <template #append><v-btn icon="mdi-close" variant="text" color="white" @click="cancelForm" /></template>
        </v-toolbar>
        <v-card-text class="pa-4">
          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-2">Note</div>
            <v-rating v-model="editForm.note" :length="5" color="warning" hover density="compact" />
          </div>
          <v-textarea
            v-model="editForm.commentaire"
            label="Commentaire"
            rows="4"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="cancelForm">Annuler</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="sauvegarder">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDialog ref="confirmRef" />

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.note="{ item }">
        <v-rating
          :model-value="item.note"
          readonly
          density="compact"
          size="small"
          color="warning"
        />
      </template>

      <template #item.commentaire="{ item }">
        <span>{{ item.commentaire || '—' }}</span>
      </template>

      <template #item.entretien.date="{ item }">
        {{ item.entretien?.date }}
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="startEdit(item)" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="supprimer(item)" />
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
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const editingItem = ref(null)
const editForm = ref({ note: 1, commentaire: '' })
const saving = ref(false)
const dialog = ref(false)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const confirmRef = ref(null)

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
  editingItem.value = fb
  editForm.value = { note: fb.note, commentaire: fb.commentaire || '' }
  error.value = ''
  success.value = ''
  dialog.value = true
}

const cancelForm = () => {
  dialog.value = false
  editingItem.value = null
}

const sauvegarder = async () => {
  saving.value = true
  error.value = ''
  try {
    const res = await feedbackService.update(editingItem.value.id, editForm.value)
    const idx = items.value.findIndex(f => f.id === editingItem.value.id)
    if (idx !== -1) items.value[idx] = res.data
    dialog.value = false
    editingItem.value = null
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
  const ok = await confirmRef.value.open({ message: 'Supprimer ce feedback ?' })
  if (!ok) return
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
